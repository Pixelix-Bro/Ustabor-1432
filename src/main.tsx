import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import App from '@/App';
import '@/styles/global.css';

const ModelLab = lazy(() => import('@/lab/ModelLab'));
const params = new URLSearchParams(window.location.search);
const isLab = import.meta.env.DEV && params.has('lab');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      {isLab ? (
        <Suspense fallback={null}>
          <ModelLab />
        </Suspense>
      ) : (
        <App />
      )}
    </LanguageProvider>
  </StrictMode>,
);
