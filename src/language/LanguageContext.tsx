
import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';

// Define available languages and their properties
export type Language = 'pt-BR' | 'en-US' | 'es-ES' | 'fr-FR' | 'de-DE';

export type LanguageInfo = {
  code: Language;
  name: string;
  flag: string;
  country: string;
};

export const languages: LanguageInfo[] = [
  { code: 'pt-BR', name: 'Português', flag: '🇧🇷', country: 'Brasil' },
  { code: 'en-US', name: 'English', flag: '🇺🇸', country: 'United States' },
  { code: 'es-ES', name: 'Español', flag: '🇪🇸', country: 'España' },
  { code: 'fr-FR', name: 'Français', flag: '🇫🇷', country: 'France' },
  { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪', country: 'Deutschland' }
];

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  translate: (key: string) => string;
  languageInfo: LanguageInfo;
}

const DEFAULT_LANGUAGE: Language = 'en-US';

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  translate: () => '',
  languageInfo: languages[1] // English by default
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize with saved language or default
  const [currentLanguage, setCurrentLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('navmax-language') as Language;
    return savedLanguage || DEFAULT_LANGUAGE;
  });

  // Get language info object
  const languageInfo = languages.find(lang => lang.code === currentLanguage) || languages[1];

  // Set language and save to localStorage
  const setLanguage = (language: Language) => {
    setCurrentLanguageState(language);
    localStorage.setItem('navmax-language', language);
    console.log(`Language changed to ${language} at ${new Date().toLocaleString()}`);
  };

  // Translation function
  const translate = (key: string): string => {
    const languageData = translations[currentLanguage] || translations[DEFAULT_LANGUAGE];
    const keys = key.split('.');
    let result: any = languageData;
    
    for (const k of keys) {
      if (!result[k]) {
        // Fallback to English if key not found
        result = getFallbackTranslation(key);
        break;
      }
      result = result[k];
    }
    
    return typeof result === 'string' ? result : key;
  };

  // Fallback to English if translation not found
  const getFallbackTranslation = (key: string): string => {
    const keys = key.split('.');
    let result: any = translations[DEFAULT_LANGUAGE];
    
    for (const k of keys) {
      if (!result || !result[k]) return key;
      result = result[k];
    }
    
    return typeof result === 'string' ? result : key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, translate, languageInfo }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for language
export const useLanguage = () => useContext(LanguageContext);
