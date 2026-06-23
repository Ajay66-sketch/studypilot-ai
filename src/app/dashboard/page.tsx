
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
  FileDown, Upload, Trash2, History, Star, ShieldAlert,
  MousePointer2, CheckCircle2, Zap, ArrowRight, Layers
} from "lucide-react";
import { summarizeNotes } from "@/ai/flows/summarize-notes";
import { generateExamAnswer } from "@/ai/flows/generate-exam-answer";
import { generateImportantQuestions } from "@/ai/flows/generate-important-questions-flow";
import { generateRevisionSheet } from "@/ai/flows/generate-revision-sheet";
import { checkUsageLimit, incrementUsage } from "@/lib/usage";
import { saveDocument, generateHash, findCachedDocument, updateOnboardingStatus, toggleFavorite } from "@/lib/firestore-services";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
      toast({ title: "Material Restored", description: "Context loaded into workspace." });
    }

    const fetchUsage = async () => {
      if (user) {
        const u = await checkUsageLimit(user.uid, userData?.plan || 'free');
        setUsage({ used: 5 - u.remaining, total: 5 });
        if (userData && !userData.onboardingCompleted) {
          setShowOnboarding(true);
        }
      }
    };
    fetchUsage();
  }, [user, userData]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === "text/plain") {
      const text = await file.text();
      setInputText(text);
      if (!title) setTitle(file.name.replace(".txt", ""));
    } else if (file.type === "application/pdf") {
      toast({ title: "Analyzing PDF", description: "Extracting study material..." });
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setInputText(content.slice(0, 5000)); // Sample extraction
        if (!title) setTitle(file.name.replace(".pdf", ""));
      };
      reader.readAsText(file);
    } else {
      toast({ title: "Format Error", description: "Please upload .txt or .pdf files.", variant: "destructive" });
    }
  };

  const handleToolAction = async (toolOverride?: string, textOverride?: string) => {
    const tool = toolOverride || activeTool;
    const input = textOverride || inputText;

    if (!input.trim()) {
      toast({ title: "Input Required", description: "Please enter or paste your notes.", variant: "destructive" });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const usageLimit = await checkUsageLimit(user!.uid, userData?.plan || 'free');
      if (!usageLimit.allowed) {
        toast({ title: "Limit Reached", description: "Upgrade to Pro for unlimited prep!", variant: "destructive" });
        setLoading(false);
        return;
      }

      const hash = generateHash(input, tool, `${subject}:${answerMode}:${isExamBooster}`);
      const cached = await findCachedDocument(user!.uid, hash);
      
      if (cached) {
        setResult(cached.outputText);
        setCurrentDocId(cached.id || null);
        setIsFavorite(cached.isFavorite || false);
        toast({ title: "Cached Result", description: "Restored from your library." });
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
          aiResult = await generateImportantQuestions({ chapterNotes: input, subject });
          break;
        case "revision":
          aiResult = await generateRevisionSheet({ topic: input, subject });
          break;
      }

      setResult(aiResult);
      await incrementUsage(user!.uid);
      setUsage(prev => ({ ...prev, used: prev.used + 1 }));

      const savedDoc = await saveDocument({
        uid: user!.uid,
        inputText: input,
        outputText: aiResult,
        featureType: tool as any,
        title: title || "New Study Pack",
        cachedHash: hash,
        isPremiumOutput: userData?.plan !== 'free',
        subject,
        answerMode: tool === 'answer' ? answerMode : undefined,
        isExamBooster,
        isFavorite: false
      });
      
      setCurrentDocId(savedDoc.id);
      toast({ title: "Success", description: "Material generated and saved." });
    } catch (error) {
      console.error(error);
      toast({ title: "AI Unavailable", description: "API is busy. Please try again.", variant: "destructive" });
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
      toast({ title: newStatus ? "Favorited" : "Removed", description: "Updated in your library." });
    } catch (e) {
      toast({ title: "Error", description: "Failed to update favorite status." });
    }
  };

  const copyToClipboard = () => {
    const text = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Content ready to paste." });
  };

  const chainToTool = (newTool: string) => {
    let context = "";
    if (activeTool === "summarize") context = result.bulletPoints?.join("\n") || result.shortSummary;
    else if (activeTool === "answer") context = result.mainBody;
    else if (activeTool === "questions") context = result.mostProbable?.join("\n") || "";
    else context = result.quickNotes;

    setInputText(context);
    setActiveTool(newTool);
    handleToolAction(newTool, context);
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
        <DialogContent className="sm:max-w-xl rounded-[3rem] p-10 border-4 border-primary/5">
          <DialogHeader className="text-center space-y-6">
            <div className="p-6 bg-primary/10 rounded-[2rem] w-fit mx-auto">
              <GraduationCap className="h-14 w-14 text-primary" />
            </div>
            <DialogTitle className="text-4xl font-black font-headline tracking-tighter">Prepare Faster 🚀</DialogTitle>
            <DialogDescription className="text-xl font-medium text-slate-500 leading-relaxed">
              StudyPilot transforms your messy notes into university-ready exam material instantly.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-8">
            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-2 group hover:bg-primary/5 transition-colors">
              <Zap className="h-7 w-7 text-primary" />
              <p className="font-black text-sm uppercase tracking-widest text-slate-400">Summarize</p>
              <p className="text-xs text-slate-600 font-bold leading-relaxed">Dense notes into bullet points.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-2 group hover:bg-primary/5 transition-colors">
              <BookOpen className="h-7 w-7 text-primary" />
              <p className="font-black text-sm uppercase tracking-widest text-slate-400">Model Answers</p>
              <p className="text-xs text-slate-600 font-bold leading-relaxed">Structured for marking schemes.</p>
            </div>
          </div>
          <DialogFooter>
            <Button className="w-full rounded-2xl font-black h-16 text-xl shadow-xl shadow-primary/20" onClick={async () => {
              setShowOnboarding(false);
              if (user) await updateOnboardingStatus(user.uid);
            }}>Start Studying Now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-b pb-8 border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <h1 className="text-5xl font-black font-headline tracking-tight text-slate-900">Workspace</h1>
             {userData?.plan === 'free' ? (
                <Badge variant="outline" className="font-black text-amber-600 border-amber-100 bg-amber-50 h-6 px-3">Free Pilot</Badge>
             ) : (
                <Badge className="bg-primary/10 text-primary border-none font-black flex gap-1.5 items-center px-4 h-6"><Star className="h-3 w-3 fill-primary" /> {userData?.plan.toUpperCase()} PACK</Badge>
             )}
          </div>
          <p className="text-muted-foreground font-medium text-lg">Turn messy notes into structured exam material.</p>
        </div>
        
        {userData?.plan === 'free' && (
          <div className="p-6 w-full lg:w-96 bg-white border-2 border-slate-50 shadow-sm rounded-[2.5rem]">
            <div className="flex justify-between text-[10px] font-black mb-3 uppercase tracking-widest text-slate-400">
              <span>Daily Prep Usage</span>
              <span>{usage.used} / {usage.total}</span>
            </div>
            <Progress value={(usage.used / usage.total) * 100} className="h-2.5 bg-slate-100" />
            <Link href="/dashboard/billing" className="text-[10px] text-primary mt-4 font-black flex items-center justify-center gap-2 hover:underline bg-primary/5 py-2 rounded-xl">
               Upgrade for unlimited sessions <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
        {/* Input Column */}
        <div className="xl:col-span-5 space-y-8">
          <Card className="border-4 border-slate-50 shadow-md rounded-[3rem] overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 pb-8 border-b">
              <CardTitle className="text-xl font-black font-headline flex items-center justify-between">
                <span>Input Workspace</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-10 text-primary font-black hover:bg-primary/5 rounded-xl border border-primary/10 bg-white"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" /> Upload PDF/TXT
                </Button>
              </CardTitle>
              <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} accept=".txt,.pdf" />
            </CardHeader>
            <CardContent className="pt-10 space-y-8">
              <div className="space-y-3">
                <Label className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">Material Title / Topic</Label>
                <Input 
                  placeholder="e.g., Computer Architecture - Unit 3" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="rounded-2xl border-slate-100 h-14 font-bold text-lg shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-3">
                  <Label className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">Subject</Label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger className="rounded-2xl h-14 border-slate-100 font-bold shadow-sm">
                      <SelectValue placeholder="Subject" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl font-bold">
                      {SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                {activeTool === "answer" && (
                  <div className="space-y-3">
                    <Label className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">Response Style</Label>
                    <Select value={answerMode} onValueChange={setAnswerMode}>
                      <SelectTrigger className="rounded-2xl h-14 border-slate-100 font-bold shadow-sm">
                        <SelectValue placeholder="Style" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl font-bold">
                        {ANSWER_MODES.map(m => <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">Notes / Chapter Data</Label>
                <Textarea
                  placeholder="Paste your raw textbook content or notes here..."
                  className="min-h-[400px] resize-none rounded-[2.5rem] border-slate-100 focus-visible:ring-primary leading-relaxed p-8 font-bold text-slate-700 bg-slate-50/30 text-lg shadow-inner"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <p className="text-[10px] text-slate-400 font-bold italic">Max 5000 characters for best accuracy.</p>
              </div>

              <div className="flex items-center justify-between p-8 bg-primary/[0.02] rounded-[2.5rem] border-2 border-primary/5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Label className="font-black text-xs uppercase tracking-widest">Exam Booster Mode</Label>
                    <Badge className="bg-amber-100 text-amber-700 border-none text-[8px] font-black uppercase tracking-tighter">PREMIUM</Badge>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold">Enhance formatting for university marks</p>
                </div>
                <Switch 
                  checked={isExamBooster} 
                  onCheckedChange={(checked) => {
                    if (userData?.plan === 'free') {
                      toast({ title: "Premium Feature", description: "Exam Booster is for paid members.", variant: "destructive" });
                      return;
                    }
                    setIsExamBooster(checked);
                  }} 
                />
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50/50 p-8 border-t">
              <Button 
                className="w-full h-18 text-2xl font-black rounded-2xl bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/30 gap-3 group" 
                onClick={() => handleToolAction()}
                disabled={loading || !inputText}
              >
                {loading ? (
                   <div className="flex items-center gap-3">
                    <div className="h-7 w-7 border-4 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing Material...
                  </div>
                ) : (
                  <>
                    <Sparkles className="h-7 w-7 group-hover:rotate-12 transition-transform" />
                    Generate {activeTool.charAt(0).toUpperCase() + activeTool.slice(1)}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Output Column */}
        <div className="xl:col-span-7 h-full">
          <Tabs value={activeTool} onValueChange={setActiveTool} className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 bg-slate-100/50 p-2 mb-10 rounded-[2.5rem] h-20 shadow-sm border border-slate-100">
              {[
                { id: "summarize", label: "Summarizer", icon: Zap },
                { id: "answer", label: "Exam Answer", icon: BookOpen },
                { id: "questions", label: "Questions", icon: AlertCircle },
                { id: "revision", label: "Revision Sheet", icon: FileText }
              ].map(t => (
                <TabsTrigger 
                  key={t.id}
                  value={t.id} 
                  className="rounded-2xl font-black text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-primary transition-all gap-2 h-full"
                >
                  <t.icon className="h-5 w-5 hidden sm:block" />
                  {t.label.split(" ")[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex-1 bg-white rounded-[4rem] border-4 border-slate-50 shadow-xl overflow-hidden flex flex-col min-h-[900px]">
              {!result && !loading && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-16 space-y-10">
                  <div className="p-16 bg-slate-50 rounded-full animate-pulse relative">
                    <GraduationCap className="h-32 w-32 text-slate-200" />
                    <MousePointer2 className="h-10 w-10 text-primary absolute bottom-6 right-6" />
                  </div>
                  <div className="space-y-4 max-w-sm">
                    <h2 className="font-black text-4xl font-headline text-slate-900 tracking-tighter leading-none">Ready for Prep?</h2>
                    <p className="text-slate-400 font-bold text-lg leading-relaxed px-4">Paste your material on the left. StudyPilot will transform it into study-ready sheets.</p>
                  </div>
                </div>
              )}

              {loading && (
                <div className="flex-1 flex flex-col items-center justify-center space-y-12 py-32 px-10">
                  <div className="relative">
                    <div className="h-48 w-48 border-8 border-primary/5 border-t-primary rounded-full animate-spin" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <Rocket className="h-20 w-20 text-primary animate-bounce" />
                    </div>
                  </div>
                  <div className="text-center space-y-4">
                    <p className="font-black text-4xl font-headline tracking-tighter">AI Pilot is Processing...</p>
                    <p className="text-muted-foreground font-black text-xl uppercase tracking-widest opacity-50">Structuring for {subject} standards</p>
                  </div>
                </div>
              )}

              {result && (
                <div className="flex-1 flex flex-col p-12 animate-in fade-in zoom-in-95 duration-700 overflow-auto scrollbar-hide">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b-2 border-slate-50 pb-10 gap-8">
                    <div className="space-y-3">
                      <div className="flex gap-2 items-center">
                        <Badge className="bg-primary/5 text-primary border-none text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full">
                          {subject}
                        </Badge>
                        {isExamBooster && <Badge className="bg-amber-100 text-amber-700 border-none text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full flex gap-1.5 items-center"><Star className="h-3 w-3 fill-amber-700" /> Booster Mode</Badge>}
                      </div>
                      <h2 className="text-5xl font-black font-headline tracking-tighter text-slate-900 leading-tight">{title || "New Study Material"}</h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className={cn("h-14 w-14 rounded-2xl transition-all border-2", isFavorite ? "bg-yellow-50 text-yellow-500 border-yellow-100" : "border-slate-100 text-slate-300")}
                        onClick={handleFavorite}
                      >
                        <Star className={cn("h-6 w-6", isFavorite && "fill-yellow-500")} />
                      </Button>
                      <Button variant="outline" className="rounded-2xl h-14 gap-3 border-2 border-slate-100 font-black px-8" onClick={copyToClipboard}>
                        <Copy className="h-5 w-5 text-slate-400" /> Copy
                      </Button>
                      <Button className="rounded-2xl h-14 gap-3 shadow-2xl shadow-primary/20 font-black px-10" onClick={() => {
                        if (userData?.plan === 'free') toast({ title: "Premium Feature", description: "Exporting is for Pro members." });
                        else window.print();
                      }}>
                        <FileDown className="h-5 w-5" /> Export
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-16 pb-20">
                    {activeTool === "summarize" && (
                      <div className="space-y-12">
                        <section className="bg-primary/5 p-12 rounded-[3.5rem] border-4 border-primary/5 relative overflow-hidden group">
                          <Zap className="absolute -top-6 -right-6 h-32 w-32 text-primary/5 group-hover:text-primary/10 transition-colors" />
                          <h3 className="text-xs font-black text-primary uppercase tracking-[0.4em] mb-8 relative z-10">Study Summary</h3>
                          <p className="text-slate-900 leading-relaxed text-3xl font-black relative z-10">{result.shortSummary}</p>
                        </section>
                        <section className="space-y-10">
                          <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-3"><Layers className="h-5 w-5" /> Exam-Focused Notes</h3>
                          <div className="grid grid-cols-1 gap-6">
                            {result.bulletPoints?.map((bp: string, i: number) => (
                              <div key={i} className="flex gap-8 p-8 bg-slate-50/50 rounded-[2.5rem] border-2 border-slate-50 hover:border-primary/20 hover:bg-white transition-all shadow-sm group">
                                <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm shrink-0 group-hover:bg-primary group-hover:text-white transition-colors shadow-sm">{i+1}</div>
                                <p className="text-slate-800 font-bold leading-relaxed text-xl">{bp}</p>
                              </div>
                            ))}
                          </div>
                        </section>
                        <section>
                          <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-10">Essential Concepts</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {result.keyConcepts?.map((kc: any, i: number) => (
                              <div key={i} className="p-10 bg-white rounded-[3rem] border-2 border-slate-50 shadow-md group hover:border-primary/30 transition-all">
                                <p className="font-black text-primary mb-4 text-2xl tracking-tight">{kc.term}</p>
                                <p className="text-slate-500 leading-relaxed font-bold text-base italic">{kc.explanation}</p>
                              </div>
                            ))}
                          </div>
                        </section>
                      </div>
                    )}

                    {activeTool === "answer" && (
                      <div className="space-y-16 max-w-5xl mx-auto">
                        <div className="text-center space-y-6 mb-20">
                          <p className="text-[10px] font-black text-primary uppercase tracking-[0.6em]">Structured Model Answer</p>
                          <h3 className="text-6xl font-black font-headline tracking-tighter text-slate-900 leading-[0.85]">{result.title}</h3>
                        </div>
                        <div className="space-y-10">
                          <div className="inline-flex items-center px-8 py-2.5 rounded-full bg-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] shadow-sm">Part 1: The Foundation</div>
                          <p className="text-slate-900 text-3xl leading-relaxed font-black border-l-[12px] border-primary/20 pl-10 italic">{result.introduction}</p>
                        </div>
                        <div className="space-y-10">
                          <div className="inline-flex items-center px-8 py-2.5 rounded-full bg-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] shadow-sm">Part 2: Technical Body</div>
                          <div className="text-slate-800 text-2xl leading-loose whitespace-pre-line font-bold bg-slate-50/50 p-12 rounded-[4rem] border-4 border-slate-50 shadow-inner">{result.mainBody}</div>
                        </div>
                        <div className="space-y-10">
                          <div className="inline-flex items-center px-8 py-2.5 rounded-full bg-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] shadow-sm">Part 3: Synthesis</div>
                          <p className="text-slate-900 text-2xl leading-relaxed font-black">{result.conclusion}</p>
                        </div>
                        <div className="p-12 bg-slate-900 text-white rounded-[4rem] flex gap-10 items-start shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden group">
                           <Zap className="absolute top-[-10%] right-[-10%] h-64 w-64 text-white/5 group-hover:rotate-12 transition-transform" />
                           <div className="p-5 bg-primary rounded-2xl shrink-0 shadow-lg">
                             <ShieldAlert className="h-10 w-10 text-white" />
                           </div>
                           <div className="space-y-4 relative z-10">
                             <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40">Exam Strategy Tip</p>
                             <p className="text-3xl font-black font-headline leading-tight tracking-tight">{result.examTip}</p>
                           </div>
                        </div>
                      </div>
                    )}

                    {activeTool === "questions" && (
                      <div className="space-y-20">
                        <section className="bg-rose-50/50 p-12 rounded-[4rem] border-8 border-rose-100/50 relative overflow-hidden group">
                           <h3 className="text-sm font-black text-rose-600 uppercase tracking-[0.5em] mb-12 flex items-center gap-5">
                             <AlertCircle className="h-10 w-10 animate-pulse" /> High Probability Predictions
                           </h3>
                           <div className="grid grid-cols-1 gap-6 relative z-10">
                              {result.mostProbable?.map((q: string, i: number) => (
                                <div key={i} className="p-10 bg-white rounded-[3rem] font-black text-3xl text-rose-950 border-2 border-rose-100 shadow-2xl shadow-rose-900/5 flex gap-8 items-center hover:scale-[1.01] transition-transform cursor-default">
                                  <span className="text-rose-100 text-7xl italic font-headline opacity-80 leading-none">0{i+1}</span>
                                  {q}
                                </div>
                              ))}
                           </div>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                           <div className="space-y-10">
                              <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-3">Section A (2 Marks)</h4>
                              {result.twoMarkQuestions?.map((q: string, i: number) => (
                                <div key={i} className="flex gap-6 items-start bg-slate-50 p-6 rounded-3xl border-2 border-slate-100 hover:bg-white hover:border-primary/20 transition-all shadow-sm">
                                  <span className="h-10 w-10 rounded-2xl bg-white shadow-md flex items-center justify-center text-xs font-black text-slate-400 shrink-0">{i+1}</span>
                                  <p className="text-xl font-bold text-slate-800 pt-2 leading-relaxed">{q}</p>
                                </div>
                              ))}
                           </div>
                           <div className="space-y-10">
                              <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-3">Section B (5 Marks)</h4>
                              {result.fiveMarkQuestions?.map((q: string, i: number) => (
                                <div key={i} className="flex gap-6 items-start bg-slate-50 p-6 rounded-3xl border-2 border-slate-100 hover:bg-white hover:border-primary/20 transition-all shadow-sm">
                                  <span className="h-10 w-10 rounded-2xl bg-white shadow-md flex items-center justify-center text-xs font-black text-slate-400 shrink-0">{i+1}</span>
                                  <p className="text-xl font-bold text-slate-800 pt-2 leading-relaxed">{q}</p>
                                </div>
                              ))}
                           </div>
                        </div>
                      </div>
                    )}

                    {activeTool === "revision" && (
                      <div className="space-y-20 bg-slate-50/20 p-16 rounded-[5rem] border-8 border-slate-50">
                        <div className="text-center space-y-6 mb-20">
                          <p className="text-[10px] font-black text-primary uppercase tracking-[0.8em]">Rapid Memory Pack</p>
                          <h3 className="text-7xl font-black font-headline tracking-tighter text-slate-900 leading-[0.75]">Last Minute <br />Prep.</h3>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                           <section className="space-y-8">
                             <h4 className="text-xs font-black text-slate-300 uppercase tracking-[0.4em]">Core Revision Summary</h4>
                             <div className="bg-white p-12 rounded-[4rem] border-4 border-slate-50 shadow-2xl shadow-slate-200/50 text-slate-900 leading-loose font-black text-2xl whitespace-pre-line relative group">
                                <Zap className="absolute top-10 right-10 text-primary/10 h-16 w-16 group-hover:text-primary/30 transition-colors" />
                                {result.quickNotes}
                             </div>
                           </section>
                           <section className="space-y-8">
                              <h4 className="text-xs font-black text-slate-300 uppercase tracking-[0.4em]">Must-Know Formulas</h4>
                              <div className="space-y-6">
                                {result.formulasAndDefinitions?.map((f: string, i: number) => (
                                  <div key={i} className="p-8 bg-white rounded-3xl border-2 border-slate-100 text-xl font-black text-slate-800 flex gap-6 items-center shadow-sm">
                                    <div className="h-10 w-10 rounded-2xl bg-slate-100 flex items-center justify-center text-xs font-black text-slate-400">{i+1}</div>
                                    {f}
                                  </div>
                                ))}
                              </div>
                           </section>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Chaining UI */}
                  <div className="mt-auto pt-16 border-t-2 border-slate-50">
                    <div className="flex flex-col items-center space-y-10">
                      <div className="space-y-2 text-center">
                        <Badge className="bg-primary/10 text-primary border-none px-6 py-2 font-black text-xs tracking-widest rounded-full uppercase">Next Study Step</Badge>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em]">Transform this result into another format</p>
                      </div>
                      <div className="flex flex-wrap justify-center gap-5 pb-8">
                        {activeTool !== "summarize" && (
                          <Button variant="outline" className="rounded-[2rem] h-16 font-black border-4 border-slate-50 hover:border-primary hover:bg-white px-10 transition-all text-lg shadow-sm" onClick={() => chainToTool("summarize")}>
                            <Zap className="h-5 w-5 mr-3 text-primary" /> Summarize Result
                          </Button>
                        )}
                        {activeTool !== "answer" && (
                          <Button variant="outline" className="rounded-[2rem] h-16 font-black border-4 border-slate-50 hover:border-primary hover:bg-white px-10 transition-all text-lg shadow-sm" onClick={() => chainToTool("answer")}>
                            <BookOpen className="h-5 w-5 mr-3 text-primary" /> Create Model Answer
                          </Button>
                        )}
                        {activeTool !== "questions" && (
                          <Button variant="outline" className="rounded-[2rem] h-16 font-black border-4 border-slate-50 hover:border-primary hover:bg-white px-10 transition-all text-lg shadow-sm" onClick={() => chainToTool("questions")}>
                            <AlertCircle className="h-5 w-5 mr-3 text-primary" /> Extract Probable Qs
                          </Button>
                        )}
                        {activeTool !== "revision" && (
                          <Button variant="outline" className="rounded-[2rem] h-16 font-black border-4 border-slate-50 hover:border-primary hover:bg-white px-10 transition-all text-lg shadow-sm" onClick={() => chainToTool("revision")}>
                            <FileText className="h-5 w-5 mr-3 text-primary" /> Rapid Revision Pack
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

