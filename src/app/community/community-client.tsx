"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Star, StarHalf, Star as StarFill, MessageCircle, Search, TrendingUp, Clock } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface CommunityPromptItem {
  id: number;
  title: string;
  style: string;
  tone: string;
  responseType: string;
  context: string;
  author: { id: string; name: string | null; image: string | null };
  avgRating: number;
  ratingsCount: number;
  commentsCount: number;
  createdAt: string;
}

interface CommentItem {
  id: number;
  content: string;
  createdAt: string;
  user: { id: string; name: string | null; image: string | null };
}

export function CommunityPageClient() {
  const { data: session } = useSession();
  const [items, setItems] = useState<CommunityPromptItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("trending");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 12;

  const fetchList = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize), sort });
      if (query.trim()) params.set("query", query.trim());
      const res = await fetch(`/api/community/prompts?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load community prompts");
      const data = await res.json();
      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch (e: any) {
      toast.error(e.message || "Failed to load prompts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, page]);

  const handleSearch = () => {
    setPage(1);
    fetchList();
  };

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total]);

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Community Prompts</h1>
          <p className="text-muted-foreground mt-1">Explora, califica y comenta prompts compartidos por la comunidad.</p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search prompts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trending">
                <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Trending</div>
              </SelectItem>
              <SelectItem value="new">
                <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> New</div>
              </SelectItem>
              <SelectItem value="top">
                <div className="flex items-center gap-2"><Star className="h-4 w-4" /> Top</div>
              </SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 w-2/3 bg-muted rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-24 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No prompts found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it) => (
            <PromptCard key={it.id} item={it} onUpdated={(u) => setItems((prev) => prev.map(p => p.id === u.id ? u : p))} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button variant="outline" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</Button>
          <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
          <Button variant="outline" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
        </div>
      )}
    </main>
  );
}

function Stars({ value, onRate, disabled }: { value: number; onRate?: (v: number) => void; disabled?: boolean }) {
  const int = Math.floor(value || 0);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const idx = i + 1;
        const filled = idx <= int;
        return (
          <button
            key={idx}
            type="button"
            className={cn("p-0.5 rounded hover:scale-105 transition", disabled ? "cursor-default" : "cursor-pointer")}
            onClick={() => !disabled && onRate?.(idx)}
            aria-label={`Rate ${idx} star`}
          >
            <Star className={cn("h-4 w-4", filled ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground")} />
          </button>
        );
      })}
    </div>
  );
}

function PromptCard({ item, onUpdated }: { item: CommunityPromptItem; onUpdated: (u: CommunityPromptItem) => void }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<CommentItem[] | null>(null);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [local, setLocal] = useState(item);

  useEffect(() => setLocal(item), [item]);

  const loadComments = async () => {
    try {
      const res = await fetch(`/api/community/prompts/${local.id}/comments?page=1&pageSize=10`);
      if (!res.ok) throw new Error("Failed to load comments");
      const data = await res.json();
      setComments(data.items);
    } catch (e: any) {
      toast.error(e.message || "Failed to load comments");
    }
  };

  const handleToggleComments = async () => {
    const next = !commentsOpen;
    setCommentsOpen(next);
    if (next && comments === null) {
      await loadComments();
    }
  };

  const handleRate = async (v: number) => {
    if (!session?.user) {
      toast.info("Login required to rate");
      window.location.href = `/login?redirect=${encodeURIComponent("/community")}`;
      return;
    }
    try {
      const res = await fetch(`/api/community/prompts/${local.id}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("bearer_token")}`,
        },
        body: JSON.stringify({ value: v }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to rate");
      const updated = { ...local, avgRating: data.avgRating, ratingsCount: data.ratingsCount } as CommunityPromptItem;
      setLocal(updated);
      onUpdated(updated);
      toast.success("Thanks for your rating!");
    } catch (e: any) {
      toast.error(e.message || "Failed to rate");
    }
  };

  const handleAddComment = async () => {
    if (!session?.user) {
      toast.info("Login required to comment");
      window.location.href = `/login?redirect=${encodeURIComponent("/community")}`;
      return;
    }
    if (!commentText.trim()) {
      toast.error("Write a comment first");
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch(`/api/community/prompts/${local.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("bearer_token")}`,
        },
        body: JSON.stringify({ content: commentText.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to comment");
      setComments((prev) => [data, ...(prev || [])]);
      setCommentText("");
      // increment comments count locally
      const updated = { ...local, commentsCount: (local.commentsCount || 0) + 1 } as CommunityPromptItem;
      setLocal(updated);
      onUpdated(updated);
    } catch (e: any) {
      toast.error(e.message || "Failed to comment");
    } finally {
      setSubmitting(false);
    }
  };

  const created = new Date(local.createdAt).toLocaleString();

  return (
    <Card className="hover:border-primary/40 transition-colors duration-200">
      <CardHeader>
        <CardTitle className="line-clamp-2 text-lg">{local.title}</CardTitle>
        <CardDescription>
          by {local.author?.name || "Anonymous"} • {created}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{local.style}</Badge>
          <Badge variant="secondary">{local.tone}</Badge>
          <Badge variant="secondary">{local.responseType}</Badge>
          <Badge variant="outline">{local.context}</Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Stars value={local.avgRating || 0} onRate={handleRate} />
            <span className="text-xs text-muted-foreground">({local.ratingsCount})</span>
          </div>
          <button onClick={handleToggleComments} className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            <MessageCircle className="h-4 w-4" /> {local.commentsCount} Comments
          </button>
        </div>

        {commentsOpen && (
          <div className="mt-2 space-y-3">
            <div className="space-y-2">
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                rows={3}
              />
              <div className="flex justify-end">
                <Button size="sm" onClick={handleAddComment} disabled={submitting}>
                  {submitting ? "Posting..." : "Post"}
                </Button>
              </div>
            </div>

            <div className="space-y-3 max-h-60 overflow-auto pr-1">
              {comments === null ? (
                <p className="text-sm text-muted-foreground">Loading comments...</p>
              ) : comments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No comments yet. Be the first!</p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="rounded-md border p-3">
                    <div className="text-sm font-medium">{c.user?.name || "User"}</div>
                    <div className="text-xs text-muted-foreground mb-1">{new Date(c.createdAt).toLocaleString()}</div>
                    <p className="text-sm whitespace-pre-wrap">{c.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}