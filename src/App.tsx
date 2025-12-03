import { Layout } from './components/Layout';
import { VisualEditor } from './components/VisualEditor';
import { CodeEditor } from './components/CodeEditor';
import { PDFPreview } from './components/PDFPreview';
import { TemplateSelector } from './components/TemplateSelector';
import { useResumeStore } from './store/resumeStore';
import { useSyncSystem } from './hooks/useSyncSystem';
import { usePDFCompiler } from './hooks/usePDFCompiler';

function App() {
  const { currentTab } = useResumeStore();
  useSyncSystem();
  usePDFCompiler();

  return (
    <Layout>
      {currentTab === 'templates' && <TemplateSelector />}
      {currentTab === 'visual' && <VisualEditor />}
      {currentTab === 'code' && <CodeEditor />}
      {currentTab === 'preview' && <PDFPreview />}
    </Layout>
  );
}

export default App;
