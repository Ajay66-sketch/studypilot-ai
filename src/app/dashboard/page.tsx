
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
  FileText, BookOpen, AlertCircle, Sparkles, Send, Copy, 
  FileDown, Upload, X, Trash2, Share2, ArrowRight, CheckCircle2,
  GraduationCap, Zap, History, Star, ShieldAlert, MoreVertical,
  MousePointer2, Settings, Bookmark, ExternalLink, RotateCcw
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
    // Check for restoration from History
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
      toast({ title: "Document Restored", description: "You can now chain this into other tools." });
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
      toast({ title: "Extracting PDF", description: "This works best for text-based study material." });
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setInputText(content);
        if (!title) setTitle(file.name.replace(".pdf", ""));
      };
      reader.readAsText(file);
    } else {
      toast({ title: "Invalid File", description: "Please upload .txt or .pdf files.", variant: "destructive" });
    }
  };

  const handleToolAction = async (toolOverride?: string, textOverride?: string) => {
    const tool = toolOverride || activeTool;
    const input = textOverride || inputText;

    if (!input.trim()) {
      toast({ title: "Input Required", description: "Please enter some study material first.", variant: "destructive" });
      return;
    }

    setLoading(true);
    setResult(null);
    setCurrentDocId(null);
    setIsFavorite(false);

    try {
      const usageLimit = await checkUsageLimit(user!.uid, userData?.plan || 'free');
      if (!usageLimit.allowed) {
        toast({ title: "Limit Reached", description: "Upgrade to Pro for unlimited study prep!", variant: "destructive" });
        setLoading(false);
        return;
      }

      const hash = generateHash(input, tool, `${subject}:${answerMode}:${isExamBooster}`);
      const cached = await findCachedDocument(user!.uid, hash);
      
      if (cached) {
        setResult(cached.outputText);
        setCurrentDocId(cached.id || null);
        setIsFavorite(cached.isFavorite || false);
        toast({ title: "Restored", description: "Fetched from your history." });
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
        title: title || "Untitled Material",
        cachedHash: hash,
        isPremiumOutput: userData?.plan !== 'free',
        subject,
        answerMode: tool === 'answer' ? answerMode : undefined,
        isExamBooster,
        isFavorite: false
      });
      
      setCurrentDocId(savedDoc.id);

      toast({ title: "Success", description: "Study material generated and saved." });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "AI pilot failed. Please try again.", variant: "destructive" });
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
      toast({ title: "Error", description: "Could not favorite document." });
    }
  };

  const copyToClipboard = () => {
    const text = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Content ready to paste." });
  };

  const chainToTool = (newTool: string) => {
    let context = "";
    if (activeTool === "summarize") context = result.bulletPoints.join("\n");
    else if (activeTool === "answer") context = result.mainBody;
    else if (activeTool === "questions") context = result.tenMarkQuestions.join("\n");
    else context = result.quickNotes;

    setInputText(context);
    setActiveTool(newTool);
    handleToolAction(newTool, context);
  };

  const closeOnboarding = async () => {
    setShowOnboarding(false);
    if (user) await updateOnboardingStatus(user.uid);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Onboarding Dialog */}
      <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
        <DialogContent className="sm:max-w-lg rounded-[2.5rem] p-10">
          <DialogHeader className="text-center space-y-4">
            <div className="p-4 bg-primary/10 rounded-2xl w-fit mx-auto">
              <GraduationCap className="h-10 w-10 text-primary" />
            </div>
            <DialogTitle className="text-3xl font-black font-headline">Prepare for Exams Faster 🚀</DialogTitle>
            <DialogDescription className="text-lg font-medium text-slate-500">
              StudyPilot helps you score higher by transforming raw notes into university-ready material.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-8">
            <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 space-y-2">
              <Zap className="h-6 w-6 text-primary" />
              <p className="font-black text-sm">Summarize</p>
              <p className="text-xs text-muted-foreground leading-relaxed">Turn chapters into bullet points.</p>
            </div>
            <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 space-y-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <p className="font-black text-sm">Exam Answer</p>
              <p className="text-xs text-muted-foreground leading-relaxed">Structured scoring answers.</p>
            </div>
            <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 space-y-2">
              <AlertCircle className="h-6 w-6 text-primary" />
              <p className="font-black text-sm">Important Qs</p>
              <p className="text-xs text-muted-foreground leading-relaxed">Predicted 2/5/10 mark Qs.</p>
            </div>
            <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 space-y-2">
              <FileText className="h-6 w-6 text-primary" />
              <p className="font-black text-sm">Revision Sheets</p>
              <p className="text-xs text-muted-foreground leading-relaxed">One-page memory hacks.</p>
            </div>
          </div>
          <DialogFooter>
            <Button className="w-full rounded-2xl font-black h-14 text-lg" onClick={closeOnboarding}>Start Studying Now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
             <h1 className="text-4xl font-black font-headline tracking-tight text-slate-900">Study Workspace</h1>
             {userData?.plan === 'free' && <Badge variant="outline" className="font-black text-amber-600 border-amber-200 bg-amber-50">Free Pilot</Badge>}
             {userData?.plan !== 'free' && <Badge className="bg-primary/10 text-primary border-none font-black flex gap-1 items-center"><Star className="h-3 w-3 fill-primary" /> Pro Access</Badge>}
          </div>
          <p className="text-muted-foreground font-medium">Generate university-grade study material in seconds.</p>
        </div>
        
        {userData?.plan === 'free' && (
          <Card className="p-5 w-full md:w-80 bg-white border-2 border-slate-100 shadow-sm rounded-[2rem]">
            <div className="flex justify-between text-xs font-black mb-3 uppercase tracking-widest text-slate-500">
              <span>Daily Prep Limit</span>
              <span>{usage.used} / {usage.total}</span>
            </div>
            <Progress value={(usage.used / usage.total) * 100} className="h-2" />
            <Link href="/dashboard/billing" className="text-[10px] text-primary mt-3 font-black flex items-center gap-1 hover:underline">
               Upgrade for unlimited exam prep <ArrowRight className="h-2 w-2" />
            </Link>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
        {/* Input Column */}
        <div className="xl:col-span-5 space-y-6">
          <Card className="border-2 border-slate-50 shadow-sm rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-slate-50/50 pb-6 border-b">
              <CardTitle className="text-xl font-black font-headline flex items-center justify-between">
                <span>Notes Input</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-primary font-bold hover:bg-primary/5 rounded-xl"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-3.5 w-3.5 mr-2" /> Upload PDF
                </Button>
              </CardTitle>
              <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} accept=".txt,.pdf" />
            </CardHeader>
            <CardContent className="pt-8 space-y-6">
              <div className="space-y-2">
                <Label className="font-black text-sm text-slate-600 uppercase tracking-widest">Topic / Unit Name</Label>
                <Input 
                  placeholder="e.g., Photosynthesis - Biology Unit 2" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="rounded-2xl border-slate-100 h-12 font-bold placeholder:font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-black text-sm text-slate-600 uppercase tracking-widest">Subject</Label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger className="rounded-2xl h-12 border-slate-100 font-bold">
                      <SelectValue placeholder="Subject" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      {SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                {activeTool === "answer" && (
                  <div className="space-y-2">
                    <Label className="font-black text-sm text-slate-600 uppercase tracking-widest">Length</Label>
                    <Select value={answerMode} onValueChange={setAnswerMode}>
                      <SelectTrigger className="rounded-2xl h-12 border-slate-100 font-bold">
                        <SelectValue placeholder="Mode" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        {ANSWER_MODES.map(m => <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label className="font-black text-sm text-slate-600 uppercase tracking-widest">Content / Raw Notes</Label>
                <Textarea
                  placeholder="Paste your raw notes or textbook material here..."
                  className="min-h-[350px] resize-none rounded-[2rem] border-slate-100 focus-visible:ring-primary leading-relaxed p-6 font-medium text-slate-600"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-[2rem] border-2 border-slate-50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Label className="font-black text-sm">Exam Booster Mode</Label>
                    <Badge className="bg-amber-100 text-amber-700 border-none text-[8px] font-black tracking-widest">PRO</Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-bold">University marking-scheme optimization</p>
                </div>
                <Switch 
                  checked={isExamBooster} 
                  onCheckedChange={(checked) => {
                    if (userData?.plan === 'free') {
                      toast({ title: "Pro Feature", description: "Exam Booster Mode is for Pro users.", variant: "destructive" });
                      return;
                    }
                    setIsExamBooster(checked);
                  }} 
                />
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50/50 p-6 border-t">
              <Button 
                className="w-full h-16 text-xl font-black rounded-2xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 gap-3" 
                onClick={() => handleToolAction()}
                disabled={loading || !inputText}
              >
                {loading ? (
                   <div className="flex items-center gap-3">
                    <div className="h-6 w-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </div>
                ) : (
                  <>
                    <Sparkles className="h-6 w-6" />
                    Generate {activeTool}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border-none shadow-none bg-primary/5 rounded-[2.5rem] p-8 flex justify-between items-center group cursor-pointer hover:bg-primary/10 transition-all" asChild>
            <Link href="/dashboard/history">
              <div className="flex gap-5 items-center">
                <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                  <History className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="font-black text-lg">Study Library</p>
                  <p className="text-xs text-muted-foreground font-bold">Access your favorite study packs</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Link>
          </Card>
        </div>

        {/* Output Column */}
        <div className="xl:col-span-7 h-full">
          <Tabs value={activeTool} onValueChange={setActiveTool} className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 bg-slate-100/50 p-1.5 mb-8 rounded-[1.8rem] h-16">
              {[
                { id: "summarize", label: "Summarizer", icon: Zap },
                { id: "answer", label: "Exam Answer", icon: BookOpen },
                { id: "questions", label: "Questions", icon: AlertCircle },
                { id: "revision", label: "Revision Sheet", icon: FileText }
              ].map(t => (
                <TabsTrigger 
                  key={t.id}
                  value={t.id} 
                  className="rounded-2xl font-black text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-primary transition-all gap-2"
                >
                  <t.icon className="h-4 w-4 hidden sm:block" />
                  {t.label.split(" ")[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex-1 bg-white rounded-[3rem] border-2 border-slate-50 shadow-sm overflow-hidden flex flex-col min-h-[850px]">
              {!result && !loading && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-8">
                  <div className="p-12 bg-slate-50 rounded-full animate-pulse relative">
                    <GraduationCap className="h-28 w-28 text-slate-200" />
                    <MousePointer2 className="h-8 w-8 text-primary absolute bottom-4 right-4" />
                  </div>
                  <div className="space-y-4 max-w-sm">
                    <p className="font-black text-4xl font-headline text-slate-300 tracking-tighter">Pilot Ready</p>
                    <p className="text-slate-400 font-bold leading-relaxed">Paste your raw notes on the left and choose a study tool. StudyPilot will transform them into exam-ready material.</p>
                  </div>
                </div>
              )}

              {loading && (
                <div className="flex-1 flex flex-col items-center justify-center space-y-10 py-32">
                  <div className="relative">
                    <div className="h-40 w-40 border-8 border-primary/10 border-t-primary rounded-full animate-spin" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <Zap className="h-16 w-16 text-primary animate-bounce" />
                    </div>
                  </div>
                  <div className="text-center space-y-3">
                    <p className="font-black text-4xl font-headline tracking-tighter">Pilot is Processing...</p>
                    <p className="text-muted-foreground font-bold text-lg">Optimizing for {subject} standards...</p>
                  </div>
                </div>
              )}

              {result && (
                <div className="flex-1 flex flex-col p-10 animate-in fade-in zoom-in-95 duration-700 overflow-auto scrollbar-hide">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b pb-10 gap-8">
                    <div className="space-y-2">
                      <div className="flex gap-2 items-center">
                        <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                          {subject}
                        </Badge>
                        {isExamBooster && <Badge className="bg-amber-100 text-amber-700 border-none text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full flex gap-1 items-center"><Star className="h-3 w-3 fill-amber-700" /> Booster Mode</Badge>}
                      </div>
                      <h2 className="text-4xl font-black font-headline tracking-tighter text-slate-900">{title || "Untitled Material"}</h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className={cn("h-12 w-12 rounded-2xl transition-colors", isFavorite ? "bg-yellow-50 text-yellow-500 border-yellow-100" : "border-slate-100 text-slate-300")}
                        onClick={handleFavorite}
                      >
                        <Star className={cn("h-5 w-5", isFavorite && "fill-yellow-500")} />
                      </Button>
                      <Button variant="outline" className="rounded-2xl h-12 gap-2 border-slate-100 font-bold px-6" onClick={copyToClipboard}>
                        <Copy className="h-4 w-4" /> Copy
                      </Button>
                      <Button className="rounded-2xl h-12 gap-2 shadow-2xl shadow-primary/20 font-black px-8" onClick={() => {
                        if (userData?.plan === 'free') toast({ title: "Premium Export", description: "Upgrade to Pro for clean PDF exports!" });
                        else window.print();
                      }}>
                        <FileDown className="h-5 w-5" /> Export
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-12 pb-16">
                    {activeTool === "summarize" && (
                      <div className="space-y-10">
                        <section className="bg-primary/5 p-10 rounded-[2.5rem] border-2 border-primary/5">
                          <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-6">Quick Executive Summary</h3>
                          <p className="text-slate-800 leading-relaxed text-2xl font-bold">{result.shortSummary}</p>
                        </section>
                        <section className="space-y-8">
                          <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2"><Layers className="h-4 w-4" /> Comprehensive Notes</h3>
                          <div className="grid grid-cols-1 gap-5">
                            {result.bulletPoints?.map((bp: string, i: number) => (
                              <div key={i} className="flex gap-6 p-6 bg-slate-50/50 rounded-3xl border border-slate-100 hover:border-primary/20 hover:bg-white transition-all shadow-sm group">
                                <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-xs shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">{i+1}</div>
                                <p className="text-slate-700 font-bold leading-loose text-lg">{bp}</p>
                              </div>
                            ))}
                          </div>
                        </section>
                        <section>
                          <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-8">Critical Exam Concepts</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {result.keyConcepts?.map((kc: any, i: number) => (
                              <div key={i} className="p-8 bg-white rounded-[2.2rem] border-2 border-slate-50 shadow-sm group hover:border-primary/20 transition-all">
                                <p className="font-black text-primary mb-3 text-xl">{kc.term}</p>
                                <p className="text-slate-600 leading-relaxed font-bold text-sm italic">{kc.explanation}</p>
                              </div>
                            ))}
                          </div>
                        </section>
                        <section className="bg-amber-50 p-10 rounded-[2.5rem] border-2 border-amber-100/50 flex gap-6 items-start">
                           <ShieldAlert className="h-8 w-8 text-amber-600 shrink-0 mt-1" />
                           <div className="space-y-3">
                             <h3 className="text-xs font-black text-amber-600 uppercase tracking-widest">Exam Predictor Logic</h3>
                             <p className="text-amber-900 font-black leading-relaxed text-xl">{result.examHighlights}</p>
                           </div>
                        </section>
                      </div>
                    )}

                    {activeTool === "answer" && (
                      <div className="space-y-12 max-w-4xl mx-auto">
                        <div className="text-center space-y-4 mb-16">
                          <p className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">Structured Model Answer</p>
                          <h3 className="text-5xl font-black font-headline tracking-tighter text-slate-900 leading-tight">{result.title}</h3>
                        </div>
                        <div className="space-y-8">
                          <div className="inline-flex items-center px-6 py-2 rounded-full bg-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">Part 1: Introduction</div>
                          <p className="text-slate-800 text-2xl leading-relaxed font-bold border-l-8 border-primary/20 pl-8 italic">{result.introduction}</p>
                        </div>
                        <div className="space-y-8">
                          <div className="inline-flex items-center px-6 py-2 rounded-full bg-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">Part 2: Main Content Body</div>
                          <div className="text-slate-700 text-xl leading-loose whitespace-pre-line font-bold bg-slate-50/50 p-10 rounded-[3rem] border-2 border-slate-50">{result.mainBody}</div>
                        </div>
                        <div className="space-y-8">
                          <div className="inline-flex items-center px-6 py-2 rounded-full bg-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">Part 3: Final Conclusion</div>
                          <p className="text-slate-800 text-2xl leading-relaxed font-bold">{result.conclusion}</p>
                        </div>
                        <div className="pt-12 border-t flex flex-wrap gap-4 items-center justify-center">
                          <span className="text-xs font-black text-slate-300 uppercase mr-4 tracking-widest">Keywords:</span>
                          {result.keyTerms?.map((kt: string, i: number) => (
                            <Badge key={i} className="bg-primary/5 text-primary border-none px-6 py-2.5 rounded-full font-black text-xs hover:bg-primary hover:text-white transition-colors cursor-default">{kt}</Badge>
                          ))}
                        </div>
                        <div className="p-10 bg-slate-900 text-white rounded-[3rem] flex gap-8 items-start shadow-2xl relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform">
                             <Zap className="h-40 w-40" />
                           </div>
                           <div className="p-4 bg-primary rounded-2xl shrink-0">
                             <MousePointer2 className="h-8 w-8 text-white" />
                           </div>
                           <div className="space-y-3 relative z-10">
                             <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Exam Hall Tip</p>
                             <p className="text-2xl font-black font-headline leading-tight">{result.examTip}</p>
                           </div>
                        </div>
                      </div>
                    )}

                    {activeTool === "questions" && (
                      <div className="space-y-16">
                        <section className="bg-rose-50/50 p-10 rounded-[3.5rem] border-4 border-rose-50 relative overflow-hidden group">
                           <div className="absolute top-[-10%] right-[-10%] h-64 w-64 bg-rose-500/5 rounded-full blur-3xl" />
                           <h3 className="text-sm font-black text-rose-600 uppercase tracking-[0.3em] mb-10 flex items-center gap-4">
                             <AlertCircle className="h-8 w-8" /> High Probability Exam Questions
                           </h3>
                           <div className="grid grid-cols-1 gap-5 relative z-10">
                              {result.mostProbable?.map((q: string, i: number) => (
                                <div key={i} className="p-8 bg-white rounded-[2.2rem] font-black text-2xl text-rose-950 border-2 border-rose-100 shadow-xl shadow-rose-100/50 flex gap-6 items-center hover:scale-[1.02] transition-transform cursor-default">
                                  <span className="text-rose-200 text-5xl italic font-headline opacity-50">0{i+1}</span>
                                  {q}
                                </div>
                              ))}
                           </div>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                           <div className="space-y-8">
                              <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">Short Prep (2 Marks)</h4>
                              {result.twoMarkQuestions?.map((q: string, i: number) => (
                                <div key={i} className="flex gap-5 items-start bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:bg-white hover:border-primary/20 transition-all">
                                  <span className="h-8 w-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-xs font-black text-slate-400 shrink-0">{i+1}</span>
                                  <p className="text-lg font-bold text-slate-700 pt-1 leading-relaxed">{q}</p>
                                </div>
                              ))}
                           </div>
                           <div className="space-y-8">
                              <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">Standard (5 Marks)</h4>
                              {result.fiveMarkQuestions?.map((q: string, i: number) => (
                                <div key={i} className="flex gap-5 items-start bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:bg-white hover:border-primary/20 transition-all">
                                  <span className="h-8 w-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-xs font-black text-slate-400 shrink-0">{i+1}</span>
                                  <p className="text-lg font-bold text-slate-700 pt-1 leading-relaxed">{q}</p>
                                </div>
                              ))}
                           </div>
                        </div>
                        
                        <section className="space-y-8">
                           <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">Essay Type / Section C (10 Marks)</h3>
                           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              {result.tenMarkQuestions?.map((q: string, i: number) => (
                                <div key={i} className="p-8 bg-slate-50 rounded-[2.5rem] font-bold text-xl text-slate-800 border-2 border-transparent hover:border-primary/20 hover:bg-white transition-all shadow-sm">
                                  {q}
                                </div>
                              ))}
                           </div>
                        </section>

                        <section className="bg-slate-900 p-12 rounded-[3.5rem] text-white relative overflow-hidden">
                           <div className="absolute bottom-0 right-0 p-10 opacity-5">
                             <Users className="h-64 w-64" />
                           </div>
                           <h3 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                             <MousePointer2 className="h-6 w-6" /> Viva / Oral Prep Questions
                           </h3>
                           <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {result.vivaQuestions?.map((v: string, i: number) => (
                                <li key={i} className="flex gap-6 items-start opacity-70 hover:opacity-100 transition-opacity">
                                  <div className="h-2 w-2 rounded-full bg-primary mt-3 shrink-0" />
                                  <p className="text-lg font-bold italic leading-relaxed">{v}</p>
                                </li>
                              ))}
                           </ul>
                        </section>
                      </div>
                    )}

                    {activeTool === "revision" && (
                      <div className="space-y-16 bg-slate-50/30 p-12 rounded-[4rem] border-4 border-slate-50/50">
                        <div className="text-center space-y-4 mb-16">
                          <p className="text-[10px] font-black text-primary uppercase tracking-[0.6em]">One-Page Memory Pack</p>
                          <h3 className="text-6xl font-black font-headline tracking-tighter text-slate-900 leading-[0.8]">Last Minute <br />Revision.</h3>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                           <section className="space-y-6">
                             <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest">Master Concept Summary</h4>
                             <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-50 shadow-2xl shadow-slate-200/50 text-slate-800 leading-loose font-bold text-xl whitespace-pre-line relative group">
                                <div className="absolute top-6 right-6 text-primary/10 group-hover:text-primary/30 transition-colors"><Zap className="h-10 w-10" /></div>
                                {result.quickNotes}
                             </div>
                           </section>
                           <section className="space-y-6">
                              <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest">Key Formulas & Definitions</h4>
                              <div className="space-y-5">
                                {result.formulasAndDefinitions?.map((f: string, i: number) => (
                                  <div key={i} className="p-6 bg-white rounded-2xl border-2 border-slate-100 text-lg font-black text-slate-700 flex gap-4 items-center">
                                    <Badge className="bg-slate-100 text-slate-400 border-none px-3 font-black text-[10px]">{i+1}</Badge>
                                    {f}
                                  </div>
                                ))}
                              </div>
                           </section>
                        </div>

                        <section className="space-y-8">
                           <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest">Mnemonics (Memory Shortcuts)</h4>
                           <div className="flex flex-wrap gap-5">
                             {result.mnemonics?.map((m: string, i: number) => (
                               <div key={i} className="px-10 py-5 bg-primary text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-primary/30 hover:scale-105 transition-transform cursor-default">
                                 {m}
                               </div>
                             ))}
                           </div>
                        </section>

                        <section className="bg-white p-12 rounded-[3.5rem] border-4 border-primary/5 shadow-sm">
                           <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-10 flex items-center gap-3"><CheckCircle2 className="h-5 w-5" /> Hall Entry Checklist</h4>
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                              {result.lastMinuteChecklist?.map((c: string, i: number) => (
                                <div key={i} className="flex gap-5 items-center p-4 bg-slate-50/50 rounded-2xl border border-slate-50 group hover:border-primary/20 transition-all">
                                   <div className="h-8 w-8 rounded-xl border-4 border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                                     <CheckCircle2 className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                   </div>
                                   <p className="text-lg font-black text-slate-700">{c}</p>
                                </div>
                              ))}
                           </div>
                        </section>
                      </div>
                    )}
                  </div>
                  
                  {/* Chaining UI */}
                  <div className="mt-auto pt-12 border-t">
                    <div className="flex flex-col items-center space-y-6">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-primary/5 text-primary border-none px-4 py-1.5 font-black text-[10px] tracking-widest">NEXT STUDY STEP</Badge>
                      </div>
                      <p className="text-sm font-black text-slate-400 uppercase tracking-widest text-center">Transform this result into another study format</p>
                      <div className="flex flex-wrap justify-center gap-4 pb-4">
                        {activeTool !== "summarize" && (
                          <Button variant="outline" className="rounded-2xl h-14 font-black border-2 border-slate-100 hover:border-primary hover:text-primary px-8 transition-all" onClick={() => chainToTool("summarize")}>
                            <Zap className="h-4 w-4 mr-2" /> Summarize This
                          </Button>
                        )}
                        {activeTool !== "answer" && (
                          <Button variant="outline" className="rounded-2xl h-14 font-black border-2 border-slate-100 hover:border-primary hover:text-primary px-8 transition-all" onClick={() => chainToTool("answer")}>
                            <BookOpen className="h-4 w-4 mr-2" /> Create Model Answer
                          </Button>
                        )}
                        {activeTool !== "questions" && (
                          <Button variant="outline" className="rounded-2xl h-14 font-black border-2 border-slate-100 hover:border-primary hover:text-primary px-8 transition-all" onClick={() => chainToTool("questions")}>
                            <AlertCircle className="h-4 w-4 mr-2" /> Extract Questions
                          </Button>
                        )}
                        {activeTool !== "revision" && (
                          <Button variant="outline" className="rounded-2xl h-14 font-black border-2 border-slate-100 hover:border-primary hover:text-primary px-8 transition-all" onClick={() => chainToTool("revision")}>
                            <FileText className="h-4 w-4 mr-2" /> Revision Pack
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
