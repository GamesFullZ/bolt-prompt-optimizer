import { GeneratedPrompt, PromptOptions } from "./promptOptimizer";

const STORAGE_KEYS = {
  PROMPTS: "bolt_prompts_history",
  FAVORITES: "bolt_prompts_favorites",
  SETTINGS: "bolt_prompts_settings",
};

export interface UserSettings {
  defaultStyle: string;
  defaultTone: string;
  defaultResponseType: string;
  defaultContext: string;
}

export const storageService = {
  // Prompt History
  savePrompt(prompt: GeneratedPrompt): void {
    try {
      const prompts = this.getPromptHistory();
      prompts.unshift(prompt);
      // Keep only last 50 prompts
      const limitedPrompts = prompts.slice(0, 50);
      localStorage.setItem(STORAGE_KEYS.PROMPTS, JSON.stringify(limitedPrompts));
    } catch (error) {
      console.error("Failed to save prompt:", error);
    }
  },

  getPromptHistory(): GeneratedPrompt[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROMPTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Failed to get prompt history:", error);
      return [];
    }
  },

  deletePrompt(id: string): void {
    try {
      const prompts = this.getPromptHistory();
      const filtered = prompts.filter((p) => p.id !== id);
      localStorage.setItem(STORAGE_KEYS.PROMPTS, JSON.stringify(filtered));
    } catch (error) {
      console.error("Failed to delete prompt:", error);
    }
  },

  clearHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.PROMPTS);
    } catch (error) {
      console.error("Failed to clear history:", error);
    }
  },

  // Favorites
  toggleFavorite(id: string): void {
    try {
      const prompts = this.getPromptHistory();
      const prompt = prompts.find((p) => p.id === id);
      
      if (prompt) {
        prompt.isFavorite = !prompt.isFavorite;
        localStorage.setItem(STORAGE_KEYS.PROMPTS, JSON.stringify(prompts));
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  },

  getFavorites(): GeneratedPrompt[] {
    try {
      const prompts = this.getPromptHistory();
      return prompts.filter((p) => p.isFavorite);
    } catch (error) {
      console.error("Failed to get favorites:", error);
      return [];
    }
  },

  // Settings
  saveSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  },

  getSettings(): UserSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data
        ? JSON.parse(data)
        : {
            defaultStyle: "Modern",
            defaultTone: "Professional",
            defaultResponseType: "Web Application",
            defaultContext: "General",
          };
    } catch (error) {
      console.error("Failed to get settings:", error);
      return {
        defaultStyle: "Modern",
        defaultTone: "Professional",
        defaultResponseType: "Web Application",
        defaultContext: "General",
      };
    }
  },

  // Export all prompts
  getAllPrompts(): GeneratedPrompt[] {
    return this.getPromptHistory();
  },
};