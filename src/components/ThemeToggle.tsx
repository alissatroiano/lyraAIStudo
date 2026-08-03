import React from "react";
import { Moon, Sun } from "lucide-react";
import { NocturneTheme } from "../hooks/useNocturneTheme";

interface ThemeToggleProps {
  theme: NocturneTheme;
  onToggle: () => void;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle, className = "" }) => (
  <button
    type="button"
    onClick={onToggle}
    title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    className={`w-9 h-9 shrink-0 rounded-lg border border-noct-border/60 bg-transparent text-noct-text flex items-center justify-center hover:bg-noct-accent/10 transition-colors cursor-pointer ${className}`}
  >
    {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
  </button>
);
