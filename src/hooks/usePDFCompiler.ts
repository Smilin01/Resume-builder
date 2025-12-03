import { useEffect, useRef } from 'react';
import { useResumeStore } from '../store/resumeStore';
import CryptoJS from 'crypto-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export function usePDFCompiler() {
  const { latexCode, pdfState, setPdfState } = useResumeStore();
  const compileTimer = useRef<NodeJS.Timeout>();
  const lastCompiledHash = useRef<string>('');

  useEffect(() => {
    if (!latexCode.trim()) {
      return;
    }

    const currentHash = CryptoJS.SHA256(latexCode).toString();

    if (currentHash === lastCompiledHash.current) {
      return;
    }

    if (compileTimer.current) {
      clearTimeout(compileTimer.current);
    }

    compileTimer.current = setTimeout(async () => {
      await compilePDF(latexCode, currentHash);
    }, 2000);

    return () => {
      if (compileTimer.current) {
        clearTimeout(compileTimer.current);
      }
    };
  }, [latexCode, setPdfState]);

  const compilePDF = async (latex: string, hash: string) => {
    try {
      setPdfState({ isCompiling: true, errors: [] });

      const response = await fetch(`${SUPABASE_URL}/functions/v1/compile-latex`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ latex }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setPdfState({
          isCompiling: false,
          errors: errorData.errors || [{ line: 0, message: 'Compilation failed' }],
        });
        return;
      }

      const contentType = response.headers.get('Content-Type');

      if (contentType?.includes('application/pdf')) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        if (pdfState.url) {
          URL.revokeObjectURL(pdfState.url);
        }

        setPdfState({
          url,
          isCompiling: false,
          errors: [],
        });

        lastCompiledHash.current = hash;
      } else {
        const errorData = await response.json();
        setPdfState({
          isCompiling: false,
          errors: errorData.errors || [{ line: 0, message: 'Unexpected response format' }],
        });
      }
    } catch (error) {
      console.error('PDF compilation error:', error);
      setPdfState({
        isCompiling: false,
        errors: [{ line: 0, message: error instanceof Error ? error.message : 'Compilation failed' }],
      });
    }
  };
}
