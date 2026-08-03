import { useCallback, useEffect, useState } from "react";

export type NocturneTheme = "light" | "dark";

const STORAGE_KEY = "snori_nocturne_theme";

function readStoredTheme(fallback: NocturneTheme): NocturneTheme {
  if (typeof window === "undefined") return fallback;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : fallback;
}

// Shared light/dark preference for the Nocturne-redesigned screens
// (Landing, Interactive Slideshow, Video Studio). Persists across visits.
export function useNocturneTheme(defaultTheme: NocturneTheme = "light") {
  const [theme, setTheme] = useState<NocturneTheme>(() => readStoredTheme(defaultTheme));

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // localStorage unavailable (e.g. private browsing) - ignore
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return { theme, toggleTheme };
}
