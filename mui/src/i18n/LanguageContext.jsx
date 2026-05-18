import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'cfoh-language';
const supportedLanguages = ['en', 'zh'];

const LanguageContext = createContext(null);

function getInitialLanguage() {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (supportedLanguages.includes(stored)) return stored;
  return window.navigator.language?.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage((current) => (current === 'zh' ? 'en' : 'zh'));
  }, []);

  const value = useMemo(
    () => ({
      language,
      isChinese: language === 'zh',
      pick: (english, chinese) => (language === 'zh' ? chinese : english),
      setLanguage,
      toggleLanguage,
    }),
    [language, toggleLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider.');
  return context;
}
