import React, { createContext, useContext, useState, useEffect } from 'react';
import { t as translate, ui } from '../utils/bilingual';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  const direction = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('dir', direction);
    localStorage.setItem('language', language);
  }, [language, direction]);

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const setLanguage = (lang) => {
    if (lang === 'en' || lang === 'ar') {
      setLanguageState(lang);
    }
  };

  // Helper to translate object fields like product.titleEn / titleAr
  const t = (obj, field) => translate(obj, field, language);

  // Helper to get static UI strings like str('exploreCollection')
  const str = (key) => ui[language]?.[key] || ui.en[key] || key;

  return (
    <LanguageContext.Provider
      value={{
        language,
        direction,
        isRTL: direction === 'rtl',
        toggleLanguage,
        setLanguage,
        t,
        str,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
