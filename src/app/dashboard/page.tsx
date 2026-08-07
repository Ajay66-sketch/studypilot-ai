
"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  FileText, BookOpen, AlertCircle, Sparkles, Copy, 
  Upload, History, Star, ShieldAlert,
  MousePointer2, Zap, ArrowRight, Layers, Rocket,
  GraduationCap, Printer, Info,
  Loader2
} from "lucide-react";
import { 
  summarizeNotesApi as summarizeNotes, 
  generateExamAnswerApi as generateExamAnswer, 
  generateImportantQuestionsApi as generateImportantQuestions, 
  generateRevisionSheetApi as generateRevisionSheet 
} from "@/services/ai-service";
import { checkUsageLimit, incrementUsage } from "@/lib/usage";
import { saveDocument, generateHash, findCachedDocument, updateOnboardingStatus, toggleFavorite } from "@/lib/document-services";
import { trackEvent } from "@/lib/analytics";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SUBJECTS = ["General", "Computer Science", "Maths", "Physics", "Chemistry", "Commerce", "Biology", "Mechanical", "Electronics", "Law", "Management"];
const ANSWER_MODES = [
  { id: 'short', label: 'Short (2 Marks)' },
  { id: 'medium', label: 'Medium (5 Marks)' },
  { id: 'long', label: 'Long (10+ Marks)' },
  { id: 'bullet', label: 'Bullet Points' }
];

