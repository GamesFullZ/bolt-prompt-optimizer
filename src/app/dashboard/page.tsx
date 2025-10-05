"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Copy, RotateCw, X, Zap, Coffee } from "lucide-react";
import { optimizePrompt, enhanceExistingPrompt, type PromptOptions } from "@/lib/promptOptimizer";
import { storageService } from "@/lib/storage";
import Navigation from "@/components/Navigation";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const [userInput, setUserInput] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [currentPromptId, setCurrentPromptId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [shortcutsEnabled, setShortcutsEnabled] = useState(false);

  const [options, setOptions] = useState<PromptOptions>({
    style: "Modern",
    tone: "Professional",
    responseType: "Web Application",
    context: "General",
  });

  // Load default settings on mount
  useEffect(() => {
    const settings = storageService.getSettings();
    setOptions({
      style: settings.defaultStyle,
      tone: settings.defaultTone,
      responseType: settings.defaultResponseType,
      context: settings.defaultContext,
    });
  }, []);

  // Show welcome modal on first visit
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome) {
      setShowWelcomeModal(true);
    }
  }, []);

  // Initialize and handle keyboard shortcuts
  useEffect(() => {
    const enabled = localStorage.getItem("enableKeyboardShortcuts") !== "false";
    setShortcutsEnabled(enabled);

    if (!enabled) return;

    const handleKeyboard = (e: KeyboardEvent) => {
      // Ctrl+Enter to generate
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (userInput.trim() && !isGenerating) {
          handleGenerate();
        }
      }
      // Ctrl+K to focus input
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("userInput")?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [userInput, isGenerating]);

  const handleCloseWelcome = () => {
    localStorage.setItem("hasSeenWelcome", "true");
    setShowWelcomeModal(false);
  };

  const handleGenerate = () => {
    if (!userInput.trim()) {
      toast.error("Please enter some text to generate a prompt");
      return;
    }

    const autoSave = localStorage.getItem("autoSaveToHistory") !== "false";
    const autoEnhance = localStorage.getItem("enhancePromptAutomatically") === "true";

    setIsGenerating(true);
    
    // Simulate processing time for better UX
    setTimeout(() => {
      let optimized = optimizePrompt(userInput, options);
      
      // Auto-enhance if enabled
      if (autoEnhance) {
        optimized = enhanceExistingPrompt(optimized);
      }
      
      setGeneratedPrompt(optimized);
      
      // Save to history if auto-save is enabled
      if (autoSave) {
        const promptData = {
          id: Date.now().toString(),
          originalText: userInput,
          optimizedPrompt: optimized,
          options: { ...options },
          timestamp: Date.now(),
          isFavorite: false,
        };
        
        storageService.savePrompt(promptData);
        setCurrentPromptId(promptData.id);
      }
      
      setIsGenerating(false);
      
      toast.success(autoEnhance ? "Prompt generated and enhanced!" : "Prompt generated successfully!");
    }, 800);
  };

  const handleEnhance = () => {
    if (!generatedPrompt) {
      toast.error("Generate a prompt first before enhancing");
      return;
    }

    const enhanced = enhanceExistingPrompt(generatedPrompt);
    setGeneratedPrompt(enhanced);
    toast.success("Prompt enhanced!");
  };

  const handleCopy = async () => {
    if (!generatedPrompt) return;

    try {
      await navigator.clipboard.writeText(generatedPrompt);
      toast.success("Prompt copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy prompt");
    }
  };

  const handleReset = () => {
    setUserInput("");
    setGeneratedPrompt("");
    setCurrentPromptId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Toaster />

      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div
          className="fixed inset-0 z-50 grid place-content-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalTitle"
          onClick={handleCloseWelcome}
        >
          <div 
            className="w-full max-w-lg rounded-xl bg-card border border-border shadow-2xl p-6 animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 id="modalTitle" className="text-2xl font-bold text-foreground">
                    ¡Bienvenido a Prompt Studio!
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Versión Experimental</p>
                </div>
              </div>
              <button
                onClick={handleCloseWelcome}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/20">
                <p className="text-sm text-foreground leading-relaxed">
                  🧪 <strong className="text-violet-400">Proyecto Experimental:</strong> Este proyecto está en fase beta. 
                  Estamos trabajando constantemente para mejorar la calidad de los prompts generados.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Coffee className="h-4 w-4 text-orange-500" />
                  ¿Cómo puedes apoyar este proyecto?
                </h3>
                
                <div className="space-y-2 pl-6">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">🛡️</span>
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Desactiva tu AdBlock</strong> - Esto nos ayuda a mantener el servicio gratuito
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">⭐</span>
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Comparte el proyecto</strong> - Ayúdanos a crecer compartiendo con otros desarrolladores
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Coffee className="h-4 w-4 text-orange-500 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Donaciones próximamente</strong> - Pronto podrás apoyarnos directamente
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">💬</span>
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Envía feedback</strong> - Tus sugerencias nos ayudan a mejorar
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                <p className="text-xs text-muted-foreground text-center">
                  Al usar esta herramienta, aceptas que es un proyecto en desarrollo y que los resultados pueden variar. 
                  <strong className="text-foreground"> ¡Gracias por tu paciencia y apoyo!</strong>
                </p>
              </div>
            </div>

            <footer className="mt-6 flex justify-end gap-2">
              <Button
                onClick={handleCloseWelcome}
                className="bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-500 hover:to-blue-500 transition-all duration-200 px-6"
              >
                ¡Empecemos! 🚀
              </Button>
            </footer>
          </div>
        </div>
      )}

      {isGenerating && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/60 backdrop-blur-sm">
          <div className="relative">
            <ul className="relative h-28 w-28">
              <li className="absolute left-1/2 top-1/2 -ml-10 -mt-10 h-20 w-20 rounded-full border-[5px] border-background border-t-violet-500/90 animate-spin [animation-duration:3s] [animation-timing-function:linear] shadow-[0_0_12px_2px_rgba(139,92,246,0.55),0_0_32px_rgba(59,130,246,0.35)]" />
              <li className="absolute left-1/2 top-1/2 -ml-7 -mt-7 h-14 w-14 rounded-full border-[5px] border-background border-t-fuchsia-500/90 animate-spin [animation-duration:2s] [animation-timing-function:linear] shadow-[0_0_10px_2px_rgba(217,70,239,0.5),0_0_26px_rgba(139,92,246,0.35)]" />
              <li className="absolute left-1/2 top-1/2 -ml-4 -mt-4 h-8 w-8 rounded-full border-[5px] border-background border-t-cyan-400/90 animate-spin [animation-duration:1.2s] [animation-timing-function:linear] shadow-[0_0_10px_2px_rgba(34,211,238,0.55),0_0_22px_rgba(59,130,246,0.35)]" />
            </ul>
            <span className="sr-only">Generando...</span>
          </div>
        </div>
      )}
      
      <motion.main
        className="container relative mx-auto px-4 py-10 max-w-6xl"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Decorative gradient glow */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-24 flex justify-center">
          <div className="h-48 w-[36rem] blur-3xl rounded-full bg-gradient-to-r from-violet-500/25 via-fuchsia-500/20 to-blue-500/25 dark:from-violet-400/20 dark:via-fuchsia-400/15 dark:to-blue-400/20" />
        </div>

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur supports-[backdrop-filter]:bg-background/40">
            <span className="h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
            Bolt‑native understanding • Enhanced Prompting
          </div>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-blue-400">Prompt Studio</span>
            <span className="text-foreground"> for Bolt.new</span>
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Convierte ideas en prompts listos para Bolt.new con un flujo moderno, rápido y preciso.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card className="border-border/60 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40 transition-colors duration-300 hover:border-primary/40">
            <CardHeader>
              <CardTitle>Your Idea</CardTitle>
              <CardDescription>
                Enter your concept or rough idea below
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userInput">Input Text</Label>
                <Textarea
                  id="userInput"
                  placeholder="E.g., A todo app with drag and drop, dark mode, and cloud sync..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  rows={8}
                  className="resize-none transition-colors duration-200 focus:ring-2 focus:ring-violet-500/40"
                />
                <p className="text-xs text-muted-foreground">
                  Tip: Sé específico sobre la plataforma, componentes clave, datos y restricciones.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="style">Style</Label>
                  <Select
                    value={options.style}
                    onValueChange={(value) =>
                      setOptions({ ...options, style: value })
                    }
                  >
                    <SelectTrigger id="style">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Modern">Modern</SelectItem>
                      <SelectItem value="Professional">Professional</SelectItem>
                      <SelectItem value="Creative">Creative</SelectItem>
                      <SelectItem value="Minimal">Minimal</SelectItem>
                      <SelectItem value="Default">Default</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tone">Tone</Label>
                  <Select
                    value={options.tone}
                    onValueChange={(value) =>
                      setOptions({ ...options, tone: value })
                    }
                  >
                    <SelectTrigger id="tone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Professional">Professional</SelectItem>
                      <SelectItem value="Friendly">Friendly</SelectItem>
                      <SelectItem value="Technical">Technical</SelectItem>
                      <SelectItem value="Casual">Casual</SelectItem>
                      <SelectItem value="Neutral">Neutral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="responseType">Type</Label>
                  <Select
                    value={options.responseType}
                    onValueChange={(value) =>
                      setOptions({ ...options, responseType: value })
                    }
                  >
                    <SelectTrigger id="responseType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Web Application">Web Application</SelectItem>
                      <SelectItem value="Component">Component</SelectItem>
                      <SelectItem value="Landing Page">Landing Page</SelectItem>
                      <SelectItem value="Dashboard">Dashboard</SelectItem>
                      <SelectItem value="E-commerce">E-commerce</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="context">Context</Label>
                  <Select
                    value={options.context}
                    onValueChange={(value) =>
                      setOptions({ ...options, context: value })
                    }
                  >
                    <SelectTrigger id="context">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General">General</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Educational">Educational</SelectItem>
                      <SelectItem value="Personal">Personal</SelectItem>
                      <SelectItem value="Entertainment">Entertainment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !userInput.trim()}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-md hover:from-violet-500 hover:to-blue-500 transition-transform duration-200 active:scale-[0.98] hover:shadow-lg"
                >
                  {isGenerating ? (
                    <>
                      <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Prompt
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={!userInput && !generatedPrompt}
                  className="transition-colors duration-200"
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="border-border/60 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40 transition-colors duration-300 hover:border-primary/40">
            <CardHeader>
              <CardTitle>Optimized Prompt</CardTitle>
              <CardDescription>
                Your enhanced prompt for Bolt.new
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="output">Generated Output</Label>
                <Textarea
                  id="output"
                  value={generatedPrompt}
                  onChange={(e) => setGeneratedPrompt(e.target.value)}
                  placeholder="Your optimized prompt will appear here..."
                  rows={16}
                  className="resize-none font-mono text-sm transition-colors duration-200 focus:ring-2 focus:ring-violet-500/40"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleCopy}
                  disabled={!generatedPrompt}
                  variant="secondary"
                  className="flex-1 transition-colors duration-200"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy to Clipboard
                </Button>
                
                <Button
                  onClick={handleEnhance}
                  disabled={!generatedPrompt}
                  variant="outline"
                  className="transition-colors duration-200"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Enhance
                </Button>
              </div>

              {generatedPrompt && (
                <div className="p-4 rounded-lg border border-border/60 bg-secondary/40 transition-colors duration-300">
                  <p className="text-sm text-muted-foreground">
                    💡 <strong>Tip:</strong> Copy this prompt and paste it directly into Bolt.new
                    to generate your application instantly!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Keyboard Shortcuts Hint */}
        {shortcutsEnabled && (
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              ⌨️ <strong>Keyboard Shortcuts:</strong> Ctrl+Enter to generate • Ctrl+K to focus input
            </p>
          </div>
        )}
      </motion.main>
    </div>
  );
}