import { useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useResumeStore } from '../store/resumeStore';
import { Loader2 } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function PDFPreview() {
  const { pdfState, settings, latexCode } = useResumeStore();
  const isDark = settings.theme === 'dark';

  useEffect(() => {
  }, [latexCode]);

  if (pdfState.isCompiling) {
    return (
      <div className={`h-full flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="text-center">
          <Loader2 className={`h-12 w-12 animate-spin mx-auto mb-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Compiling PDF...</p>
        </div>
      </div>
    );
  }

  if (pdfState.errors.length > 0) {
    return (
      <div className={`h-full flex items-center justify-center p-8 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className={`max-w-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
          <h3 className="text-xl font-bold text-red-600 mb-4">Compilation Errors</h3>
          <div className="space-y-2">
            {pdfState.errors.map((error, index) => (
              <div key={index} className={`p-3 rounded ${isDark ? 'bg-gray-700' : 'bg-red-50'}`}>
                <p className="text-sm">
                  <span className="font-mono text-red-600">Line {error.line}:</span>
                  <span className={`ml-2 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>{error.message}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!pdfState.url) {
    return (
      <div className={`h-full flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="text-center">
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Start editing your resume to see a preview
          </p>
          <p className={`text-sm mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            PDF compilation will happen automatically
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full overflow-auto ${isDark ? 'bg-gray-900' : 'bg-gray-100'} p-8`}>
      <div className="flex justify-center">
        <Document
          file={pdfState.url}
          loading={
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            </div>
          }
          error={
            <div className={`p-4 rounded ${isDark ? 'bg-gray-800 text-red-400' : 'bg-red-50 text-red-600'}`}>
              <p>Failed to load PDF</p>
            </div>
          }
        >
          <Page
            pageNumber={1}
            scale={(settings.zoomLevel / 100) * 1.5}
            devicePixelRatio={window.devicePixelRatio || 2}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            renderMode="canvas"
          />
        </Document>
      </div>
    </div>
  );
}
