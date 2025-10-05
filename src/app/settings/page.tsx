"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, HelpCircle, BookOpen, Lightbulb, Sliders } from "lucide-react";
import { storageService, type UserSettings } from "@/lib/storage";
import Navigation from "@/components/Navigation";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    defaultStyle: "Modern",
    defaultTone: "Professional",
    defaultResponseType: "Web Application",
    defaultContext: "General",
  });

  const [advancedSettings, setAdvancedSettings] = useState({
    autoSaveToHistory: true,
    showWelcomeModal: false,
    enhancePromptAutomatically: false,
    enableKeyboardShortcuts: true,
  });

  useEffect(() => {
    const savedSettings = storageService.getSettings();
    setSettings(savedSettings);
    
    // Load advanced settings from localStorage
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    const autoSave = localStorage.getItem("autoSaveToHistory");
    const autoEnhance = localStorage.getItem("enhancePromptAutomatically");
    const enableShortcuts = localStorage.getItem("enableKeyboardShortcuts");
    
    setAdvancedSettings({
      autoSaveToHistory: autoSave !== "false",
      showWelcomeModal: hasSeenWelcome !== "true",
      enhancePromptAutomatically: autoEnhance === "true",
      enableKeyboardShortcuts: enableShortcuts !== "false",
    });
  }, []);

  const handleSaveSettings = () => {
    storageService.saveSettings(settings);
    
    // Save advanced settings
    localStorage.setItem("autoSaveToHistory", String(advancedSettings.autoSaveToHistory));
    if (advancedSettings.showWelcomeModal) {
      localStorage.removeItem("hasSeenWelcome");
    } else {
      localStorage.setItem("hasSeenWelcome", "true");
    }
    localStorage.setItem("enhancePromptAutomatically", String(advancedSettings.enhancePromptAutomatically));
    localStorage.setItem("enableKeyboardShortcuts", String(advancedSettings.enableKeyboardShortcuts));
    
    toast.success("Settings saved successfully!");
  };

  const handleResetDefaults = () => {
    const defaultSettings: UserSettings = {
      defaultStyle: "Modern",
      defaultTone: "Professional",
      defaultResponseType: "Web Application",
      defaultContext: "General",
    };
    setSettings(defaultSettings);
    storageService.saveSettings(defaultSettings);
    
    // Reset advanced settings
    setAdvancedSettings({
      autoSaveToHistory: true,
      showWelcomeModal: false,
      enhancePromptAutomatically: false,
      enableKeyboardShortcuts: true,
    });
    
    localStorage.setItem("autoSaveToHistory", "true");
    localStorage.setItem("hasSeenWelcome", "true");
    localStorage.setItem("enhancePromptAutomatically", "false");
    localStorage.setItem("enableKeyboardShortcuts", "true");
    
    toast.success("Settings reset to defaults");
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all prompt history? This action cannot be undone.")) {
      localStorage.removeItem("promptHistory");
      toast.success("History cleared successfully");
    }
  };

  const handleExportData = () => {
    const prompts = storageService.getAllPrompts();
    const dataStr = JSON.stringify(prompts, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `prompt-studio-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported successfully");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Toaster />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Settings & Help</h1>
          <p className="text-muted-foreground">
            Configure your preferences and learn how to use the app
          </p>
        </div>

        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="settings">
              <Sliders className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="help">
              <HelpCircle className="mr-2 h-4 w-4" />
              Help & Guide
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Default Preferences</CardTitle>
                <CardDescription>
                  Set your default options for prompt generation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="defaultStyle">Default Style</Label>
                    <Select
                      value={settings.defaultStyle}
                      onValueChange={(value) =>
                        setSettings({ ...settings, defaultStyle: value })
                      }
                    >
                      <SelectTrigger id="defaultStyle">
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
                    <Label htmlFor="defaultTone">Default Tone</Label>
                    <Select
                      value={settings.defaultTone}
                      onValueChange={(value) =>
                        setSettings({ ...settings, defaultTone: value })
                      }
                    >
                      <SelectTrigger id="defaultTone">
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
                    <Label htmlFor="defaultType">Default Type</Label>
                    <Select
                      value={settings.defaultResponseType}
                      onValueChange={(value) =>
                        setSettings({ ...settings, defaultResponseType: value })
                      }
                    >
                      <SelectTrigger id="defaultType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Web Application">
                          Web Application
                        </SelectItem>
                        <SelectItem value="Component">Component</SelectItem>
                        <SelectItem value="Landing Page">Landing Page</SelectItem>
                        <SelectItem value="Dashboard">Dashboard</SelectItem>
                        <SelectItem value="E-commerce">E-commerce</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="defaultContext">Default Context</Label>
                    <Select
                      value={settings.defaultContext}
                      onValueChange={(value) =>
                        setSettings({ ...settings, defaultContext: value })
                      }
                    >
                      <SelectTrigger id="defaultContext">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="Educational">Educational</SelectItem>
                        <SelectItem value="Personal">Personal</SelectItem>
                        <SelectItem value="Entertainment">
                          Entertainment
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Experience</CardTitle>
                <CardDescription>
                  Customize your workflow and app behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoSave">Auto-save to History</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically save generated prompts to your history
                    </p>
                  </div>
                  <Switch
                    id="autoSave"
                    checked={advancedSettings.autoSaveToHistory}
                    onCheckedChange={(checked) =>
                      setAdvancedSettings({ ...advancedSettings, autoSaveToHistory: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="welcomeModal">Show Welcome Modal</Label>
                    <p className="text-sm text-muted-foreground">
                      Display welcome message on next visit
                    </p>
                  </div>
                  <Switch
                    id="welcomeModal"
                    checked={advancedSettings.showWelcomeModal}
                    onCheckedChange={(checked) =>
                      setAdvancedSettings({ ...advancedSettings, showWelcomeModal: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoEnhance">Auto-enhance Prompts</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically apply enhancement to generated prompts
                    </p>
                  </div>
                  <Switch
                    id="autoEnhance"
                    checked={advancedSettings.enhancePromptAutomatically}
                    onCheckedChange={(checked) =>
                      setAdvancedSettings({ ...advancedSettings, enhancePromptAutomatically: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="shortcuts">Keyboard Shortcuts</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable keyboard shortcuts (Ctrl+Enter to generate)
                    </p>
                  </div>
                  <Switch
                    id="shortcuts"
                    checked={advancedSettings.enableKeyboardShortcuts}
                    onCheckedChange={(checked) =>
                      setAdvancedSettings({ ...advancedSettings, enableKeyboardShortcuts: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>
                  Manage your stored prompts and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  onClick={handleExportData}
                  className="w-full"
                >
                  Export All Prompts
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleClearHistory}
                  className="w-full"
                >
                  Clear All History
                </Button>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button onClick={handleSaveSettings} className="flex-1">
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
              <Button
                variant="outline"
                onClick={handleResetDefaults}
                className="flex-1"
              >
                Reset to Defaults
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="help">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Getting Started
                  </CardTitle>
                  <CardDescription>
                    Learn how to use the Bolt Prompt Generator
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">
                        1. Enter Your Idea
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        On the Dashboard, type your application idea or concept
                        into the input field. It can be as simple or detailed as
                        you like.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">
                        2. Configure Options
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Select your preferred style, tone, response type, and
                        context to tailor the prompt to your needs.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">
                        3. Generate Prompt
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Click "Generate Prompt" to create an optimized prompt
                        suitable for Bolt.new with all technical details and
                        requirements.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">4. Use Your Prompt</h3>
                      <p className="text-sm text-muted-foreground">
                        Copy the generated prompt and paste it into Bolt.new to
                        instantly create your application!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Tips & Best Practices
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        How to write effective input?
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                          <li>Be specific about key features you want</li>
                          <li>
                            Mention any specific technologies or frameworks
                          </li>
                          <li>Include user experience requirements</li>
                          <li>
                            Describe the target audience or use case
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                      <AccordionTrigger>
                        What do the style options mean?
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                          <li>
                            <strong>Modern:</strong> Clean, minimalist design
                            with contemporary aesthetics
                          </li>
                          <li>
                            <strong>Professional:</strong> Business-appropriate
                            with focus on clarity
                          </li>
                          <li>
                            <strong>Creative:</strong> Bold, unique designs with
                            experimental features
                          </li>
                          <li>
                            <strong>Minimal:</strong> Stripped-down, essential
                            elements only
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                      <AccordionTrigger>
                        How does the Enhancement feature work?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground mb-2">
                          The Enhancement feature adds additional technical
                          specifications, best practices, and accessibility
                          guidelines to your existing prompt.
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Use it when you want to add more detail to an already
                          generated prompt without starting over.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                      <AccordionTrigger>
                        How to manage my prompts?
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                          <li>
                            All generated prompts are automatically saved to
                            History
                          </li>
                          <li>
                            Use the search feature in History to find specific
                            prompts
                          </li>
                          <li>
                            Delete individual prompts or clear all history in Settings
                          </li>
                          <li>
                            Export your prompts as JSON for backup
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                      <AccordionTrigger>
                        Is my data stored on servers?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground">
                          No, all your prompts and settings are stored locally in
                          your browser using localStorage. Your data never leaves
                          your device, ensuring complete privacy. This also means
                          the app works offline once loaded!
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Example Prompts</CardTitle>
                  <CardDescription>
                    Get inspired by these example inputs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-sm font-mono">
                        "A task management app with kanban board, real-time
                        collaboration, and deadline tracking"
                      </p>
                    </div>
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-sm font-mono">
                        "Portfolio website for photographers with gallery, client
                        testimonials, and booking form"
                      </p>
                    </div>
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-sm font-mono">
                        "E-learning platform with video courses, progress
                        tracking, and interactive quizzes"
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}