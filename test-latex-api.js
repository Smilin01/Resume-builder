/**
 * Quick test script to verify YtoTech LaTeX-on-HTTP API integration
 * Run this in browser console or as a standalone test
 */

const LATEX_API_URL = 'https://latex.ytotech.com/builds/sync';

const testLatex = `\\documentclass{article}
\\usepackage[margin=1in]{geometry}
\\begin{document}

\\section*{Test Resume}

\\textbf{Name:} John Doe

\\textbf{Email:} john@example.com

\\section*{Experience}
\\begin{itemize}
    \\item Software Engineer at Tech Corp (2020-Present)
    \\item Junior Developer at StartUp Inc (2018-2020)
\\end{itemize}

\\end{document}`;

async function testCompilation() {
    console.log('🧪 Testing YtoTech LaTeX-on-HTTP API...');
    console.log('📍 Endpoint:', LATEX_API_URL);

    const startTime = performance.now();

    try {
        const response = await fetch(LATEX_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                compiler: 'pdflatex',
                resources: [
                    {
                        main: true,
                        content: testLatex,
                        path: 'test.tex'
                    }
                ]
            }),
        });

        const endTime = performance.now();
        const duration = Math.round(endTime - startTime);

        console.log('⏱️  Request completed in', duration, 'ms');
        console.log('📊 Response status:', response.status, response.statusText);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ Compilation failed:', errorData);
            console.error('📝 Error logs:', errorData.logs);
            return;
        }

        const blob = await response.blob();
        console.log('✅ Success! PDF blob received');
        console.log('📦 Blob size:', blob.size, 'bytes');
        console.log('📄 Blob type:', blob.type);

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'test-resume.pdf';
        link.textContent = 'Download Test PDF';
        link.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 9999; padding: 10px 20px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);';
        document.body.appendChild(link);

        console.log('💾 Download link added to page (top-right corner)');
        console.log('🎉 Test completed successfully!');

    } catch (error) {
        console.error('❌ Test failed:', error);
        console.error('🔍 Error details:', error.message);
    }
}

// Auto-run test
testCompilation();

console.log(`
╔════════════════════════════════════════════════════════════╗
║  YtoTech LaTeX-on-HTTP API Test                            ║
║  ────────────────────────────────────────────────────────  ║
║  This test will:                                           ║
║  1. Send a simple LaTeX document to the API                ║
║  2. Measure compilation time                               ║
║  3. Download the resulting PDF                             ║
║  4. Add a download link to the page                        ║
╚════════════════════════════════════════════════════════════╝
`);
