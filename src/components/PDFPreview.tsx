import { useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useResumeStore } from '../store/resumeStore';
import { Loader2, ZoomIn, ZoomOut, Maximize2, RotateCcw, RefreshCw } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function PDFPreview() {
  const { pdfState, settings, setSettings, latexCode, triggerRecompile } = useResumeStore();
  const isDark = settings.theme === 'dark';

  // Keyboard shortcuts for zoom
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === '=' || e.key === '+') {
          e.preventDefault();
          handleZoomIn();
        } else if (e.key === '-') {
          e.preventDefault();
          handleZoomOut();
        } else if (e.key === '0') {
          e.preventDefault();
          handleResetZoom();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings.zoomLevel]);

  // Mouse wheel zoom (Ctrl + scroll)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();

        const delta = e.deltaY;
        const zoomChange = delta > 0 ? -10 : 10; // Scroll down = zoom out, scroll up = zoom in
        const newZoom = Math.max(25, Math.min(200, settings.zoomLevel + zoomChange));

        setSettings({ zoomLevel: newZoom });
      }
    };

    // Add listener with passive: false to allow preventDefault
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [settings.zoomLevel, setSettings]);

  // Pinch-to-zoom gesture support (trackpad/touchscreen)
  useEffect(() => {
    let initialDistance = 0;
    let initialZoom = settings.zoomLevel;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        initialDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        initialZoom = settings.zoomLevel;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();

        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );

        if (initialDistance > 0) {
          const scale = currentDistance / initialDistance;
          const newZoom = Math.max(25, Math.min(200, initialZoom * scale));
          setSettings({ zoomLevel: Math.round(newZoom) });
        }
      }
    };

    const handleTouchEnd = () => {
      initialDistance = 0;
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [settings.zoomLevel, setSettings]);

  useEffect(() => {
  }, [latexCode]);

  const handleZoomIn = () => {
    const newZoom = Math.min(settings.zoomLevel + 10, 200);
    setSettings({ zoomLevel: newZoom });
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(settings.zoomLevel - 10, 25);
    setSettings({ zoomLevel: newZoom });
  };

  const handleResetZoom = () => {
    setSettings({ zoomLevel: 100 });
  };

  const handleFitToWidth = () => {
    setSettings({ zoomLevel: 125 });
  };

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
    <div className={`h-full flex flex-col ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Zoom Controls */}
      <div className={`flex items-center justify-center gap-2 p-4 border-b ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
        <button
          onClick={handleZoomOut}
          disabled={settings.zoomLevel <= 25}
          className={`p-2 rounded-lg transition-all ${settings.zoomLevel <= 25
            ? 'opacity-50 cursor-not-allowed'
            : isDark
              ? 'hover:bg-gray-700 text-gray-300'
              : 'hover:bg-gray-100 text-gray-700'
            }`}
          title="Zoom Out (Ctrl + -)"
        >
          <ZoomOut className="h-5 w-5" />
        </button>

        <button
          onClick={handleResetZoom}
          className={`px-3 py-2 rounded-lg font-mono text-sm transition-all ${isDark
            ? 'hover:bg-gray-700 text-gray-300'
            : 'hover:bg-gray-100 text-gray-700'
            }`}
          title="Reset Zoom (Ctrl + 0) | Pinch to zoom on trackpad | Ctrl + Scroll wheel"
        >
          {settings.zoomLevel}%
        </button>

        <button
          onClick={handleZoomIn}
          disabled={settings.zoomLevel >= 200}
          className={`p-2 rounded-lg transition-all ${settings.zoomLevel >= 200
            ? 'opacity-50 cursor-not-allowed'
            : isDark
              ? 'hover:bg-gray-700 text-gray-300'
              : 'hover:bg-gray-100 text-gray-700'
            }`}
          title="Zoom In (Ctrl + +)"
        >
          <ZoomIn className="h-5 w-5" />
        </button>

        <div className={`w-px h-6 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />

        <button
          onClick={handleFitToWidth}
          className={`p-2 rounded-lg transition-all ${isDark
            ? 'hover:bg-gray-700 text-gray-300'
            : 'hover:bg-gray-100 text-gray-700'
            }`}
          title="Fit to Width"
        >
          <Maximize2 className="h-5 w-5" />
        </button>

        <button
          onClick={handleResetZoom}
          className={`p-2 rounded-lg transition-all ${isDark
            ? 'hover:bg-gray-700 text-gray-300'
            : 'hover:bg-gray-100 text-gray-700'
            }`}
          title="Reset View"
        >
          <RotateCcw className="h-5 w-5" />
        </button>

        <button
          onClick={triggerRecompile}
          className={`p-2 rounded-lg transition-all ${isDark
            ? 'hover:bg-gray-700 text-gray-300'
            : 'hover:bg-gray-100 text-gray-700'
            }`}
          title="Recompile PDF"
        >
          <RefreshCw className="h-5 w-5" />
        </button>

        {pdfState.compilationTime && (
          <>
            <div className={`w-px h-6 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              ✅ Compiled in {pdfState.compilationTime}ms
            </div>
          </>
        )}
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-auto p-8">
        <div className="flex flex-col items-center">
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
              className="shadow-lg transition-transform duration-200"
            />
          </Document>
        </div>
      </div>
    </div>
  );
}
