import { useEffect, useRef } from 'react';
import { useResumeStore } from '../store/resumeStore';
import { generateLaTeXFromData } from '../utils/latexConverter';
import { parseLaTeXToJSON } from '../utils/latexParser';

export function useSyncSystem() {
  const {
    resumeData,
    latexCode,
    syncMetadata,
    settings,
    setResumeData,
    setLatexCode,
    setSyncStatus,
  } = useResumeStore();

  const visualDebounceTimer = useRef<NodeJS.Timeout>();
  const codeDebounceTimer = useRef<NodeJS.Timeout>();
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (syncMetadata.lastEditedBy === 'visual') {
      setSyncStatus('syncing');

      if (visualDebounceTimer.current) {
        clearTimeout(visualDebounceTimer.current);
      }

      visualDebounceTimer.current = setTimeout(() => {
        try {
          const newLatexCode = generateLaTeXFromData(resumeData, settings.template);
          setLatexCode(newLatexCode, 'visual');
          setSyncStatus('synced');
        } catch (error) {
          console.error('Failed to convert JSON to LaTeX:', error);
          setSyncStatus('error');
        }
      }, 300);
    }

    return () => {
      if (visualDebounceTimer.current) {
        clearTimeout(visualDebounceTimer.current);
      }
    };
  }, [resumeData, settings.template, syncMetadata.lastEditedBy, setLatexCode, setSyncStatus]);

  useEffect(() => {
    if (isInitialMount.current) {
      return;
    }

    if (syncMetadata.lastEditedBy === 'code') {
      setSyncStatus('syncing');

      if (codeDebounceTimer.current) {
        clearTimeout(codeDebounceTimer.current);
      }

      codeDebounceTimer.current = setTimeout(() => {
        try {
          const newResumeData = parseLaTeXToJSON(latexCode);
          setResumeData(newResumeData, 'code');
          setSyncStatus('synced');
        } catch (error) {
          console.error('Failed to parse LaTeX to JSON:', error);
          setSyncStatus('error');
        }
      }, 500);
    }

    return () => {
      if (codeDebounceTimer.current) {
        clearTimeout(codeDebounceTimer.current);
      }
    };
  }, [latexCode, syncMetadata.lastEditedBy, setResumeData, setSyncStatus]);
}
