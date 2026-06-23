"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, getDocs, Timestamp } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Calendar, ChevronRight, Search, Clock, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HistoryDoc {
  id: string;
  type: string;
  inputText: string;
  output: any;
  createdAt: Timestamp;
}

export default function HistoryPage() {
  const { user } = useAuth();
  const [docs, setDocs] = useState<HistoryDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      try {
        const q = query(
          collection(db, "documents"),
          where("uid", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const historyData: HistoryDoc[] = [];
        querySnapshot.forEach((doc) => {
          historyData.push({ id: doc.id, ...doc.data() } as HistoryDoc);
        });
        setDocs(historyData);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const filteredDocs = docs.filter(doc => 
    doc.inputText.toLowerCase().includes(search.toLowerCase()) || 
    doc.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">History</h1>
          <p className="text-muted-foreground">Access your previously generated study materials.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search history..." 
            className="pl-10" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="py-24 text-center border rounded-2xl bg-white space-y-4">
          <div className="p-4 bg-slate-50 w-fit mx-auto rounded-full">
            <Clock className="h-12 w-12 text-slate-300" />
          </div>
          <p className="text-slate-500 font-medium">No history found.</p>
          <Button variant="outline" asChild>
            <a href="/dashboard">Create your first document</a>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <Card key={doc.id} className="group hover:border-primary transition-all duration-300 cursor-pointer flex flex-col overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge className="capitalize bg-primary/10 text-primary border-none">{doc.type}</Badge>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {doc.createdAt.toDate().toLocaleDateString()}
                  </span>
                </div>
                <CardTitle className="text-lg line-clamp-1 mt-2 font-headline">{doc.inputText}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {typeof doc.output === 'string' 
                    ? doc.output 
                    : doc.output.summary || doc.output.introduction || doc.output.revisionSheet || "Generated content..."}
                </p>
              </CardContent>
              <CardFooter className="bg-slate-50/50 pt-4 flex justify-between items-center group-hover:bg-primary/5 transition-colors">
                <Button variant="ghost" size="sm" className="text-xs hover:text-primary p-0">
                  View Full Details <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
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