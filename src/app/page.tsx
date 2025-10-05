"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
export const runtime = "edge";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard after a brief moment to show loading
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Decorative gradient glow */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-24 flex justify-center">
        <div className="h-56 w-[38rem] blur-3xl rounded-full bg-gradient-to-r from-violet-500/25 via-fuchsia-500/20 to-blue-500/25 dark:from-violet-400/20 dark:via-fuchsia-400/15 dark:to-blue-400/20" />
      </div>

      <div className="relative z-10 text-center space-y-4 rounded-2xl border border-border/60 bg-background/60 px-6 py-8 backdrop-blur supports-[backdrop-filter]:bg-background/40">
        <Sparkles className="h-10 w-10 mx-auto text-violet-600 dark:text-violet-400 animate-pulse" />
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-blue-400">
            Preparando tu estudio de prompts
          </span>
        </h1>
        <p className="text-sm text-muted-foreground">Redirigiendo al Dashboard de Prompt Studio…</p>
      </div>
    </div>
  );
}