"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { languages, getTranslation } from "./translations";

type LangContextType = {
  lang: string;
  setLang: (code: string) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
  supportedLanguages: typeof languages;
};

const LangContext = createContext<LangContextType>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
  dir: "ltr",
  supportedLanguages: languages,
});

export function useTranslation() {
  return useContext(LangContext);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved && languages.some((l) => l.code === saved)) setLangState(saved);
  }, []);

  const setLang = useCallback((code: string) => {
    setLangState(code);
    localStorage.setItem("lang", code);
    const dir = languages.find((l) => l.code === code)?.dir || "ltr";
    document.documentElement.dir = dir;
  }, []);

  useEffect(() => {
    const dir = languages.find((l) => l.code === lang)?.dir || "ltr";
    document.documentElement.dir = dir;
  }, [lang]);

  const t = useCallback((key: string) => getTranslation(lang, key), [lang]);

  const dir = languages.find((l) => l.code === lang)?.dir || "ltr";

  return (
    <LangContext.Provider value={{ lang: mounted ? lang : "en", setLang, t, dir, supportedLanguages: languages }}>
      {children}
    </LangContext.Provider>
  );
}
