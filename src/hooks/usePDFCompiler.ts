import { useEffect, useRef } from 'react';
import { useResumeStore } from '../store/resumeStore';
import CryptoJS from 'crypto-js';

// YtoTech LaTeX-on-HTTP API endpoint
const LATEX_API_URL = 'https://latex.ytotech.com/builds/sync';

export function usePDFCompiler() {
  const { latexCode, pdfState, setPdfState, recompileTrigger } = useResumeStore();
  const compileTimer = useRef<NodeJS.Timeout>();
  const lastCompiledHash = useRef<string>('');
  const lastTriggerRef = useRef(recompileTrigger);

  useEffect(() => {
    if (!latexCode.trim()) {
      return;
    }

    const currentHash = CryptoJS.SHA256(latexCode).toString();
    const isManualTrigger = recompileTrigger !== lastTriggerRef.current;

    if (currentHash === lastCompiledHash.current && !isManualTrigger) {
      return;
    }

    lastTriggerRef.current = recompileTrigger;

    if (compileTimer.current) {
      clearTimeout(compileTimer.current);
    }

    // If manual trigger, compile immediately (or with very short delay)
    const delay = isManualTrigger ? 100 : 2000;

    compileTimer.current = setTimeout(async () => {
      await compilePDF(latexCode, currentHash);
    }, delay);

    return () => {
      if (compileTimer.current) {
        clearTimeout(compileTimer.current);
      }
    };
  }, [latexCode, setPdfState, recompileTrigger]);

  const compilePDF = async (latex: string, hash: string) => {
    const startTime = performance.now();

    try {
      setPdfState({ isCompiling: true, errors: [], compilationTime: undefined });

      // Get resume data to check for profile image
      const resumeData = useResumeStore.getState().resumeData;
      const resources: any[] = [
        {
          main: true,
          content: latex,
          path: 'resume.tex'
        }
      ];

      // If there's a profile image, add it as a resource
      if (resumeData.personalInfo.profileImage) {
        const base64Data = resumeData.personalInfo.profileImage.split(',')[1];
        if (base64Data) {
          resources.push({
            path: 'profile.jpg',
            file: base64Data
          });
        }
      }

      // Prepare request body for YtoTech API
      const requestBody = {
        compiler: 'pdflatex',
        resources
      };

      const response = await fetch(LATEX_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const endTime = performance.now();
      const compilationTime = Math.round(endTime - startTime);

      if (!response.ok) {
        // Try to parse error response as JSON
        try {
          const errorData = await response.json();
          const errorMessage = errorData.message || 'Compilation failed';
          const errorLogs = errorData.logs || '';

          // Parse LaTeX errors from logs if available
          const errors = parseLatexErrors(errorLogs, errorMessage);

          setPdfState({
            isCompiling: false,
            errors,
            compilationTime,
          });
        } catch {
          // If JSON parsing fails, use generic error
          setPdfState({
            isCompiling: false,
            errors: [{
              line: 0,
              message: `HTTP ${response.status}: ${response.statusText || 'Compilation failed'}`
            }],
            compilationTime,
          });
        }
        return;
      }

      // Success - response should be PDF blob
      const blob = await response.blob();

      // Verify it's actually a PDF
      if (blob.type !== 'application/pdf' && blob.size < 100) {
        setPdfState({
          isCompiling: false,
          errors: [{ line: 0, message: 'Invalid PDF response received' }],
          compilationTime,
        });
        return;
      }

      const url = URL.createObjectURL(blob);

      // Clean up previous PDF URL
      if (pdfState.url) {
        URL.revokeObjectURL(pdfState.url);
      }

      setPdfState({
        url,
        isCompiling: false,
        errors: [],
        compilationTime,
      });

      lastCompiledHash.current = hash;

      console.log(`✅ PDF compiled successfully in ${compilationTime}ms`);

    } catch (error) {
      const endTime = performance.now();
      const compilationTime = Math.round(endTime - startTime);

      console.error('PDF compilation error:', error);

      let errorMessage = 'Compilation failed';

      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = '❌ Network Error: Unable to reach compilation server. Check your connection.';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setPdfState({
        isCompiling: false,
        errors: [{ line: 0, message: errorMessage }],
        compilationTime,
      });
    }
  };
}

/**
 * Parse LaTeX error logs to extract meaningful error information
 */
function parseLatexErrors(logs: string, defaultMessage: string): Array<{ line: number; message: string }> {
  if (!logs) {
    return [{ line: 0, message: defaultMessage }];
  }

  const errors: Array<{ line: number; message: string }> = [];

  const lines = logs.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for error indicators
    if (line.startsWith('!')) {
      const match = line.match(/! (.+)/);
      if (match) {
        // Try to find line number in next few lines
        let lineNum = 0;
        for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
          const lineMatch = lines[j].match(/l\.(\d+)/);
          if (lineMatch) {
            lineNum = parseInt(lineMatch[1], 10);
            break;
          }
        }

        errors.push({
          line: lineNum,
          message: match[1].trim()
        });
      }
    }
  }

  // If no specific errors found, return the default message
  if (errors.length === 0) {
    errors.push({ line: 0, message: defaultMessage });
  }

  return errors;
}
