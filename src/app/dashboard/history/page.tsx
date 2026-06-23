
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { getUserDocuments, deleteDocument, StudyDocument } from "@/lib/firestore-services";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Calendar, ChevronRight, Search, Clock, Trash2, Filter, Copy, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [docs, setDocs] = useState<StudyDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);

  const fetchHistory = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getUserDocuments(user.uid, { 
        featureType: filterType || undefined,
        search: search || undefined
      });
      setDocs(data);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHistory();
    }, 300);
    return () => clearTimeout(timer);
  }, [user, filterType, search]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this study document?")) return;
    try {
      await deleteDocument(id);
      setDocs(prev => prev.filter(d => d.id !== id));
      toast({ title: "Deleted", description: "Document removed from library." });
    } catch (e) {
      toast({ title: "Error", description: "Failed to delete.", variant: "destructive" });
    }
  };

  const copyToClipboard = (text: any) => {
    const content = typeof text === 'string' ? text : JSON.stringify(text);
    navigator.clipboard.writeText(content);
    toast({ title: "Copied", description: "Material copied to clipboard." });
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black font-headline tracking-tight">Study Library</h1>
          <p className="text-muted-foreground font-medium">Manage and reuse your AI-generated material.</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search title..." 
              className="pl-10 rounded-xl" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-xl gap-2 font-bold">
                <Filter className="h-4 w-4" /> {filterType ? filterType.charAt(0).toUpperCase() + filterType.slice(1) : "All Tools"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-xl">
              <DropdownMenuItem onClick={() => setFilterType(null)}>All Tools</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("summarize")}>Summarizer</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("answer")}>Exam Answer</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("questions")}>Questions</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("revision")}>Revision Sheets</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded-[2rem]" />
          ))}
        </div>
      ) : docs.length === 0 ? (
        <div className="py-32 text-center border-2 border-dashed rounded-[3rem] bg-white space-y-6">
          <div className="p-8 bg-slate-50 w-fit mx-auto rounded-full">
            <FileText className="h-20 w-20 text-slate-200" />
          </div>
          <div className="space-y-2">
            <p className="text-slate-400 font-black text-3xl tracking-tight">Library is Empty</p>
            <p className="text-muted-foreground max-w-sm mx-auto font-medium">You haven't generated any study material yet. Start in the workspace!</p>
          </div>
          <Button className="rounded-xl px-10 h-12 font-black shadow-lg shadow-primary/20" asChild>
            <a href="/dashboard">Open Workspace</a>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.map((doc) => (
            <Card key={doc.id} className="group hover:border-primary/50 transition-all duration-300 flex flex-col overflow-hidden rounded-[2rem] border-2 border-slate-50 shadow-sm bg-white">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <Badge className="capitalize bg-primary/10 text-primary border-none text-[9px] font-black uppercase tracking-widest">
                    {doc.featureType}
                  </Badge>
                  <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-full">
                    <Calendar className="h-3 w-3" />
                    {doc.createdAt?.toDate().toLocaleDateString() || 'Just now'}
                  </span>
                </div>
                <CardTitle className="text-xl line-clamp-1 mt-4 font-black font-headline tracking-tight group-hover:text-primary transition-colors">{doc.title}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                   <Badge variant="outline" className="text-[9px] font-bold border-slate-100 text-slate-400">{doc.subject || "General"}</Badge>
                   {doc.isExamBooster && <Badge className="bg-amber-100 text-amber-600 border-none text-[8px] font-black">BOOSTER</Badge>}
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-slate-500 line-clamp-4 leading-relaxed font-medium">
                  {typeof doc.outputText === 'string' 
                    ? doc.outputText 
                    : doc.outputText.shortSummary || doc.outputText.introduction || doc.outputText.quickNotes || "No preview available..."}
                </p>
              </CardContent>
              <CardFooter className="bg-slate-50/50 pt-4 flex justify-between items-center px-6 py-4 border-t">
                <div className="flex gap-1">
                   <Button 
                     variant="ghost" 
                     size="icon" 
                     className="h-8 w-8 text-slate-400 hover:text-primary rounded-lg"
                     onClick={() => copyToClipboard(doc.outputText)}
                   >
                     <Copy className="h-4 w-4" />
                   </Button>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-slate-400 hover:text-destructive rounded-lg"
                    onClick={() => doc.id && handleDelete(doc.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button variant="default" size="sm" className="rounded-lg h-8 font-black px-4" onClick={() => {
                    toast({ title: "Opening Material", description: "Redirecting you to the result view." });
                    // In a more complex app, we'd navigate to /dashboard/history/[id]
                    // For now, we simulate by going to workspace with this context if we had a proper state management
                  }}>
                    Open
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
