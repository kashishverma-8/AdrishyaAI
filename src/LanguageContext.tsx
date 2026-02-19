// LanguageContext.tsx - New file (create this file)
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: "en" | "hi";
  setLanguage: (lang: "en" | "hi") => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<"en" | "hi">("en");

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
