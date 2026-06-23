"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, BookOpen, AlertCircle, Sparkles, Send, Copy, FileDown } from "lucide-react";
import { summarizeNotes } from "@/ai/flows/summarize-notes";
import { generateExamAnswer } from "@/ai/flows/generate-exam-answer";
import { generateImportantQuestions } from "@/ai/flows/generate-important-questions-flow";
import { generateRevisionSheet } from "@/ai/flows/generate-revision-sheet";
import { checkUsageLimit, incrementUsage } from "@/lib/usage";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { user, userData } = useAuth();
  const { toast } = useToast();
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTool, setActiveTool] = useState("summarize");
  const [result, setResult] = useState<any>(null);

  const handleToolAction = async () => {
    if (!inputText.trim()) {
      toast({ title: "Input Required", description: "Please enter some text to process.", variant: "destructive" });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const usage = await checkUsageLimit(user!.uid, userData?.plan || 'free');
      if (!usage.allowed) {
        toast({ title: "Limit Reached", description: "You've reached your 5 requests/day limit. Upgrade to Pro for unlimited usage!", variant: "destructive" });
        setLoading(false);
        return;
      }

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

      // Save to history
      await addDoc(collection(db, "documents"), {
        uid: user!.uid,
        inputText,
        output: aiResult,
        type: activeTool,
        createdAt: serverTimestamp(),
      });

      toast({ title: "Success", description: "Your study material is ready!" });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to generate material. Please try again.", variant: "destructive" });
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Study Workspace</h1>
          <p className="text-muted-foreground">Transform your raw materials into exam success.</p>
        </div>
        {userData?.plan === 'free' && (
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-4 py-1">
            Free Plan: 5 Daily Requests
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-none shadow-xl shadow-slate-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-primary" />
                Input Source
              </CardTitle>
              <CardDescription>Paste your raw notes, chapter text, or question here.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Type or paste text here..."
                className="min-h-[300px] resize-none focus-visible:ring-primary border-slate-200"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <div className="mt-4 flex gap-2">
                <Button 
                  className="flex-1 rounded-full bg-primary hover:bg-primary/90" 
                  onClick={handleToolAction}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Process Material
                    </div>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-accent/10 border-none">
            <CardContent className="p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <p className="text-sm text-accent-foreground font-medium">
                Pro Tip: Be descriptive in your input for higher quality answers.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7">
          <Tabs value={activeTool} onValueChange={setActiveTool} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-100 p-1 mb-6 rounded-xl">
              <TabsTrigger value="summarize" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Summary</TabsTrigger>
              <TabsTrigger value="answer" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Answers</TabsTrigger>
              <TabsTrigger value="questions" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Questions</TabsTrigger>
              <TabsTrigger value="revision" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Revision</TabsTrigger>
            </TabsList>

            <div className="min-h-[500px] bg-white rounded-2xl border shadow-sm p-6 overflow-auto">
              {!result && !loading && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40 py-24">
                  <div className="p-6 bg-slate-50 rounded-full">
                    <BookOpen className="h-16 w-16 text-slate-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-lg text-slate-500">No output generated yet</p>
                    <p className="text-slate-400 max-w-[280px]">Select a tool and click "Process Material" to see the magic happen.</p>
                  </div>
                </div>
              )}

              {loading && (
                <div className="h-full flex flex-col items-center justify-center space-y-6 py-24">
                  <div className="relative">
                    <div className="h-24 w-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary animate-pulse" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-xl font-headline">Pilot is processing...</p>
                    <p className="text-muted-foreground">Crafting high-quality study materials for you.</p>
                  </div>
                </div>
              )}

              {result && (
                <div className="space-y-6 animate-in fade-in duration-700">
                  <div className="flex justify-between items-center border-b pb-4">
                    <h2 className="text-xl font-bold font-headline capitalize">{activeTool.replace("-", " ")} Output</h2>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-2" onClick={copyToClipboard}>
                        <Copy className="h-4 w-4" /> Copy
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <FileDown className="h-4 w-4" /> Export
                      </Button>
                    </div>
                  </div>

                  <div className="prose prose-slate max-w-none">
                    {activeTool === "summarize" && result.summary && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-bold">Quick Summary</h3>
                          <p className="text-slate-700 leading-relaxed">{result.summary}</p>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">Key Concepts</h3>
                          <ul className="list-disc pl-5 space-y-2">
                            {result.keyConcepts?.map((item: string, i: number) => <li key={i} className="text-slate-700">{item}</li>)}
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">Important Terms</h3>
                          <div className="flex flex-wrap gap-2 pt-2">
                            {result.importantTerms?.map((term: string, i: number) => (
                              <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-700 border-none">{term}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTool === "answer" && (
                      <div className="space-y-6">
                        <div className="bg-slate-50 p-4 rounded-lg border-l-4 border-primary">
                          <h3 className="text-sm uppercase tracking-wider text-primary font-bold mb-1">Introduction</h3>
                          <p className="text-slate-700">{result.introduction}</p>
                        </div>
                        <div>
                          <h3 className="text-sm uppercase tracking-wider text-slate-400 font-bold mb-2">Main Body</h3>
                          <div className="whitespace-pre-line text-slate-700 leading-relaxed">{result.body}</div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg border-l-4 border-accent">
                          <h3 className="text-sm uppercase tracking-wider text-accent font-bold mb-1">Conclusion</h3>
                          <p className="text-slate-700">{result.conclusion}</p>
                        </div>
                      </div>
                    )}

                    {activeTool === "questions" && (
                      <div className="space-y-8">
                        {['twoMarkQuestions', 'fiveMarkQuestions', 'tenMarkQuestions'].map((key) => (
                          <div key={key}>
                            <h3 className="text-lg font-bold border-b pb-1 mb-4">
                              {key === 'twoMarkQuestions' ? 'Short Answers (2 Marks)' : 
                               key === 'fiveMarkQuestions' ? 'Medium Answers (5 Marks)' : 'Long Essays (10 Marks)'}
                            </h3>
                            <div className="space-y-4">
                              {result[key]?.map((q: string, i: number) => (
                                <div key={i} className="flex gap-4 p-3 bg-slate-50 rounded-xl items-start">
                                  <span className="font-bold text-primary bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center shrink-0">{i+1}</span>
                                  <p className="text-slate-700 pt-1">{q}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTool === "revision" && (
                      <div className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-200">
                        <div className="flex justify-between items-center mb-6">
                          <div className="flex items-center gap-2 text-primary font-bold">
                            <FileText className="h-5 w-5" /> REVISION SHEET
                          </div>
                          <Badge variant="outline" className="text-[10px] opacity-50">STUDYPILOT AI</Badge>
                        </div>
                        <div className="whitespace-pre-line text-slate-700 leading-loose">
                          {result.revisionSheet}
                        </div>
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