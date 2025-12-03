import { ModernLayout } from './components/ModernLayout';
import { useSyncSystem } from './hooks/useSyncSystem';
import { usePDFCompiler } from './hooks/usePDFCompiler';

function App() {
  useSyncSystem();
  usePDFCompiler();

  return <ModernLayout />;
}

export default App;
