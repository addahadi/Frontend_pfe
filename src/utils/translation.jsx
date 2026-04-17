import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: 'ar', // اللغة الافتراضية
  resources: {
    ar: { translation: { welcome: "مرحباً بك في الجامعة", start: "ابدأ الآن" } },
    fr: { translation: { welcome: "Bienvenue à l'université", start: "Commencer" } }
  },
  interpolation: { escapeValue: false }
});

export default i18n;