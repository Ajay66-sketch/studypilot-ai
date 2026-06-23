
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { getUserDocuments, deleteDocument, StudyDocument } from "@/lib/firestore-services";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Calendar, ChevronRight, Search, Clock, Trash2, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export default function HistoryPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [docs, setDocs] = useState<StudyDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);

  const fetchHistory = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getUserDocuments(user.uid, filterType || undefined);
      setDocs(data);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user, filterType]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      await deleteDocument(id);
      setDocs(prev => prev.filter(d => d.id !== id));
      toast({ title: "Deleted", description: "Document removed from history." });
    } catch (e) {
      toast({ title: "Error", description: "Failed to delete.", variant: "destructive" });
    }
  };

  const filteredDocs = docs.filter(doc => 
    doc.title.toLowerCase().includes(search.toLowerCase()) || 
    doc.featureType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black font-headline tracking-tight">Your History</h1>
          <p className="text-muted-foreground">Access and manage all your generated study materials.</p>
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
              <Button variant="outline" className="rounded-xl gap-2">
                <Filter className="h-4 w-4" /> {filterType || "All"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-xl">
              <DropdownMenuItem onClick={() => setFilterType(null)}>All Types</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("summarize")}>Summaries</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("answer")}>Exam Answers</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("questions")}>Questions</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("revision")}>Revision Sheets</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-56 w-full rounded-3xl" />
          ))}
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="py-32 text-center border-2 border-dashed rounded-3xl bg-white space-y-6">
          <div className="p-6 bg-slate-50 w-fit mx-auto rounded-full">
            <Clock className="h-16 w-16 text-slate-300" />
          </div>
          <div className="space-y-2">
            <p className="text-slate-400 font-black text-2xl">No documents found.</p>
            <p className="text-muted-foreground">Start generating material to see your history grow.</p>
          </div>
          <Button variant="outline" className="rounded-xl px-8" asChild>
            <a href="/dashboard">Go to Workspace</a>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <Card key={doc.id} className="group hover:border-primary/50 transition-all duration-300 flex flex-col overflow-hidden rounded-3xl border-2 border-slate-50 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <Badge className="capitalize bg-primary/10 text-primary border-none text-[10px] font-black uppercase">
                    {doc.featureType}
                  </Badge>
                  <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-full">
                    <Calendar className="h-3 w-3" />
                    {doc.createdAt?.toDate().toLocaleDateString() || 'Just now'}
                  </span>
                </div>
                <CardTitle className="text-xl line-clamp-1 mt-4 font-black font-headline">{doc.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {typeof doc.outputText === 'string' 
                    ? doc.outputText 
                    : doc.outputText.shortSummary || doc.outputText.introduction || doc.outputText.quickNotes || "Generated study material..."}
                </p>
              </CardContent>
              <CardFooter className="bg-slate-50/50 pt-4 flex justify-between items-center px-6 py-4">
                <Button variant="ghost" size="sm" className="text-xs font-black hover:text-primary p-0">
                  View Details <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                  onClick={() => doc.id && handleDelete(doc.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
