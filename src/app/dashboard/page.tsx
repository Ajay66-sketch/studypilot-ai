
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
  GraduationCap, Zap, History, Star, ShieldAlert
} from "lucide-react";
import { summarizeNotes } from "@/ai/flows/summarize-notes";
import { generateExamAnswer } from "@/ai/flows/generate-exam-answer";
import { generateImportantQuestions } from "@/ai/flows/generate-important-questions-flow";
import { generateRevisionSheet } from "@/ai/flows/generate-revision-sheet";
import { checkUsageLimit, incrementUsage } from "@/lib/usage";
import { saveDocument, generateHash, findCachedDocument, updateOnboardingStatus } from "@/lib/firestore-services";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import Link from "next/link";

const SUBJECTS = ["General", "Computer Science", "Maths", "Physics", "Chemistry", "Commerce", "Biology", "Mechanical", "Electronics"];
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
  const [usage, setUsage] = useState({ used: 0, total: 5 });
  const [subject, setSubject] = useState("General");
  const [answerMode, setAnswerMode] = useState("medium");
  const [isExamBooster, setIsExamBooster] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
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
      setTitle(file.name.replace(".txt", ""));
    } else if (file.type === "application/pdf") {
      toast({ title: "PDF Extraction", description: "Extracting readable text... For best results, ensure the PDF is not an image-only scan." });
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setInputText(content);
        setTitle(file.name.replace(".pdf", ""));
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
      toast({ title: "Input Required", description: "Please enter some text or upload a file.", variant: "destructive" });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const usageLimit = await checkUsageLimit(user!.uid, userData?.plan || 'free');
      if (!usageLimit.allowed) {
        toast({ title: "Limit Reached", description: "Upgrade to Pro for unlimited daily generations!", variant: "destructive" });
        setLoading(false);
        return;
      }

      // Hash includes extra params for better uniqueness
      const hash = generateHash(input, tool, `${subject}:${answerMode}:${isExamBooster}`);
      const cached = await findCachedDocument(user!.uid, hash);
      
      if (cached) {
        setResult(cached.outputText);
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

      await saveDocument({
        uid: user!.uid,
        inputText: input,
        outputText: aiResult,
        featureType: tool as any,
        title: title || "Untitled Material",
        cachedHash: hash,
        isPremiumOutput: userData?.plan !== 'free',
        subject,
        answerMode: tool === 'answer' ? answerMode : undefined,
        isExamBooster
      });

      toast({ title: "Success", description: "Study material generated!" });
    } catch (error) {
      console.error(error);
      toast({ title: "Generation Error", description: "Something went wrong. Please check your internet and try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const text = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Content copied to clipboard." });
  };

  const chainToTool = (newTool: string) => {
    // Extract textual context from current result to use as input for next tool
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
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black font-headline text-center">Welcome, Pilot! 🚀</DialogTitle>
            <DialogDescription className="text-center text-lg">
              Let's get you ready to ace your semester. Here are your 4 core tools:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
              <Zap className="h-6 w-6 text-primary shrink-0" />
              <div>
                <p className="font-bold text-sm">Summarizer</p>
                <p className="text-xs text-muted-foreground">Turn long notes into bullet points & key terms.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
              <BookOpen className="h-6 w-6 text-primary shrink-0" />
              <div>
                <p className="font-bold text-sm">Exam Answer</p>
                <p className="text-xs text-muted-foreground">Structured Intro-Body-Conclusion scoring answers.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
              <AlertCircle className="h-6 w-6 text-primary shrink-0" />
              <div>
                <p className="font-bold text-sm">Important Questions</p>
                <p className="text-xs text-muted-foreground">Predict probable questions (2/5/10 marks).</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button className="w-full rounded-xl font-bold h-12" onClick={closeOnboarding}>Start Studying</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
             <h1 className="text-4xl font-black font-headline tracking-tight text-primary">Pilot Workspace</h1>
             {userData?.plan === 'free' && <Badge variant="outline" className="font-black text-amber-600 border-amber-200 bg-amber-50">Free Tier</Badge>}
             {userData?.plan !== 'free' && <Badge className="bg-primary/10 text-primary border-none font-black flex gap-1 items-center"><Star className="h-3 w-3 fill-primary" /> Pro</Badge>}
          </div>
          <p className="text-muted-foreground">Professional study material generator for semester exams.</p>
        </div>
        
        {userData?.plan === 'free' && (
          <Card className="p-4 w-full md:w-72 bg-primary/5 border-primary/20 shadow-none rounded-[1.5rem]">
            <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-wider">
              <span>Daily Limit</span>
              <span>{usage.used} / {usage.total}</span>
            </div>
            <Progress value={(usage.used / usage.total) * 100} className="h-2" />
            <Link href="/dashboard/billing" className="text-[10px] text-primary mt-2 font-black flex items-center gap-1 hover:underline">
               Upgrade for unlimited generations <ArrowRight className="h-2 w-2" />
            </Link>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Input Sidebar */}
        <div className="xl:col-span-4 space-y-6">
          <Card className="border-2 border-slate-100 shadow-sm overflow-hidden rounded-[2rem]">
            <CardHeader className="bg-slate-50/50 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" /> Workspace Input
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="space-y-2">
                <Label className="font-black text-slate-700">Topic or Document Title</Label>
                <Input 
                  placeholder="e.g., Photosynthesis - Biology Unit 2" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="rounded-xl border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="font-black text-slate-700">Subject</Label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                {activeTool === "answer" && (
                  <div className="space-y-2">
                    <Label className="font-black text-slate-700">Length Mode</Label>
                    <Select value={answerMode} onValueChange={setAnswerMode}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Mode" />
                      </SelectTrigger>
                      <SelectContent>
                        {ANSWER_MODES.map(m => <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="font-black text-slate-700">Content / Notes</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-primary font-bold hover:bg-primary/5 p-0"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-3.5 w-3.5 mr-1" /> Upload PDF/TXT
                  </Button>
                  <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} accept=".txt,.pdf" />
                </div>
                <Textarea
                  placeholder="Paste your textbook notes or raw content here..."
                  className="min-h-[300px] resize-none rounded-xl border-slate-200 focus-visible:ring-primary leading-relaxed"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <Label className="font-black text-sm">Exam Booster Mode</Label>
                    {userData?.plan === 'free' && <ShieldAlert className="h-3 w-3 text-muted-foreground" />}
                  </div>
                  <p className="text-[10px] text-muted-foreground font-medium">Scoring-focused structures (Premium)</p>
                </div>
                <Switch 
                  checked={isExamBooster} 
                  onCheckedChange={(checked) => {
                    if (userData?.plan === 'free') {
                      toast({ title: "Premium Feature", description: "Exam Booster Mode is only for Pro/Premium users.", variant: "destructive" });
                      return;
                    }
                    setIsExamBooster(checked);
                  }} 
                />
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50/50 p-4">
              <Button 
                className="w-full h-14 text-lg font-black rounded-2xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2" 
                onClick={() => handleToolAction()}
                disabled={loading || !inputText}
              >
                {loading ? (
                   <div className="flex items-center gap-3">
                    <div className="h-5 w-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </div>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Generate {activeTool.replace("-", " ")}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border-none shadow-none bg-primary/5 rounded-[2rem] p-6">
             <div className="flex gap-4 items-center mb-4">
               <div className="p-3 bg-primary/10 rounded-xl">
                 <History className="h-5 w-5 text-primary" />
               </div>
               <div className="space-y-1">
                 <p className="font-black text-sm">Need your old results?</p>
                 <Link href="/dashboard/history" className="text-xs text-primary font-bold hover:underline">View Your Study Library</Link>
               </div>
             </div>
          </Card>
        </div>

        {/* Output Area */}
        <div className="xl:col-span-8 h-full">
          <Tabs value={activeTool} onValueChange={setActiveTool} className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 bg-slate-100/80 p-1 mb-6 rounded-[1.5rem] h-14">
              {[
                { id: "summarize", label: "Summarizer", icon: Zap },
                { id: "answer", label: "Exam Answer", icon: BookOpen },
                { id: "questions", label: "Questions", icon: AlertCircle },
                { id: "revision", label: "Revision Sheet", icon: FileText }
              ].map(t => (
                <TabsTrigger 
                  key={t.id}
                  value={t.id} 
                  className="rounded-xl font-bold text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-md transition-all gap-2"
                >
                  <t.icon className="h-4 w-4 hidden md:block" />
                  {t.label.split(" ")[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex-1 bg-white rounded-[2.5rem] border-2 border-slate-50 shadow-sm overflow-hidden flex flex-col min-h-[700px]">
              {!result && !loading && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-6">
                  <div className="p-10 bg-slate-50 rounded-full animate-pulse">
                    <GraduationCap className="h-24 w-24 text-slate-200" />
                  </div>
                  <div className="space-y-3">
                    <p className="font-black text-3xl font-headline text-slate-400 tracking-tight">Your Material Ready Room</p>
                    <p className="text-slate-400 max-w-sm mx-auto font-medium">Input your notes on the left and choose a tool above. StudyPilot will transform them into exam-ready content.</p>
                  </div>
                </div>
              )}

              {loading && (
                <div className="flex-1 flex flex-col items-center justify-center space-y-8 py-24">
                  <div className="relative">
                    <div className="h-32 w-32 border-6 border-primary/10 border-t-primary rounded-full animate-spin" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <Zap className="h-12 w-12 text-primary animate-bounce" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="font-black text-3xl font-headline tracking-tighter">AI Pilot is Processing...</p>
                    <p className="text-muted-foreground font-medium">Extracting scoring points for {subject}...</p>
                  </div>
                </div>
              )}

              {result && (
                <div className="flex-1 flex flex-col p-8 animate-in fade-in zoom-in-95 duration-500 overflow-auto">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b pb-8 gap-6">
                    <div className="space-y-1">
                      <div className="flex gap-2 items-center">
                        <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase tracking-widest">
                          {subject}
                        </Badge>
                        {isExamBooster && <Badge className="bg-amber-100 text-amber-700 border-none text-[10px] font-black uppercase tracking-widest">Booster Enabled</Badge>}
                      </div>
                      <h2 className="text-3xl font-black font-headline tracking-tight">{title || "Generated Material"}</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" className="rounded-xl h-12 gap-2 border-slate-200 font-bold" onClick={copyToClipboard}>
                        <Copy className="h-4 w-4" /> Copy
                      </Button>
                      <Button className="rounded-xl h-12 gap-2 shadow-xl shadow-primary/10 font-black" onClick={() => {
                        if (userData?.plan === 'free') toast({ title: "Premium Export", description: "Watermark-free PDF exports are for Pro users. Copy-pasting works for free users!" });
                        else window.print();
                      }}>
                        <FileDown className="h-4 w-4" /> Export
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-10 pb-12">
                    {activeTool === "summarize" && (
                      <div className="space-y-8">
                        <section className="bg-primary/5 p-8 rounded-[2rem] border border-primary/10">
                          <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4">Quick Summary</h3>
                          <p className="text-slate-800 leading-relaxed text-xl font-medium">{result.shortSummary}</p>
                        </section>
                        <section className="space-y-6">
                          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Key Takeaways</h3>
                          <div className="grid grid-cols-1 gap-4">
                            {result.bulletPoints?.map((bp: string, i: number) => (
                              <div key={i} className="flex gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-primary/20 transition-all">
                                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                <p className="text-slate-700 font-medium leading-relaxed">{bp}</p>
                              </div>
                            ))}
                          </div>
                        </section>
                        <section>
                          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Critical Terms</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {result.keyConcepts?.map((kc: any, i: number) => (
                              <div key={i} className="p-5 bg-white rounded-2xl border-2 border-slate-50 group hover:border-primary/20 transition-all">
                                <p className="font-black text-primary mb-2 text-lg">{kc.term}</p>
                                <p className="text-sm text-slate-600 leading-relaxed font-medium">{kc.explanation}</p>
                              </div>
                            ))}
                          </div>
                        </section>
                        <section className="bg-amber-50 p-8 rounded-[2rem] border border-amber-100">
                           <h3 className="text-xs font-black text-amber-600 uppercase tracking-widest mb-4">Exam Highlights</h3>
                           <p className="text-amber-900 font-bold leading-relaxed">{result.examHighlights}</p>
                        </section>
                      </div>
                    )}

                    {activeTool === "answer" && (
                      <div className="space-y-10 max-w-3xl mx-auto">
                        <div className="text-center space-y-3 mb-12">
                          <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Structured Answer Guide</p>
                          <h3 className="text-4xl font-black font-headline tracking-tight">{result.title}</h3>
                        </div>
                        <div className="space-y-6">
                          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest">Introduction</div>
                          <p className="text-slate-800 text-lg leading-relaxed font-medium border-l-4 border-slate-100 pl-6 italic">{result.introduction}</p>
                        </div>
                        <div className="space-y-6">
                          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest">Main Answer Body</div>
                          <div className="text-slate-700 text-lg leading-loose whitespace-pre-line font-medium bg-slate-50/50 p-8 rounded-[2rem]">{result.mainBody}</div>
                        </div>
                        <div className="space-y-6">
                          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest">Conclusion</div>
                          <p className="text-slate-800 text-lg leading-relaxed font-medium">{result.conclusion}</p>
                        </div>
                        <div className="pt-10 border-t flex flex-wrap gap-3 items-center">
                          <span className="text-xs font-black text-slate-400 uppercase mr-2">Keywords:</span>
                          {result.keyTerms?.map((kt: string, i: number) => (
                            <Badge key={i} className="bg-primary/5 text-primary border-none px-4 py-1.5 rounded-full font-bold">{kt}</Badge>
                          ))}
                        </div>
                        <div className="p-6 bg-primary text-white rounded-[1.5rem] flex gap-4 items-start shadow-xl shadow-primary/20">
                           <Zap className="h-6 w-6 shrink-0 fill-white/20" />
                           <div className="space-y-1">
                             <p className="text-xs font-black uppercase tracking-widest opacity-70">Exam Tip</p>
                             <p className="font-bold">{result.examTip}</p>
                           </div>
                        </div>
                      </div>
                    )}

                    {activeTool === "questions" && (
                      <div className="space-y-12">
                        <section className="bg-rose-50 p-8 rounded-[2.5rem] border border-rose-100">
                           <h3 className="text-sm font-black text-rose-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                             <AlertCircle className="h-5 w-5" /> High Probability Questions
                           </h3>
                           <div className="grid grid-cols-1 gap-3">
                              {result.mostProbable?.map((q: string, i: number) => (
                                <div key={i} className="p-5 bg-white rounded-2xl font-black text-rose-900 border-2 border-rose-100/50 shadow-sm">
                                  {q}
                                </div>
                              ))}
                           </div>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                           <div className="space-y-6">
                              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Short (2 Marks)</h4>
                              {result.twoMarkQuestions?.map((q: string, i: number) => (
                                <div key={i} className="flex gap-4 items-start">
                                  <span className="h-7 w-7 rounded-lg bg-slate-50 flex items-center justify-center text-xs font-black text-slate-400 shrink-0">{i+1}</span>
                                  <p className="text-sm font-bold text-slate-700 pt-1">{q}</p>
                                </div>
                              ))}
                           </div>
                           <div className="space-y-6">
                              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Medium (5 Marks)</h4>
                              {result.fiveMarkQuestions?.map((q: string, i: number) => (
                                <div key={i} className="flex gap-4 items-start">
                                  <span className="h-7 w-7 rounded-lg bg-slate-50 flex items-center justify-center text-xs font-black text-slate-400 shrink-0">{i+1}</span>
                                  <p className="text-sm font-bold text-slate-700 pt-1">{q}</p>
                                </div>
                              ))}
                           </div>
                        </div>
                        
                        <section>
                           <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Essay Type (10 Marks)</h3>
                           <div className="space-y-4">
                              {result.tenMarkQuestions?.map((q: string, i: number) => (
                                <div key={i} className="p-6 bg-slate-50 rounded-[1.5rem] font-bold text-slate-800 border-2 border-transparent hover:border-primary/10 transition-all">
                                  {q}
                                </div>
                              ))}
                           </div>
                        </section>

                        <section className="bg-slate-900 p-8 rounded-[2rem] text-white">
                           <h3 className="text-xs font-black text-primary uppercase tracking-widest mb-4">Viva/Oral Prep</h3>
                           <ul className="space-y-4">
                              {result.vivaQuestions?.map((v: string, i: number) => (
                                <li key={i} className="flex gap-4 items-start opacity-80 hover:opacity-100 transition-opacity">
                                  <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                                  <p className="font-medium">{v}</p>
                                </li>
                              ))}
                           </ul>
                        </section>
                      </div>
                    )}

                    {activeTool === "revision" && (
                      <div className="space-y-12 bg-slate-50/50 p-10 rounded-[3rem] border-2 border-slate-50">
                        <div className="text-center space-y-2 mb-10">
                          <p className="text-xs font-black text-primary uppercase tracking-[0.4em]">One-Page Master Sheet</p>
                          <h3 className="text-4xl font-black font-headline tracking-tighter">Last Minute Revision</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                           <section className="space-y-4">
                             <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Core Summary</h4>
                             <p className="text-slate-700 leading-relaxed font-bold whitespace-pre-line bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm">{result.quickNotes}</p>
                           </section>
                           <section className="space-y-4">
                              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Formulas & Definitions</h4>
                              <div className="space-y-3">
                                {result.formulasAndDefinitions?.map((f: string, i: number) => (
                                  <div key={i} className="p-4 bg-white rounded-xl border border-slate-100 text-sm font-bold text-slate-600">
                                    {f}
                                  </div>
                                ))}
                              </div>
                           </section>
                        </div>

                        <section>
                           <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Mnemonics (Memory Tricks)</h4>
                           <div className="flex flex-wrap gap-4">
                             {result.mnemonics?.map((m: string, i: number) => (
                               <div key={i} className="px-6 py-3 bg-primary text-white rounded-full font-black text-sm shadow-xl shadow-primary/20">
                                 {m}
                               </div>
                             ))}
                           </div>
                        </section>

                        <section className="bg-white p-8 rounded-[2rem] border-2 border-primary/10">
                           <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-6">Hall Checklist</h4>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {result.lastMinuteChecklist?.map((c: string, i: number) => (
                                <div key={i} className="flex gap-3 items-center p-3">
                                   <div className="h-5 w-5 rounded-md border-2 border-primary shrink-0" />
                                   <p className="text-sm font-bold text-slate-700">{c}</p>
                                </div>
                              ))}
                           </div>
                        </section>
                      </div>
                    )}
                  </div>
                  
                  {/* Chaining UI */}
                  <div className="mt-auto pt-10 border-t">
                    <div className="flex flex-col items-center space-y-4">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Next Step in your Study Cycle?</p>
                      <div className="flex flex-wrap justify-center gap-3">
                        {activeTool !== "summarize" && (
                          <Button variant="secondary" className="rounded-xl h-10 font-bold" onClick={() => chainToTool("summarize")}>
                            Summarize This
                          </Button>
                        )}
                        {activeTool !== "answer" && (
                          <Button variant="secondary" className="rounded-xl h-10 font-bold" onClick={() => chainToTool("answer")}>
                            Generate Answer
                          </Button>
                        )}
                        {activeTool !== "questions" && (
                          <Button variant="secondary" className="rounded-xl h-10 font-bold" onClick={() => chainToTool("questions")}>
                            Create Questions
                          </Button>
                        )}
                        {activeTool !== "revision" && (
                          <Button variant="secondary" className="rounded-xl h-10 font-bold" onClick={() => chainToTool("revision")}>
                            Revision Sheet
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
