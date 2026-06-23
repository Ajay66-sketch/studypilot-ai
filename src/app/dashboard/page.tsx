
"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, BookOpen, AlertCircle, Sparkles, Send, Copy, FileDown, Upload, X, Trash2, Share2 } from "lucide-react";
import { summarizeNotes } from "@/ai/flows/summarize-notes";
import { generateExamAnswer } from "@/ai/flows/generate-exam-answer";
import { generateImportantQuestions } from "@/ai/flows/generate-important-questions-flow";
import { generateRevisionSheet } from "@/ai/flows/generate-revision-sheet";
import { checkUsageLimit, incrementUsage } from "@/lib/usage";
import { saveDocument, generateHash, findCachedDocument } from "@/lib/firestore-services";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function Dashboard() {
  const { user, userData } = useAuth();
  const { toast } = useToast();
  const [inputText, setInputText] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTool, setActiveTool] = useState("summarize");
  const [result, setResult] = useState<any>(null);
  const [usage, setUsage] = useState({ used: 0, total: 5 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync usage
  useState(() => {
    const fetchUsage = async () => {
      if (user) {
        const u = await checkUsageLimit(user.uid, userData?.plan || 'free');
        setUsage({ used: 5 - u.remaining, total: 5 });
      }
    };
    fetchUsage();
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === "text/plain") {
      const text = await file.text();
      setInputText(text);
      setTitle(file.name.replace(".txt", ""));
    } else if (file.type === "application/pdf") {
      toast({ title: "PDF Processing", description: "Currently extracting basic text from PDF... For complex PDFs, please copy-paste manually for better accuracy." });
      // Simple text extraction simulation or basic browser read if possible
      // In a real MVP, we'd use a lib here. For now, we prompt copy-paste.
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

  const handleToolAction = async () => {
    if (!inputText.trim()) {
      toast({ title: "Input Required", description: "Please enter some text or upload a file.", variant: "destructive" });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // 1. Check Usage
      const usageLimit = await checkUsageLimit(user!.uid, userData?.plan || 'free');
      if (!usageLimit.allowed) {
        toast({ title: "Limit Reached", description: "Free users are limited to 5 requests per day. Upgrade to Pro for unlimited!", variant: "destructive" });
        setLoading(false);
        return;
      }

      // 2. Check Cache
      const hash = generateHash(inputText, activeTool);
      const cached = await findCachedDocument(user!.uid, hash);
      
      if (cached) {
        setResult(cached.outputText);
        toast({ title: "Restored", description: "Fetched from your recent history." });
        setLoading(false);
        return;
      }

      // 3. AI Generation
      let aiResult;
      switch (activeTool) {
        case "summarize":
          aiResult = await summarizeNotes({ notes: inputText });
          break;
        case "answer":
          aiResult = await generateExamAnswer({ questionOrTopic: inputText });
          break;
        case "questions":
          aiResult = await generateImportantQuestions({ chapterNotes: inputText });
          break;
        case "revision":
          aiResult = await generateRevisionSheet({ topic: inputText });
          break;
      }

      setResult(aiResult);
      await incrementUsage(user!.uid);
      setUsage(prev => ({ ...prev, used: prev.used + 1 }));

      // 4. Save to History
      await saveDocument({
        uid: user!.uid,
        inputText,
        outputText: aiResult,
        featureType: activeTool as any,
        title: title || "Untitled Document",
        cachedHash: hash,
        isPremiumOutput: userData?.plan !== 'free'
      });

      toast({ title: "Success", description: "Generated successfully!" });
    } catch (error) {
      console.error(error);
      toast({ title: "Generation Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const text = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Content copied to clipboard." });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black font-headline tracking-tight text-primary">Workspace</h1>
          <p className="text-muted-foreground">Professional study materials powered by Gemini AI.</p>
        </div>
        
        {userData?.plan === 'free' && (
          <Card className="p-4 w-full md:w-72 bg-primary/5 border-primary/20 shadow-none">
            <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-wider">
              <span>Usage Limit</span>
              <span>{usage.used} / {usage.total}</span>
            </div>
            <Progress value={(usage.used / usage.total) * 100} className="h-2" />
            <p className="text-[10px] text-primary mt-2 font-medium">Resetting daily at midnight IST</p>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-5 space-y-6">
          <Card className="border-2 border-slate-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" /> Input Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Topic or Title</label>
                <Input 
                  placeholder="e.g., Photosynthesis Chapter 2" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="rounded-xl border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700">Raw Content</label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-primary font-bold hover:bg-primary/5"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-3.5 w-3.5 mr-1" /> Upload File
                  </Button>
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    accept=".txt,.pdf"
                  />
                </div>
                <Textarea
                  placeholder="Paste your notes or exam question here..."
                  className="min-h-[350px] resize-none rounded-xl border-slate-200 focus-visible:ring-primary leading-relaxed"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50/50 p-4">
              <Button 
                className="w-full h-12 text-lg font-bold rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20" 
                onClick={handleToolAction}
                disabled={loading || !inputText}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing Content...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Generate {activeTool.replace("-", " ")}
                  </div>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="xl:col-span-7">
          <Tabs value={activeTool} onValueChange={setActiveTool} className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 bg-slate-100/80 p-1 mb-6 rounded-2xl h-14">
              {[
                { id: "summarize", label: "Summary" },
                { id: "answer", label: "Answers" },
                { id: "questions", label: "Questions" },
                { id: "revision", label: "Revision" }
              ].map(t => (
                <TabsTrigger 
                  key={t.id}
                  value={t.id} 
                  className="rounded-xl font-bold text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-md transition-all"
                >
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex-1 bg-white rounded-3xl border-2 border-slate-50 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
              {!result && !loading && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4 opacity-50">
                  <div className="p-8 bg-slate-50 rounded-full">
                    <BookOpen className="h-20 w-20 text-slate-300" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-black text-2xl text-slate-400">Ready to Pilot?</p>
                    <p className="text-slate-400 max-w-sm">Enter your study materials on the left and choose a tool above to start generating high-quality notes.</p>
                  </div>
                </div>
              )}

              {loading && (
                <div className="flex-1 flex flex-col items-center justify-center space-y-6 py-24">
                  <div className="relative">
                    <div className="h-28 w-28 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <GraduationCap className="h-10 w-10 text-primary animate-pulse" />
                    </div>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="font-black text-2xl font-headline">StudyPilot AI is Crafting...</p>
                    <p className="text-muted-foreground animate-pulse">Extracting the most important concepts for you.</p>
                  </div>
                </div>
              )}

              {result && (
                <div className="flex-1 flex flex-col p-8 animate-in fade-in zoom-in-95 duration-500 overflow-auto">
                  <div className="flex justify-between items-center mb-8 border-b pb-6">
                    <div className="space-y-1">
                      <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase">
                        {activeTool.replace("-", " ")} Material
                      </Badge>
                      <h2 className="text-2xl font-black font-headline">{title || "Your Material"}</h2>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="rounded-xl h-10 gap-2 border-slate-200" onClick={copyToClipboard}>
                        <Copy className="h-4 w-4" /> Copy
                      </Button>
                      <Button className="rounded-xl h-10 gap-2 shadow-sm" onClick={() => window.print()}>
                        <FileDown className="h-4 w-4" /> Export
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-8 pb-10">
                    {/* Tool Specific Views */}
                    {activeTool === "summarize" && (
                      <div className="space-y-8">
                        <section className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
                          <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-4">Quick Summary</h3>
                          <p className="text-slate-700 leading-relaxed text-lg font-medium">{result.shortSummary}</p>
                        </section>
                        <section>
                          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Key Takeaways</h3>
                          <ul className="space-y-3">
                            {result.bulletPoints?.map((bp: string, i: number) => (
                              <li key={i} className="flex gap-3 text-slate-700 font-medium">
                                <span className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                                {bp}
                              </li>
                            ))}
                          </ul>
                        </section>
                        <section>
                          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Critical Terms</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {result.keyConcepts?.map((kc: any, i: number) => (
                              <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="font-bold text-primary mb-1">{kc.term}</p>
                                <p className="text-sm text-slate-600 leading-relaxed">{kc.explanation}</p>
                              </div>
                            ))}
                          </div>
                        </section>
                      </div>
                    )}

                    {activeTool === "answer" && (
                      <div className="space-y-8 max-w-2xl mx-auto">
                        <div className="space-y-4">
                          <Badge variant="outline" className="text-slate-400 border-slate-200">Introduction</Badge>
                          <p className="text-slate-700 leading-relaxed">{result.introduction}</p>
                        </div>
                        <div className="space-y-4">
                          <Badge variant="outline" className="text-slate-400 border-slate-200">Main Answer</Badge>
                          <p className="text-slate-700 leading-relaxed whitespace-pre-line">{result.mainBody}</p>
                        </div>
                        <div className="space-y-4">
                          <Badge variant="outline" className="text-slate-400 border-slate-200">Conclusion</Badge>
                          <p className="text-slate-700 leading-relaxed">{result.conclusion}</p>
                        </div>
                        <div className="pt-6 border-t flex flex-wrap gap-2 items-center">
                          <span className="text-xs font-black text-slate-400 uppercase mr-2">Remember:</span>
                          {result.keywords?.map((kw: string, i: number) => (
                            <Badge key={i} className="bg-slate-100 text-slate-600 border-none px-4 py-1 rounded-full">{kw}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTool === "questions" && (
                      <div className="space-y-12">
                        {[
                          { key: 'twoMarkQuestions', label: 'Short (2 Marks)', color: 'text-blue-500' },
                          { key: 'fiveMarkQuestions', label: 'Medium (5 Marks)', color: 'text-purple-500' },
                          { key: 'tenMarkQuestions', label: 'Essay (10 Marks)', color: 'text-rose-500' }
                        ].map(cat => (
                          <div key={cat.key} className="space-y-6">
                            <h3 className={`text-lg font-black ${cat.color} flex items-center gap-2`}>
                              <AlertCircle className="h-5 w-5" /> {cat.label}
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                              {result[cat.key]?.map((q: string, i: number) => (
                                <div key={i} className="group p-5 bg-white border-2 border-slate-50 rounded-2xl flex gap-4 hover:border-primary/20 transition-all cursor-default">
                                  <span className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-xs font-black text-slate-400 shrink-0 group-hover:bg-primary/10 group-hover:text-primary">
                                    {i+1}
                                  </span>
                                  <p className="font-bold text-slate-700 pt-1 leading-relaxed">{q}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTool === "revision" && (
                      <div className="space-y-10 max-w-3xl mx-auto bg-slate-50/50 p-10 rounded-[3rem] border border-slate-100">
                        <div className="text-center space-y-2 mb-10">
                          <p className="text-xs font-black text-primary uppercase tracking-[0.3em]">Quick Scan Document</p>
                          <h3 className="text-3xl font-black font-headline">Revision Mastery</h3>
                        </div>
                        
                        <div className="space-y-6">
                          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Core Summary</h4>
                          <p className="text-slate-700 leading-loose text-lg whitespace-pre-line">{result.quickNotes}</p>
                        </div>

                        {result.formulasAndDefinitions?.length > 0 && (
                          <div className="space-y-6">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Key Definitions & Formulas</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {result.formulasAndDefinitions.map((f: string, i: number) => (
                                <div key={i} className="p-4 bg-white rounded-2xl border border-slate-100 font-bold text-slate-600 text-sm">
                                  {f}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {result.mnemonics?.length > 0 && (
                          <div className="space-y-6">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Memory Shortcuts</h4>
                            <div className="flex flex-wrap gap-4">
                              {result.mnemonics.map((m: string, i: number) => (
                                <div key={i} className="px-6 py-3 bg-primary text-white rounded-full font-black text-sm shadow-md shadow-primary/20">
                                  {m}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
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
