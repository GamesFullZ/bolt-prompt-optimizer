"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Star, Calendar } from "lucide-react";
import { storageService } from "@/lib/storage";
import { type GeneratedPrompt } from "@/lib/promptOptimizer";
import Navigation from "@/components/Navigation";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<GeneratedPrompt[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const favs = storageService.getFavorites();
    setFavorites(favs);
  };

  const handleCopy = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      toast.success("Prompt copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy prompt");
    }
  };

  const handleRemoveFavorite = (id: string) => {
    storageService.toggleFavorite(id);
    loadFavorites();
    toast.success("Removed from favorites");
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Toaster />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Favorite Prompts</h1>
          <p className="text-muted-foreground">
            Quick access to your saved favorite prompts
          </p>
        </div>

        {favorites.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-2">
                No favorite prompts yet
              </p>
              <p className="text-sm text-muted-foreground">
                Mark prompts as favorites from your history or dashboard to see
                them here
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {favorites.map((prompt) => (
              <Card key={prompt.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start gap-2">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <CardTitle className="text-lg line-clamp-2">
                          {prompt.originalText}
                        </CardTitle>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{prompt.options.style}</Badge>
                        <Badge variant="secondary">{prompt.options.tone}</Badge>
                        <Badge variant="secondary">
                          {prompt.options.responseType}
                        </Badge>
                        <Badge variant="outline">{prompt.options.context}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {formatDate(prompt.timestamp)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleCopy(prompt.optimizedPrompt)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleRemoveFavorite(prompt.id)}
                      >
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Optimized Prompt:</p>
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-sm font-mono whitespace-pre-wrap">
                        {prompt.optimizedPrompt}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}