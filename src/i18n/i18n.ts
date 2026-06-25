import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

// Curated namespaces (POC Step 14) + a representative legacy namespace
// from the XML conversion (Step 31). Additional legacy/<section>
// namespaces are loaded on demand by feature code via t('key', { ns: '...' }).
const ns = ['common', 'searchAPL', 'legacy/login-page'];

void i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'es', 'ru', 'tr', 'vi'],
    defaultNS: 'common',
    ns,
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

export default i18n;
