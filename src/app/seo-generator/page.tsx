"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Download, 
  Copy, 
  Sparkles, 
  Youtube, 
  Globe, 
  BarChart3,
  FileText,
  Hash,
  Link as LinkIcon,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  generateSEOContent,
  generateContentVariations,
  exportAsJSON,
  analyzeKeywordDensity,
  type SEOContent,
} from "@/lib/seoContentGenerator";

export default function SEOGeneratorPage() {
  const [targetKeyword, setTargetKeyword] = useState("");
  const [topic, setTopic] = useState("");
  const [focus, setFocus] = useState("");
  const [contentType, setContentType] = useState<"article" | "tutorial" | "guide">("guide");
  const [generatedContent, setGeneratedContent] = useState<SEOContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleGenerate = () => {
    if (!targetKeyword.trim() || !topic.trim() || !focus.trim()) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    setIsGenerating(true);

    // Simulate processing
    setTimeout(() => {
      const content = generateSEOContent({
        targetKeyword,
        topic,
        focus,
        contentType,
      });

      setGeneratedContent(content);
      setIsGenerating(false);
      toast.success("¡Contenido SEO generado exitosamente!");
      setActiveTab("overview");
    }, 1000);
  };

  const handleGenerateVariations = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const variations = generateContentVariations();
      const json = exportAsJSON(variations);

      // Download variations as JSON
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `seo-variations-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsGenerating(false);
      toast.success("4 variaciones generadas y descargadas");
    }, 1200);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado al portapapeles`);
  };

  const handleDownloadJSON = () => {
    if (!generatedContent) return;

    const json = exportAsJSON(generatedContent);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `seo-content-${generatedContent.url}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Contenido exportado como JSON");
  };

  const getKeywordDensity = () => {
    if (!generatedContent) return 0;

    const fullText = [
      generatedContent.content.introduction,
      ...generatedContent.content.sections.flatMap(s => s.paragraphs),
      generatedContent.content.conclusion,
    ].join(" ");

    return analyzeKeywordDensity(fullText, targetKeyword);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Toaster />

      {isGenerating && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/60 backdrop-blur-sm">
          <div className="relative">
            <ul className="relative h-28 w-28">
              <li className="absolute left-1/2 top-1/2 -ml-10 -mt-10 h-20 w-20 rounded-full border-[5px] border-background border-t-violet-500/90 animate-spin [animation-duration:3s]" />
              <li className="absolute left-1/2 top-1/2 -ml-7 -mt-7 h-14 w-14 rounded-full border-[5px] border-background border-t-fuchsia-500/90 animate-spin [animation-duration:2s]" />
              <li className="absolute left-1/2 top-1/2 -ml-4 -mt-4 h-8 w-8 rounded-full border-[5px] border-background border-t-cyan-400/90 animate-spin [animation-duration:1.2s]" />
            </ul>
            <span className="sr-only">Generando contenido SEO...</span>
          </div>
        </div>
      )}

      <motion.main
        className="container relative mx-auto px-4 py-10 max-w-7xl"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Search className="h-3 w-3" />
            SEO Optimizado • YouTube Ready • Google Ranking
          </div>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
              Generador de Contenido SEO
            </span>
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Crea contenido optimizado para Google y YouTube con uso natural de keywords.
            Incluye títulos, meta descripciones, headings, tags y más.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <Card className="lg:col-span-1 border-border/60 bg-background/60 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-violet-500" />
                Configuración
              </CardTitle>
              <CardDescription>
                Define tu keyword objetivo y contexto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="keyword">Palabra Clave Objetivo*</Label>
                <Input
                  id="keyword"
                  placeholder="ej: prompt enhancer"
                  value={targetKeyword}
                  onChange={(e) => setTargetKeyword(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  La keyword principal para SEO
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic">Tema / Topic*</Label>
                <Input
                  id="topic"
                  placeholder="ej: optimización de prompts"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="focus">Enfoque / Focus*</Label>
                <Input
                  id="focus"
                  placeholder="ej: mejorar tus prompts automáticamente"
                  value={focus}
                  onChange={(e) => setFocus(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contentType">Tipo de Contenido</Label>
                <Select
                  value={contentType}
                  onValueChange={(value: any) => setContentType(value)}
                >
                  <SelectTrigger id="contentType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="guide">Guía</SelectItem>
                    <SelectItem value="tutorial">Tutorial</SelectItem>
                    <SelectItem value="article">Artículo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 space-y-2">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !targetKeyword || !topic || !focus}
                  className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generar Contenido SEO
                </Button>

                <Button
                  onClick={handleGenerateVariations}
                  disabled={isGenerating}
                  variant="outline"
                  className="w-full"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Generar 4 Variaciones
                </Button>
              </div>

              {generatedContent && (
                <Button
                  onClick={handleDownloadJSON}
                  variant="secondary"
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exportar JSON
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="lg:col-span-2 border-border/60 bg-background/60 backdrop-blur">
            <CardHeader>
              <CardTitle>Contenido Generado</CardTitle>
              <CardDescription>
                {generatedContent
                  ? "Contenido optimizado para SEO listo para usar"
                  : "Completa el formulario y genera contenido SEO"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!generatedContent ? (
                <div className="py-12 text-center text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Genera contenido para ver los resultados aquí</p>
                </div>
              ) : (
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview" className="text-xs">
                      <Globe className="h-3 w-3 mr-1" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="youtube" className="text-xs">
                      <Youtube className="h-3 w-3 mr-1" />
                      YouTube
                    </TabsTrigger>
                    <TabsTrigger value="content" className="text-xs">
                      <FileText className="h-3 w-3 mr-1" />
                      Contenido
                    </TabsTrigger>
                    <TabsTrigger value="tags" className="text-xs">
                      <Hash className="h-3 w-3 mr-1" />
                      Tags
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="text-xs">
                      <BarChart3 className="h-3 w-3 mr-1" />
                      Analytics
                    </TabsTrigger>
                  </TabsList>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold">Título SEO</Label>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopy(generatedContent.title, "Título")}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="p-3 bg-secondary/50 rounded-lg text-sm">
                        {generatedContent.title}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold flex items-center gap-2">
                          <LinkIcon className="h-3 w-3" />
                          URL Amigable
                        </Label>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopy(generatedContent.url, "URL")}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="p-3 bg-secondary/50 rounded-lg text-sm font-mono">
                        /{generatedContent.url}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold">Meta Description</Label>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleCopy(generatedContent.meta_description, "Meta description")
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="p-3 bg-secondary/50 rounded-lg text-sm">
                        {generatedContent.meta_description}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Longitud: {generatedContent.meta_description.length} caracteres
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Estructura de Headings</Label>
                      <div className="p-3 bg-secondary/50 rounded-lg space-y-2 max-h-64 overflow-y-auto">
                        {generatedContent.headings.h2.map((h2, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="text-sm font-semibold text-violet-600 dark:text-violet-400">
                              H2: {h2}
                            </div>
                            {generatedContent.headings.h3[h2]?.map((h3, h3Idx) => (
                              <div
                                key={h3Idx}
                                className="text-xs text-muted-foreground pl-4"
                              >
                                H3: {h3}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  {/* YouTube Tab */}
                  <TabsContent value="youtube" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold flex items-center gap-2">
                          <Youtube className="h-4 w-4 text-red-500" />
                          Descripción para YouTube
                        </Label>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleCopy(
                              generatedContent.youtube_description || "",
                              "Descripción YouTube"
                            )
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="p-4 bg-secondary/50 rounded-lg text-sm whitespace-pre-wrap font-mono max-h-96 overflow-y-auto">
                        {generatedContent.youtube_description}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Tags de YouTube</Label>
                      <div className="flex flex-wrap gap-2">
                        {generatedContent.tags.youtube.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-red-500/10 text-red-600 dark:text-red-400 rounded-md text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full mt-2"
                        onClick={() =>
                          handleCopy(
                            generatedContent.tags.youtube.join(", "),
                            "Tags YouTube"
                          )
                        }
                      >
                        Copiar Todos los Tags
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Content Tab */}
                  <TabsContent value="content" className="space-y-4 mt-4">
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">Introducción</Label>
                        <div className="p-3 bg-secondary/50 rounded-lg text-sm">
                          {generatedContent.content.introduction}
                        </div>
                      </div>

                      {generatedContent.content.sections.map((section, idx) => (
                        <div key={idx} className="space-y-2">
                          <Label className="text-sm font-semibold text-violet-600 dark:text-violet-400">
                            {section.heading}
                          </Label>
                          <div className="p-3 bg-secondary/50 rounded-lg text-sm space-y-3">
                            {section.paragraphs.map((p, pIdx) => (
                              <p key={pIdx}>{p}</p>
                            ))}
                            {section.list && (
                              <ul className="space-y-1 pl-4">
                                {section.list.map((item, lIdx) => (
                                  <li key={lIdx} className="text-sm">
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      ))}

                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">Conclusión</Label>
                        <div className="p-3 bg-secondary/50 rounded-lg text-sm">
                          {generatedContent.content.conclusion}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Tags Tab */}
                  <TabsContent value="tags" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Meta Tags Web</Label>
                      <div className="flex flex-wrap gap-2">
                        {generatedContent.tags.web_meta.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-md text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full mt-2"
                        onClick={() =>
                          handleCopy(
                            generatedContent.tags.web_meta.join(", "),
                            "Meta tags"
                          )
                        }
                      >
                        Copiar Meta Tags
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Schema.org JSON-LD</Label>
                      <div className="p-3 bg-secondary/50 rounded-lg text-xs font-mono max-h-64 overflow-y-auto">
                        <pre>{JSON.stringify(generatedContent.schema_org, null, 2)}</pre>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() =>
                          handleCopy(
                            JSON.stringify(generatedContent.schema_org, null, 2),
                            "Schema.org"
                          )
                        }
                      >
                        Copiar JSON-LD
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Analytics Tab */}
                  <TabsContent value="analytics" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="border-border/60">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Densidad Keyword</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-violet-600">
                            {getKeywordDensity()}%
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Óptimo: 1-3%
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="border-border/60">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Total Headings</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-blue-600">
                            {generatedContent.headings.h2.length}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            H2 sections
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="border-border/60">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Meta Tags</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-green-600">
                            {generatedContent.tags.web_meta.length}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Para web
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="border-border/60">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">YouTube Tags</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-red-600">
                            {generatedContent.tags.youtube.length}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Para videos
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="border-border/60">
                      <CardHeader>
                        <CardTitle className="text-sm">Recomendaciones SEO</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <div>
                            <strong>Keywords naturales:</strong> Las palabras clave están integradas de forma natural en el contenido
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <div>
                            <strong>Estructura óptima:</strong> Headings H2/H3 bien organizados para SEO
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <div>
                            <strong>Meta description:</strong> Longitud óptima (150-160 caracteres)
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <div>
                            <strong>URL amigable:</strong> Incluye keyword principal y es fácil de leer
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <div>
                            <strong>Rich snippets:</strong> Schema.org incluido para mejor visibilidad
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Footer */}
        <Card className="mt-6 border-border/60 bg-gradient-to-br from-violet-500/5 to-blue-500/5">
          <CardHeader>
            <CardTitle className="text-lg">💡 Cómo Usar Este Generador</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <strong>1. Define tu keyword:</strong> Elige la palabra clave principal que quieres posicionar (ej: "prompt enhancer", "Bolt.new", "optimizar prompts").
            </div>
            <div>
              <strong>2. Especifica el contexto:</strong> Añade el tema y enfoque para generar contenido relevante y natural.
            </div>
            <div>
              <strong>3. Genera variaciones:</strong> Usa el botón "Generar 4 Variaciones" para crear múltiples piezas de contenido con diferentes keywords (prompt enhancer, Bolt.new, optimizar prompts, ejemplos de prompts IA).
            </div>
            <div>
              <strong>4. Exporta y usa:</strong> Descarga el JSON con todo el contenido listo para implementar en tu web o YouTube.
            </div>
            <div className="pt-2 text-xs text-muted-foreground">
              📊 <strong>Keywords base:</strong> prompt, prompt enhancer, Bolt.new | 
              🎯 <strong>Long-tail incluidas:</strong> "optimizar prompts", "mejorar prompts Bolt.new", "ejemplos de prompts IA"
            </div>
          </CardContent>
        </Card>
      </motion.main>
    </div>
  );
}