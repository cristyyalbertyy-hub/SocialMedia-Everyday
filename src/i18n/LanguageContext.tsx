import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '../types';
import { t } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  strings: ReturnType<typeof t>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANG_KEY = '@sme_language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('pt');

  useEffect(() => {
    AsyncStorage.getItem(LANG_KEY).then((stored) => {
      if (stored === 'pt' || stored === 'en') {
        setLanguageState(stored);
      }
    });
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    AsyncStorage.setItem(LANG_KEY, lang);
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, strings: t(language) }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
