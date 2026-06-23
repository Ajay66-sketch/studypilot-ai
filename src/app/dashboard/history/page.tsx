
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { getUserDocuments, deleteDocument, toggleFavorite, StudyDocument } from "@/lib/firestore-services";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Calendar, Search, Trash2, Filter, Copy, Star, BookOpen, Zap, AlertCircle, Share2 } from "lucide-react";
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
    if (!window.confirm("Delete this study document? This cannot be undone.")) return;
    try {
      await deleteDocument(id);
      setDocs(prev => prev.filter(d => d.id !== id));
      toast({ title: "Deleted", description: "Material removed from library." });
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
      toast({ title: newStatus ? "Favorited" : "Removed", description: newStatus ? "Added to Revision Pack." : "Removed from Revision Pack." });
    } catch (e) {
      toast({ title: "Error", description: "Failed to update pack.", variant: "destructive" });
    }
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
          <p className="text-muted-foreground font-medium italic">Your exam-ready materials, organized and ready for revision.</p>
        </div>
        
        <div className="flex flex-wrap w-full md:w-auto gap-3">
          <div className="relative flex-1 md:w-72 min-w-[200px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
            <Input 
              placeholder="Search title..." 
              className="pl-11 h-12 rounded-2xl border-2 border-slate-50 focus:border-primary shadow-sm font-bold" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button 
            variant={showFavorites ? "default" : "outline"} 
            className="rounded-2xl h-12 gap-2 font-black shadow-sm"
            onClick={() => setShowFavorites(!showFavorites)}
          >
            <Star className={cn("h-4 w-4", showFavorites && "fill-white")} /> Revision Pack
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-2xl h-12 gap-2 font-black shadow-sm">
                <Filter className="h-4 w-4 text-primary" /> {filterType ? filterType.charAt(0).toUpperCase() + filterType.slice(1) : "All Tools"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-xl p-2 w-48 font-bold">
              <DropdownMenuItem onClick={() => setFilterType(null)}>All Formats</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("summarize")}>Summaries</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("answer")}>Exam Answers</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("questions")}>Question Banks</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("revision")}>Revision Sheets</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-72 w-full rounded-[2.5rem]" />
          ))}
        </div>
      ) : docs.length === 0 ? (
        <div className="py-32 text-center border-4 border-dashed rounded-[4rem] bg-slate-50/50 space-y-6">
          <div className="p-10 bg-white w-fit mx-auto rounded-full shadow-sm">
            <FileText className="h-20 w-20 text-slate-100" />
          </div>
          <div className="space-y-2 px-6">
            <p className="text-slate-900 font-black text-3xl tracking-tight">Empty Library</p>
            <p className="text-muted-foreground max-w-sm mx-auto font-medium">Start generating study materials in your workspace to build your library.</p>
          </div>
          <Button className="rounded-2xl px-12 h-14 font-black shadow-xl shadow-primary/20 text-lg" asChild>
            <a href="/dashboard">Back to Workspace</a>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {docs.map((doc) => (
            <Card key={doc.id} className="group hover:border-primary/40 transition-all duration-500 flex flex-col overflow-hidden rounded-[2.5rem] border-2 border-slate-50 shadow-md bg-white">
              <CardHeader className="pb-4 relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "absolute top-8 right-8 h-10 w-10 rounded-xl transition-all", 
                    doc.isFavorite ? "text-yellow-500 bg-yellow-50 shadow-sm" : "text-slate-200 hover:text-yellow-500"
                  )}
                  onClick={(e) => { e.stopPropagation(); handleToggleFavorite(doc); }}
                >
                  <Star className={cn("h-5 w-5", doc.isFavorite && "fill-yellow-500")} />
                </Button>
                <div className="flex gap-2">
                  <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black uppercase tracking-widest flex gap-1.5 items-center px-3 py-1 rounded-full">
                    {getToolIcon(doc.featureType)} {doc.featureType}
                  </Badge>
                  {doc.isExamBooster && <Badge className="bg-amber-100 text-amber-700 border-none text-[8px] font-black px-3 rounded-full">BOOSTER</Badge>}
                </div>
                <CardTitle className="text-xl line-clamp-2 mt-6 font-black font-headline leading-tight tracking-tight group-hover:text-primary transition-colors pr-10">{doc.title}</CardTitle>
                <div className="flex items-center gap-3 mt-2">
                   <Badge variant="outline" className="text-[10px] font-bold border-slate-100 text-slate-400 px-3">{doc.subject || "General"}</Badge>
                   <span className="text-[10px] font-black text-slate-300 flex items-center gap-1 uppercase tracking-widest">
                    <Calendar className="h-3 w-3" />
                    {doc.createdAt?.toDate().toLocaleDateString() || 'Just now'}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-slate-500 line-clamp-4 leading-relaxed font-medium italic">
                  {typeof doc.outputText === 'string' 
                    ? doc.outputText 
                    : doc.outputText.shortSummary || doc.outputText.introduction || doc.outputText.quickNotes || "Structured high-quality study material..."}
                </p>
              </CardContent>
              <CardFooter className="bg-slate-50/50 pt-4 flex justify-between items-center px-8 py-5 border-t border-slate-100">
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 text-slate-300 hover:text-destructive rounded-xl hover:bg-destructive/5 transition-colors"
                    onClick={() => doc.id && handleDelete(doc.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-xl h-9 font-black px-5 border-2 text-xs" onClick={() => {
                    toast({ title: "Opening Material", description: "Returning to workspace with this context." });
                    sessionStorage.setItem('restore_doc', JSON.stringify(doc));
                    router.push('/dashboard');
                  }}>
                    Reuse
                  </Button>
                  <Button variant="default" size="sm" className="rounded-xl h-9 font-black px-6 shadow-lg shadow-primary/20 text-xs" onClick={() => {
                    sessionStorage.setItem('restore_doc', JSON.stringify(doc));
                    router.push('/dashboard');
                  }}>
                    View
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

