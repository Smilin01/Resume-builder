/**
 * LaTeX-on-HTTP API Integration
 * 
 * This file provides utilities for interacting with the YtoTech LaTeX-on-HTTP API
 * Documentation: https://github.com/YtoTech/latex-on-http
 * API Endpoint: https://latex.ytotech.com/builds/sync
 */

export const LATEX_API_URL = 'https://latex.ytotech.com/builds/sync';

/**
 * Available LaTeX compilers
 */
export type LaTeXCompiler =
    | 'pdflatex'   // Default, fastest, most compatible
    | 'xelatex'    // Unicode support, modern fonts
    | 'lualatex'   // Lua scripting, advanced features
    | 'platex'     // Japanese typesetting
    | 'uplatex'    // Universal pLaTeX
    | 'context';   // ConTeXt typesetting system

/**
 * LaTeX resource types for the API
 */
export interface LaTeXResource {
    main?: boolean;           // Mark as main document
    content?: string;         // LaTeX content as string
    path?: string;            // File path (e.g., 'resume.tex')
    url?: string;             // External URL for images/files
    file?: string;            // Base64 encoded file content
}

/**
 * API request body structure
 */
export interface LaTeXCompileRequest {
    compiler: LaTeXCompiler;
    resources: LaTeXResource[];
    options?: {
        bibliography?: {
            command: 'bibtex' | 'biber';
        };
    };
}

/**
 * API error response structure
 */
export interface LaTeXCompileError {
    message: string;
    logs?: string;
    status?: number;
}

/**
 * Compile LaTeX code to PDF using the YtoTech API
 * 
 * @param latex - LaTeX source code
 * @param compiler - LaTeX compiler to use (default: pdflatex)
 * @returns Promise<Blob> - PDF blob on success
 * @throws Error with compilation details on failure
 */
export async function compileLaTeX(
    latex: string,
    compiler: LaTeXCompiler = 'pdflatex'
): Promise<Blob> {
    const requestBody: LaTeXCompileRequest = {
        compiler,
        resources: [
            {
                main: true,
                content: latex,
                path: 'resume.tex'
            }
        ]
    };

    const response = await fetch(LATEX_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        let errorMessage = 'Compilation failed';
        let errorLogs = '';

        try {
            const errorData: LaTeXCompileError = await response.json();
            errorMessage = errorData.message || errorMessage;
            errorLogs = errorData.logs || '';
        } catch {
            errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }

        const error = new Error(errorMessage);
        (error as any).logs = errorLogs;
        (error as any).status = response.status;
        throw error;
    }

    return await response.blob();
}

/**
 * Compile LaTeX with external resources (images, additional files)
 * 
 * @param latex - Main LaTeX source code
 * @param resources - Additional resources (images, sections, etc.)
 * @param compiler - LaTeX compiler to use
 * @returns Promise<Blob> - PDF blob on success
 */
export async function compileLaTeXWithResources(
    latex: string,
    resources: LaTeXResource[],
    compiler: LaTeXCompiler = 'pdflatex'
): Promise<Blob> {
    const requestBody: LaTeXCompileRequest = {
        compiler,
        resources: [
            {
                main: true,
                content: latex,
                path: 'main.tex'
            },
            ...resources
        ]
    };

    const response = await fetch(LATEX_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        const errorData: LaTeXCompileError = await response.json();
        throw new Error(errorData.message || 'Compilation failed');
    }

    return await response.blob();
}

/**
 * Download a PDF blob as a file
 * 
 * @param blob - PDF blob to download
 * @param filename - Desired filename (default: resume.pdf)
 */
export function downloadPDF(blob: Blob, filename: string = 'resume.pdf'): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Compiler information for UI display
 */
export const COMPILER_INFO: Record<LaTeXCompiler, { name: string; description: string }> = {
    pdflatex: {
        name: 'pdfLaTeX',
        description: 'Default compiler - fastest and most compatible'
    },
    xelatex: {
        name: 'XeLaTeX',
        description: 'Unicode support with modern fonts'
    },
    lualatex: {
        name: 'LuaLaTeX',
        description: 'Advanced features with Lua scripting'
    },
    platex: {
        name: 'pLaTeX',
        description: 'Japanese typesetting support'
    },
    uplatex: {
        name: 'upLaTeX',
        description: 'Universal pLaTeX for Japanese documents'
    },
    context: {
        name: 'ConTeXt',
        description: 'Alternative typesetting system'
    }
};
