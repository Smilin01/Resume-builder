import Editor from '@monaco-editor/react';
import { useResumeStore } from '../store/resumeStore';

export function CodeEditor() {
  const { latexCode, setLatexCode, settings } = useResumeStore();

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setLatexCode(value, 'code');
    }
  };

  return (
    <div className="h-full">
      <Editor
        height="100%"
        defaultLanguage="latex"
        value={latexCode}
        onChange={handleEditorChange}
        theme={settings.theme === 'dark' ? 'vs-dark' : 'light'}
        options={{
          fontSize: settings.fontSize,
          minimap: { enabled: true },
          lineNumbers: 'on',
          wordWrap: 'on',
          automaticLayout: true,
          scrollBeyondLastLine: false,
          folding: true,
          bracketPairColorization: { enabled: true },
          tabSize: 2,
        }}
      />
    </div>
  );
}
