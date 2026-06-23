
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { getUserDocuments, deleteDocument, toggleFavorite, StudyDocument } from "@/lib/firestore-services";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Calendar, ChevronRight, Search, Clock, Trash2, Filter, Copy, Star, Trash, BookOpen, Zap, AlertCircle } from "lucide-react";
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
import { cn } from "@/lib/utils";

export default function HistoryPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [docs, setDocs] = useState<StudyDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);

  const fetchHistory = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getUserDocuments(user.uid, { 
        featureType: filterType || undefined,
        search: search || undefined,
        favoritesOnly: showFavorites
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
  }, [user, filterType, search, showFavorites]);

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

  const handleToggleFavorite = async (doc: StudyDocument) => {
    if (!doc.id) return;
    const newStatus = !doc.isFavorite;
    try {
      await toggleFavorite(doc.id, newStatus);
      setDocs(prev => prev.map(d => d.id === doc.id ? { ...d, isFavorite: newStatus } : d));
      toast({ title: newStatus ? "Favorited" : "Unfavorited", description: newStatus ? "Added to your study pack." : "Removed from study pack." });
    } catch (e) {
      toast({ title: "Error", description: "Failed to update favorite.", variant: "destructive" });
    }
  };

  const copyToClipboard = (text: any) => {
    const content = typeof text === 'string' ? text : JSON.stringify(text);
    navigator.clipboard.writeText(content);
    toast({ title: "Copied", description: "Material copied to clipboard." });
  };

  const getToolIcon = (type: string) => {
    switch (type) {
      case 'summarize': return <Zap className="h-3 w-3" />;
      case 'answer': return <BookOpen className="h-3 w-3" />;
      case 'questions': return <AlertCircle className="h-3 w-3" />;
      case 'revision': return <FileText className="h-3 w-3" />;
      default: return <FileText className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black font-headline tracking-tight">Study Library</h1>
          <p className="text-muted-foreground font-medium">Your personal collection of exam-ready material.</p>
        </div>
        
        <div className="flex flex-wrap w-full md:w-auto gap-2">
          <div className="relative flex-1 md:w-64 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search title..." 
              className="pl-10 rounded-xl" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button 
            variant={showFavorites ? "default" : "outline"} 
            className="rounded-xl gap-2 font-bold"
            onClick={() => setShowFavorites(!showFavorites)}
          >
            <Star className={cn("h-4 w-4", showFavorites && "fill-white")} /> Study Pack
          </Button>
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
            <p className="text-slate-400 font-black text-3xl tracking-tight">No Material Found</p>
            <p className="text-muted-foreground max-w-sm mx-auto font-medium">Try changing your filters or start generating in the workspace.</p>
          </div>
          <Button className="rounded-xl px-10 h-12 font-black shadow-lg shadow-primary/20" asChild>
            <a href="/dashboard">Go to Workspace</a>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.map((doc) => (
            <Card key={doc.id} className="group hover:border-primary/50 transition-all duration-300 flex flex-col overflow-hidden rounded-[2.2rem] border-2 border-slate-50 shadow-sm bg-white">
              <CardHeader className="pb-4 relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "absolute top-6 right-6 h-8 w-8 rounded-full transition-colors", 
                    doc.isFavorite ? "text-yellow-500 hover:text-yellow-600 bg-yellow-50" : "text-slate-300 hover:text-yellow-500"
                  )}
                  onClick={() => handleToggleFavorite(doc)}
                >
                  <Star className={cn("h-4 w-4", doc.isFavorite && "fill-yellow-500")} />
                </Button>
                <div className="flex gap-2">
                  <Badge className="capitalize bg-primary/10 text-primary border-none text-[9px] font-black uppercase tracking-widest flex gap-1 items-center">
                    {getToolIcon(doc.featureType)} {doc.featureType}
                  </Badge>
                  {doc.isExamBooster && <Badge className="bg-amber-100 text-amber-600 border-none text-[8px] font-black">BOOSTER</Badge>}
                </div>
                <CardTitle className="text-xl line-clamp-1 mt-4 font-black font-headline tracking-tight group-hover:text-primary transition-colors pr-8">{doc.title}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                   <Badge variant="outline" className="text-[9px] font-bold border-slate-100 text-slate-400">{doc.subject || "General"}</Badge>
                   <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {doc.createdAt?.toDate().toLocaleDateString() || 'Just now'}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-slate-500 line-clamp-4 leading-relaxed font-medium italic">
                  {typeof doc.outputText === 'string' 
                    ? doc.outputText 
                    : doc.outputText.shortSummary || doc.outputText.introduction || doc.outputText.quickNotes || "Structured Study Material..."}
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
                    className="h-8 w-8 text-slate-300 hover:text-destructive rounded-lg"
                    onClick={() => doc.id && handleDelete(doc.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button variant="default" size="sm" className="rounded-xl h-8 font-black px-6" onClick={() => {
                    toast({ title: "Opening Material", description: "Returning to workspace with this context." });
                    // Store in sessionStorage to restore in dashboard
                    sessionStorage.setItem('restore_doc', JSON.stringify(doc));
                    router.push('/dashboard');
                  }}>
                    Reuse
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