export default function Dashboard() {
  const { user, userData } = useAuth();
  const { toast } = useToast();
  
  // States
  const [inputText, setInputText] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTool, setActiveTool] = useState("summarize");
  const [result, setResult] = useState<any>(null);
  const [currentDocId, setCurrentDocId] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [usage, setUsage] = useState({ used: 0, total: 5 });
  const [subject, setSubject] = useState("General");
  const [answerMode, setAnswerMode] = useState("medium");
  const [isExamBooster, setIsExamBooster] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const restored = sessionStorage.getItem('restore_doc');
    if (restored) {
      const doc = JSON.parse(restored);
      setInputText(doc.inputText);
      setTitle(doc.title);
      setActiveTool(doc.featureType);
      setResult(doc.outputText);
      setCurrentDocId(doc.id || null);
      setIsFavorite(doc.isFavorite || false);
      setSubject(doc.subject || "General");
      setAnswerMode(doc.answerMode || "medium");
      setIsExamBooster(doc.isExamBooster || false);
      sessionStorage.removeItem('restore_doc');
      toast({ title: "Study Pack Loaded", description: "Context restored to workspace." });
    }

    const fetchUsage = async () => {
      if (user) {
        try {
          const u = await checkUsageLimit(user.uid, userData?.plan || 'free');
          setUsage({ used: 5 - u.remaining, total: 5 });
          if (userData && !userData.onboardingCompleted) {
            setShowOnboarding(true);
          }
        } catch (error) {
          console.error("Failed to load usage limits from database:", error);
          // Set a safe fallback usage state so UI doesn't break
          setUsage({ used: 0, total: 5 });
        }
      }
    };
    fetchUsage();
  }, [user, userData, toast]);

  const parsePDFFile = async (file: File, pdfjsLib: any) => {
    try {
      toast({ title: "Parsing PDF...", description: "Extracting text content." });
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      let fullText = "";
      
      const pagesToParse = Math.min(pdf.numPages, 10);
      for (let i = 1; i <= pagesToParse; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(" ");
        fullText += pageText + "\n";
      }

      if (!fullText.trim()) {
        throw new Error("No readable text found. The document might be scanned or contain only images.");
      }

      setInputText(fullText.trim().slice(0, 15000));
      if (!title) setTitle(file.name.replace(".pdf", ""));
      toast({ title: "PDF Extracted", description: `Successfully loaded ${pagesToParse} page(s).` });
    } catch (err: any) {
      console.error("PDF parsing error:", err);
      toast({ 
        title: "Extraction Failed", 
        description: err.message || "Failed to extract text from PDF.", 
        variant: "destructive" 
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isTxt = file.type === "text/plain" || file.name.toLowerCase().endsWith(".txt");
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    if (isTxt) {
      const text = await file.text();
      setInputText(text);
      if (!title) setTitle(file.name.replace(/\.txt$/i, ""));
      toast({ title: "Text Uploaded", description: "Extracted file content." });
    } else if (isPdf) {
      const pdfjsLib = (window as any).pdfjsLib;
      if (!pdfjsLib) {
        toast({ title: "Loading PDF Engine", description: "Configuring browser parser..." });
        
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.onload = async () => {
          const loadedLib = (window as any).pdfjsLib;
          loadedLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          await parsePDFFile(file, loadedLib);
        };
        script.onerror = () => {
          toast({ title: "PDF Engine Failed", description: "Could not load PDF parsing library.", variant: "destructive" });
        };
        document.body.appendChild(script);
      } else {
        await parsePDFFile(file, pdfjsLib);
      }
    } else {
      toast({ title: "Format Error", description: "Use .txt or .pdf files.", variant: "destructive" });
    }
  };

  const handleToolAction = async (toolOverride?: string, textOverride?: string) => {
    const tool = toolOverride || activeTool;
    const input = textOverride || inputText;

    if (!input.trim()) {
      toast({ title: "Empty Input", description: "Please paste your notes.", variant: "destructive" });
      return;
    }

    setLoading(true);
    setResult(null);
    trackEvent(user!.uid, 'generation_started', { tool, subject });

    try {
      const usageLimit = await checkUsageLimit(user!.uid, userData?.plan || 'free');
      if (!usageLimit.allowed) {
        trackEvent(user!.uid, 'free_limit_hit');
        toast({ title: "Daily Limit Reached", description: "Upgrade to Pro for unlimited prep!", variant: "destructive" });
        setLoading(false);
        return;
      }

      // Normalized hash for better caching
      const hash = generateHash(input, tool, `${subject}:${answerMode}:${isExamBooster}`);
      const cached = await findCachedDocument(user!.uid, hash);
      
      if (cached) {
        setResult(cached.outputText);
        setCurrentDocId(cached.id || null);
        setIsFavorite(cached.isFavorite || false);
        toast({ title: "Restored", description: "Restoring from your library." });
        setLoading(false);
        return;
      }

      let aiResult;
      const baseInput = { subject, isExamBooster };

      switch (tool) {
        case "summarize":
          aiResult = await summarizeNotes({ notes: input, ...baseInput });
          break;
        case "answer":
          aiResult = await generateExamAnswer({ questionOrTopic: input, answerMode: answerMode as any, ...baseInput });
          break;
        case "questions":
          aiResult = await generateImportantQuestions({ chapterNotes: input, subject, isExamBooster });
          break;
        case "revision":
          aiResult = await generateRevisionSheet({ topic: input, subject, isExamBooster });
          break;
      }

      setResult(aiResult);
      await incrementUsage(user!.uid);
      setUsage(prev => ({ ...prev, used: prev.used + 1 }));
      trackEvent(user!.uid, 'generation_success', { tool });

      const savedDoc = await saveDocument({
        uid: user!.uid,
        inputText: input,
        outputText: aiResult,
        featureType: tool as any,
        title: title || "Generated Study Pack",
        cachedHash: hash,
        isPremiumOutput: userData?.plan !== 'free',
        subject,
        answerMode: tool === 'answer' ? answerMode : undefined,
        isExamBooster,
        isFavorite: false
      });
      
      setCurrentDocId(savedDoc.id);
    } catch (error) {
      console.error(error);
      trackEvent(user!.uid, 'generation_failed', { error: String(error) });
      toast({ title: "AI Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!currentDocId) return;
    const newStatus = !isFavorite;
    try {
      await toggleFavorite(currentDocId, newStatus);
      setIsFavorite(newStatus);
      toast({ title: newStatus ? "Favorited" : "Removed", description: "Study library updated." });
    } catch (e) {
      toast({ title: "Error", description: "Failed to update pack." });
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    if (!navigator.clipboard) {
      toast({ title: "Copy Failed", description: "Insecure browser context. Switch to HTTPS to use clipboard.", variant: "destructive" });
      return;
    }
    let content = "";
    if (activeTool === "summarize") {
      content = `${result.shortSummary || ""}\n\n${result.bulletPoints?.join('\n') || ""}`;
    } else if (activeTool === "answer") {
      content = `${result.title || ""}\n\n${result.introduction || ""}\n\n${result.mainBody || ""}\n\n${result.conclusion || ""}`;
    } else if (activeTool === "questions") {
      content = `MOST PROBABLE:\n${result.mostProbable?.join('\n') || ""}\n\n2 MARKS:\n${result.twoMarkQuestions?.join('\n') || ""}`;
    } else {
      content = `${result.quickNotes || ""}\n\nFORMULAS:\n${result.formulasAndDefinitions?.join('\n') || ""}`;
    }

    navigator.clipboard.writeText(content.replace(/\*\*/g, '').trim());
    toast({ title: "Copied!", description: "Ready to share." });
  };

  const chainToTool = (newTool: string) => {
    if (!result) return;
    let context = "";
    if (result.bulletPoints || result.shortSummary) {
      context = result.bulletPoints?.join("\n") || result.shortSummary || "";
    } else if (result.mainBody) {
      context = result.mainBody || "";
    } else if (result.mostProbable) {
      context = result.mostProbable?.join("\n") || "";
    } else if (result.quickNotes) {
      context = result.quickNotes || "";
    } else {
      context = result.shortSummary || result.mainBody || result.quickNotes || "";
    }

    if (!context.trim()) {
      toast({ title: "No Context", description: "Could not find any content to chain.", variant: "destructive" });
      return;
    }

    setInputText(context);
    setActiveTool(newTool);
    trackEvent(user!.uid, 'output_chained', { from: activeTool, to: newTool });
    handleToolAction(newTool, context);
  };

  const formatWithBold = (text: string) => {
    if (!text) return "";
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-primary font-black">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20 px-4 md:px-0">
      <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
        <DialogContent className="sm:max-w-xl rounded-[2rem] p-8 border-4 border-primary/5">
          <DialogHeader className="text-center space-y-4">
            <div className="p-4 bg-primary/10 rounded-2xl w-fit mx-auto">
              <GraduationCap className="h-10 w-10 text-primary" />
            </div>
            <DialogTitle className="text-3xl font-black font-headline tracking-tighter text-slate-900">Prepare Smarter 🚀</DialogTitle>
            <DialogDescription className="text-base font-medium text-slate-500 leading-relaxed">
              StudyPilot transforms textbooks into structured exam material instantly.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 group hover:bg-primary/5 transition-colors">
              <Zap className="h-6 w-6 text-primary" />
              <p className="font-black text-xs uppercase tracking-widest text-slate-400">Summarize</p>
              <p className="text-[10px] text-slate-600 font-bold">Dense notes into scoring points.</p>
            </div>
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 group hover:bg-primary/5 transition-colors">
              <BookOpen className="h-6 w-6 text-primary" />
              <p className="font-black text-xs uppercase tracking-widest text-slate-400">Model Answers</p>
              <p className="text-[10px] text-slate-600 font-bold">Structured for max marks.</p>
            </div>
          </div>
          <DialogFooter>
            <Button className="w-full rounded-2xl font-black h-14 text-lg shadow-xl shadow-primary/20" onClick={async () => {
              setShowOnboarding(false);
              if (user) await updateOnboardingStatus(user.uid);
            }}>Enter Workspace</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b pb-6 border-slate-100 no-print">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <h1 className="text-3xl md:text-5xl font-black font-headline tracking-tight text-slate-900">Study Workspace</h1>
             {userData?.plan === 'free' ? (
                <Badge variant="outline" className="font-black text-amber-600 border-amber-100 bg-amber-50 h-6 px-3 text-[10px]">Free Pilot</Badge>
             ) : (
                <Badge className="bg-primary/10 text-primary border-none font-black flex gap-1.5 items-center px-4 h-6 text-[10px] uppercase tracking-widest">
                  <Star className="h-3 w-3 fill-primary" /> {userData?.plan} Member
                </Badge>
             )}
          </div>
          <p className="text-muted-foreground font-medium text-sm md:text-lg">Paste notes or upload topics to generate study material.</p>
        </div>
        
        {userData?.plan === 'free' && (
          <div className="p-4 w-full lg:w-80 bg-white border-2 border-slate-50 shadow-sm rounded-2xl">
            <div className="flex justify-between text-[9px] font-black mb-2 uppercase tracking-widest text-slate-400">
              <span>Daily Prep Limit</span>
              <span>{usage.used} / {usage.total}</span>
            </div>
            <Progress value={(usage.used / usage.total) * 100} className="h-2 bg-slate-100" />
            <Link href="/dashboard/billing" className="text-[9px] text-primary mt-3 font-black flex items-center justify-center gap-2 hover:underline bg-primary/5 py-1.5 rounded-lg">
               Go Unlimited for ₹99 <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Input Column */}
        <div className="xl:col-span-5 space-y-6 no-print">
          <Card className="border-2 border-slate-50 shadow-sm rounded-[2rem] overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 pb-6 border-b">
              <CardTitle className="text-lg font-black font-headline flex items-center justify-between">
                <span>Material Source</span>
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-slate-300 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs font-bold text-[10px] p-4 rounded-xl">
                        Note: Basic PDF extraction. Images and complex scans may need cleanup.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-primary font-black hover:bg-primary/5 rounded-xl border border-primary/10 bg-white px-4"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-3.5 w-3.5 mr-2" /> PDF / TXT
                  </Button>
                </div>
              </CardTitle>
              <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} accept=".txt,.pdf" />
            </CardHeader>
            <CardContent className="pt-8 space-y-6">
              <div className="space-y-2">
                <Label className="font-black text-[9px] text-slate-400 uppercase tracking-widest">Chapter Title / Topic</Label>
                <Input 
                  placeholder="e.g., Operating Systems - Unit 1" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="rounded-xl border-slate-100 h-12 font-bold text-base shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-black text-[9px] text-slate-400 uppercase tracking-widest">Academic Stream</Label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger className="rounded-xl h-12 border-slate-100 font-bold shadow-sm">
                      <SelectValue placeholder="Stream" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl font-bold">
                      {SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                {activeTool === "answer" && (
                  <div className="space-y-2">
                    <Label className="font-black text-[9px] text-slate-400 uppercase tracking-widest">Mark Weightage</Label>
                    <Select value={answerMode} onValueChange={setAnswerMode}>
                      <SelectTrigger className="rounded-xl h-12 border-slate-100 font-bold shadow-sm">
                        <SelectValue placeholder="Marks" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl font-bold">
                        {ANSWER_MODES.map(m => <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="font-black text-[9px] text-slate-400 uppercase tracking-widest">Notes Context</Label>
                <Textarea
                  placeholder="Paste text or specific question content here..."
                  className="min-h-[300px] resize-none rounded-[1.5rem] border-slate-100 focus-visible:ring-primary leading-relaxed p-6 font-bold text-slate-700 bg-slate-50/30 text-base shadow-inner"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between p-6 bg-primary/[0.02] rounded-[1.5rem] border-2 border-primary/5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Label className="font-black text-[10px] uppercase tracking-widest">Exam Booster Mode</Label>
                    <Badge className="bg-amber-100 text-amber-700 border-none text-[8px] font-black uppercase">ELITE</Badge>
                  </div>
                  <p className="text-[9px] text-slate-400 font-bold italic">High-scoring university patterns</p>
                </div>
                <Switch 
                  checked={isExamBooster} 
                  onCheckedChange={(checked) => {
                    if (userData?.plan === 'free') {
                      toast({ title: "Elite Required", description: "Booster Mode is a premium feature.", variant: "destructive" });
                      return;
                    }
                    setIsExamBooster(checked);
                  }} 
                />
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50/50 p-6 border-t">
              <Button 
                className="w-full h-16 text-xl font-black rounded-xl bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/30 gap-3 group" 
                onClick={() => handleToolAction()}
                disabled={loading || !inputText}
              >
                {loading ? (
                   <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="h-6 w-6 group-hover:rotate-12 transition-transform" />
                    Generate Study Sheet
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Output Column */}
        <div className="xl:col-span-7 h-full">
          <Tabs value={activeTool} onValueChange={setActiveTool} className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 bg-slate-100/50 p-1.5 mb-8 rounded-2xl h-16 shadow-sm border border-slate-100 no-print">
              {[
                { id: "summarize", label: "Summarize", icon: Zap },
                { id: "answer", label: "Model Answer", icon: BookOpen },
                { id: "questions", label: "Important Qs", icon: AlertCircle },
                { id: "revision", label: "Revision Sheet", icon: FileText }
              ].map(t => (
                <TabsTrigger 
                  key={t.id}
                  value={t.id} 
                  className="rounded-xl font-black text-[10px] md:text-xs data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-primary transition-all gap-2 h-full"
                >
                  <t.icon className="h-4 w-4 hidden sm:block" />
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex-1 bg-white rounded-[2.5rem] border-2 border-slate-50 shadow-xl overflow-hidden flex flex-col min-h-[750px] print:border-none print:shadow-none">
              {!result && !loading && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-8 no-print">
                  <div className="p-12 bg-slate-50 rounded-full animate-pulse relative">
                    <GraduationCap className="h-24 w-24 text-slate-100" />
                    <MousePointer2 className="h-8 w-8 text-primary absolute bottom-4 right-4" />
                  </div>
                  <div className="space-y-3 max-w-xs">
                    <h2 className="font-black text-2xl font-headline text-slate-900 tracking-tight">Workspace Empty</h2>
                    <p className="text-slate-400 font-bold text-sm leading-relaxed px-4">Paste notes or upload topics on the left to start prep.</p>
                  </div>
                </div>
              )}

              {loading && (
                <div className="flex-1 flex flex-col items-center justify-center space-y-10 py-24 px-8 no-print">
                  <div className="relative">
                    <div className="h-32 w-32 border-8 border-primary/5 border-t-primary rounded-full animate-spin" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <Rocket className="h-12 w-12 text-primary animate-bounce" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="font-black text-3xl font-headline tracking-tight">StudyPilot Processing...</p>
                    <p className="text-muted-foreground font-black text-xs uppercase tracking-widest opacity-50">Drafting {subject} study material</p>
                  </div>
                </div>
              )}

              {result && (
                <div className="flex-1 flex flex-col p-8 animate-in fade-in zoom-in-95 duration-500 overflow-auto scrollbar-hide print:p-0">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b pb-8 gap-6 print:mb-6">
                    <div className="space-y-2">
                      <div className="flex gap-2 items-center no-print">
                        <Badge className="bg-primary/5 text-primary border-none text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                          {subject}
                        </Badge>
                        {isExamBooster && <Badge className="bg-amber-100 text-amber-700 border-none text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex gap-1.5 items-center"><Star className="h-3 w-3 fill-amber-700" /> Elite Booster</Badge>}
                      </div>
                      <h2 className="text-3xl font-black font-headline tracking-tight text-slate-900 leading-tight print:text-2xl">{title || "Study Prep Pack"}</h2>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest hidden print:block">Generated via StudyPilot AI</p>
                    </div>
                    <div className="flex flex-wrap gap-2 no-print">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className={cn("h-12 w-12 rounded-xl transition-all border-2", isFavorite ? "bg-yellow-50 text-yellow-500 border-yellow-100" : "border-slate-100 text-slate-300")}
                        onClick={handleFavorite}
                      >
                        <Star className={cn("h-5 w-5", isFavorite && "fill-yellow-500")} />
                      </Button>
                      <Button variant="outline" className="rounded-xl h-12 gap-2 border-2 border-slate-100 font-black px-6 text-sm" onClick={copyToClipboard}>
                        <Copy className="h-4 w-4 text-slate-400" /> Copy
                      </Button>
                      <Button className="rounded-xl h-12 gap-2 shadow-xl shadow-primary/20 font-black px-8 text-sm" onClick={() => {
                         trackEvent(user!.uid, 'output_exported', { tool: activeTool });
                         window.print();
                      }}>
                        <Printer className="h-4 w-4" /> Export PDF
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-12 pb-16">
                    {activeTool === "summarize" && (
                      <div className="space-y-10">
                        <section className="bg-primary/5 p-8 rounded-[2rem] border-2 border-primary/5 relative overflow-hidden group print:bg-white print:border-slate-100 print:rounded-2xl print:p-6">
                          <Zap className="absolute -top-4 -right-4 h-24 w-24 text-primary/5 group-hover:text-primary/10 transition-colors no-print" />
                          <h3 className="text-[10px] font-black text-primary uppercase tracking-widest mb-4 relative z-10 print:text-slate-400">Concept Summary</h3>
                          <div className="text-slate-900 leading-relaxed text-xl font-black relative z-10 print:text-base">{formatWithBold(result.shortSummary)}</div>
                        </section>
                        <section className="space-y-6">
                          <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2"><Layers className="h-4 w-4" /> Bullet Prep Notes</h3>
                          <div className="grid grid-cols-1 gap-4">
                            {result.bulletPoints?.map((bp: string, i: number) => (
                              <div key={i} className="flex gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary/20 hover:bg-white transition-all shadow-sm group print:bg-white print:p-3 print:rounded-lg">
                                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black text-xs shrink-0 group-hover:bg-primary group-hover:text-white transition-colors print:bg-slate-100 print:text-slate-900">{i+1}</div>
                                <div className="text-slate-800 font-bold leading-relaxed text-base print:text-sm">{formatWithBold(bp)}</div>
                              </div>
                            ))}
                          </div>
                        </section>
                        <section className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden print:bg-slate-100 print:text-slate-900 print:rounded-2xl print:p-6">
                           <h3 className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-4">Exam Revision Block</h3>
                           <p className="text-lg font-black italic mb-6">"{result.quickRevisionBlock}"</p>
                           <div className="p-6 bg-white/10 rounded-2xl border border-white/10 print:bg-white print:border-slate-200">
                             <p className="text-xs font-bold leading-relaxed">{result.examHighlights}</p>
                           </div>
                        </section>
                      </div>
                    )}

                    {activeTool === "answer" && (
                      <div className="space-y-10 max-w-4xl">
                        <div className="space-y-2">
                          <p className="text-[9px] font-black text-primary uppercase tracking-[0.4em] print:text-slate-400">Model Exam Answer</p>
                          <h3 className="text-4xl font-black font-headline tracking-tighter text-slate-900 print:text-2xl">{result.title}</h3>
                        </div>
                        <div className="space-y-6">
                          <div className="p-8 bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 space-y-8 print:bg-white print:p-0 print:border-none">
                             <div className="text-slate-900 text-xl font-black border-l-8 border-primary/20 pl-6 italic print:text-lg print:border-slate-300">{formatWithBold(result.introduction)}</div>
                             <div className="text-slate-800 text-base leading-loose whitespace-pre-line font-bold print:text-sm">{formatWithBold(result.mainBody)}</div>
                             <div className="text-slate-900 text-lg font-black pt-4">{formatWithBold(result.conclusion)}</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <Card className="rounded-3xl border-2 border-slate-100 bg-slate-50 p-6 print:bg-white">
                              <h4 className="text-[9px] font-black text-primary uppercase tracking-widest mb-4">Terms to Mention</h4>
                              <div className="flex flex-wrap gap-2">
                                {result.scoringKeywords?.map((kw: string, i: number) => (
                                  <Badge key={i} className="bg-white text-slate-900 border-slate-200 px-4 py-2 rounded-xl font-black text-[10px] shadow-sm">{kw}</Badge>
                                ))}
                              </div>
                           </Card>
                           {result.diagramSuggestions && (
                             <Card className="rounded-3xl border-2 border-amber-100 bg-amber-50 p-6 print:bg-white print:border-slate-100">
                                <h4 className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-4">Diagram Tip</h4>
                                <p className="text-xs font-bold text-amber-900 leading-relaxed">{result.diagramSuggestions}</p>
                             </Card>
                           )}
                        </div>

                        <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] flex gap-6 items-start shadow-xl relative overflow-hidden print:bg-slate-100 print:text-slate-900 print:rounded-2xl print:shadow-none">
                           <div className="p-4 bg-primary rounded-xl shrink-0 no-print">
                             <ShieldAlert className="h-8 w-8 text-white" />
                           </div>
                           <div className="space-y-2 relative z-10">
                             <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Scoring Strategy</p>
                             <p className="text-xl font-black font-headline tracking-tight print:text-lg">{result.examTip}</p>
                           </div>
                        </div>
                      </div>
                    )}

                    {activeTool === "questions" && (
                      <div className="space-y-12">
                        <section className="bg-rose-50 p-8 rounded-[2.5rem] border-4 border-rose-100 relative overflow-hidden print:bg-white print:p-6 print:rounded-2xl">
                           <div className="flex justify-between items-center mb-8">
                              <h3 className="text-[10px] font-black text-rose-600 uppercase tracking-widest flex items-center gap-3">
                                <AlertCircle className="h-6 w-6" /> Probable Predictions
                              </h3>
                              <Badge className={cn(
                                "border-none text-[8px] font-black uppercase tracking-widest px-3",
                                result.predictionConfidence === 'high' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                              )}>
                                Confidence: {result.predictionConfidence}
                              </Badge>
                           </div>
                           <div className="grid grid-cols-1 gap-4 relative z-10">
                              {result.mostProbable?.map((q: string, i: number) => (
                                <div key={i} className="p-6 bg-white rounded-2xl font-black text-lg text-rose-950 border-2 border-rose-100 shadow-sm flex gap-4 items-center print:text-base print:p-4">
                                  <span className="text-rose-100 text-4xl italic font-headline opacity-80 leading-none print:text-slate-200">0{i+1}</span>
                                  {q}
                                </div>
                              ))}
                           </div>
                        </section>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                           <div className="space-y-6">
                              <h4 className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Section A (Short)</h4>
                              {result.twoMarkQuestions?.map((q: string, i: number) => (
                                <div key={i} className="flex gap-4 items-start bg-slate-50 p-4 rounded-xl border border-slate-100 hover:bg-white transition-all print:bg-white">
                                  <span className="h-8 w-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[10px] font-black text-slate-400 shrink-0">{i+1}</span>
                                  <p className="text-sm font-bold text-slate-800 pt-1.5">{q}</p>
                                </div>
                              ))}
                           </div>
                           <div className="space-y-6">
                              <h4 className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Section B (Long)</h4>
                              {result.fiveMarkQuestions?.map((q: string, i: number) => (
                                <div key={i} className="flex gap-4 items-start bg-slate-50 p-4 rounded-xl border border-slate-100 hover:bg-white transition-all print:bg-white">
                                  <span className="h-8 w-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[10px] font-black text-slate-400 shrink-0">{i+1}</span>
                                  <p className="text-sm font-bold text-slate-800 pt-1.5">{q}</p>
                                </div>
                              ))}
                           </div>
                        </div>
                      </div>
                    )}

                    {activeTool === "revision" && (
                      <div className="space-y-12 bg-slate-50/20 p-8 md:p-12 rounded-[2.5rem] border-2 border-slate-50 print:bg-white print:p-0 print:border-none">
                        <div className="text-center space-y-4 mb-10 print:mb-6 print:text-left">
                          <p className="text-[10px] font-black text-primary uppercase tracking-widest">Rapid Revision Pack</p>
                          <h3 className="text-4xl font-black font-headline tracking-tighter text-slate-900 print:text-2xl">Final Hour Recall</h3>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                           <section className="space-y-4">
                             <h4 className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Core Summary</h4>
                             <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 shadow-sm text-slate-900 leading-relaxed font-black text-lg whitespace-pre-line print:p-0 print:border-none print:shadow-none print:text-sm">
                                {formatWithBold(result.quickNotes)}
                             </div>
                           </section>
                           <div className="space-y-10">
                              <section className="space-y-4">
                                <h4 className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Key Terms & Formulae</h4>
                                <div className="space-y-3">
                                  {result.formulasAndDefinitions?.map((f: string, i: number) => (
                                    <div key={i} className="p-6 bg-white rounded-xl border-2 border-slate-50 text-base font-black text-slate-800 flex gap-4 items-center shadow-sm print:p-3 print:text-xs">
                                      <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 shrink-0">{i+1}</div>
                                      {f}
                                    </div>
                                  ))}
                                </div>
                              </section>
                              {result.mnemonics && result.mnemonics.length > 0 && (
                                <section className="space-y-4">
                                  <h4 className="text-[9px] font-black text-primary uppercase tracking-widest">Memory Hook</h4>
                                  <div className="grid grid-cols-1 gap-3">
                                    {result.mnemonics.map((m: string, i: number) => (
                                      <div key={i} className="p-5 bg-primary/5 rounded-2xl border-2 border-primary/5 font-black text-sm text-primary flex gap-4 items-center">
                                         <Zap className="h-5 w-5 shrink-0" />
                                         {m}
                                      </div>
                                    ))}
                                  </div>
                                </section>
                              )}
                              <section className="bg-slate-900 p-8 rounded-[2rem] text-white space-y-4 print:bg-slate-100 print:text-slate-900 print:p-6">
                                <h4 className="text-[9px] font-black opacity-40 uppercase tracking-widest">Top Scoring Points</h4>
                                <ul className="space-y-4">
                                  {result.mustMemorizeSection?.map((pt: string, i: number) => (
                                    <li key={i} className="flex gap-4 text-sm font-black border-l-4 border-primary pl-4">{pt}</li>
                                  ))}
                                </ul>
                              </section>
                           </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Chaining UI */}
                  <div className="mt-auto pt-10 border-t border-slate-100 no-print">
                    <div className="flex flex-col items-center space-y-6">
                      <div className="space-y-1 text-center">
                        <Badge className="bg-primary/5 text-primary border-none px-4 py-1 font-black text-[9px] tracking-widest rounded-full uppercase">Next Study Step</Badge>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Build your pack by chaining tools</p>
                      </div>
                      <div className="flex flex-wrap justify-center gap-3">
                        {activeTool !== "summarize" && (
                          <Button variant="outline" className="rounded-xl h-12 font-black border-2 border-slate-100 hover:border-primary px-6 transition-all text-sm" onClick={() => chainToTool("summarize")}>
                            <Zap className="h-4 w-4 mr-2 text-primary" /> Summarize Result
                          </Button>
                        )}
                        {activeTool !== "answer" && (
                          <Button variant="outline" className="rounded-xl h-12 font-black border-2 border-slate-100 hover:border-primary px-6 transition-all text-sm" onClick={() => chainToTool("answer")}>
                            <BookOpen className="h-4 w-4 mr-2 text-primary" /> Create Model Answer
                          </Button>
                        )}
                        {activeTool !== "questions" && (
                          <Button variant="outline" className="rounded-xl h-12 font-black border-2 border-slate-100 hover:border-primary px-6 transition-all text-sm" onClick={() => chainToTool("questions")}>
                            <AlertCircle className="h-4 w-4 mr-2 text-primary" /> Predict Questions
                          </Button>
                        )}
                        {activeTool !== "revision" && (
                          <Button variant="outline" className="rounded-xl h-12 font-black border-2 border-slate-100 hover:border-primary px-6 transition-all text-sm" onClick={() => chainToTool("revision")}>
                            <FileText className="h-4 w-4 mr-2 text-primary" /> Rapid Revision Sheet
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
