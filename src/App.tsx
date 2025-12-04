import { useState } from 'react';
import { ModernLayout } from './components/ModernLayout';
import { LandingPage } from './components/LandingPage';
import { useSyncSystem } from './hooks/useSyncSystem';
import { usePDFCompiler } from './hooks/usePDFCompiler';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [initialView, setInitialView] = useState<'editor' | 'templates'>('editor');
  useSyncSystem();
  usePDFCompiler();

  if (showLanding) {
    return <LandingPage onStart={(view = 'editor') => {
      setInitialView(view);
      setShowLanding(false);
    }} />;
  }

  return <ModernLayout initialView={initialView} />;
}

export default App;
