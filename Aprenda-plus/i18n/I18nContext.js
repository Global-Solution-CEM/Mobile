import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import pt from './translations/pt';
import en from './translations/en';
import es from './translations/es';

const I18nContext = createContext({});

const LANGUAGE_KEY = '@aprenda_plus:language';

const translations = {
  pt,
  en,
  es,
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n deve ser usado dentro de I18nProvider');
  }
  return context;
};

export const I18nProvider = ({ children }) => {
  const [language, setLanguage] = useState('pt');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (savedLanguage && translations[savedLanguage]) {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Erro ao carregar idioma:', error);
    } finally {
      setLoading(false);
    }
  };

  const changeLanguage = async (newLanguage) => {
    try {
      if (translations[newLanguage]) {
        await AsyncStorage.setItem(LANGUAGE_KEY, newLanguage);
        setLanguage(newLanguage);
      }
    } catch (error) {
      console.error('Erro ao salvar idioma:', error);
    }
  };

  const t = (key) => {
    return translations[language]?.[key] || key;
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        changeLanguage,
        t,
        loading,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

