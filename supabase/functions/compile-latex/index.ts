import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { latex } = await req.json();

    if (!latex || typeof latex !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid LaTeX input' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Compiling LaTeX code...');
    console.log('LaTeX length:', latex.length);

    // For short documents (< 2000 chars), use GET with text parameter
    // For longer documents, use a paste service
    let compileUrl: string;

    if (latex.length < 2000) {
      // Short document - use direct text parameter
      const encodedLatex = encodeURIComponent(latex);
      compileUrl = `https://latexonline.cc/compile?text=${encodedLatex}`;
      console.log('Using direct text method (short document)');
    } else {
      // Long document - upload to dpaste.com and use URL method
      console.log('Document too long, using paste service');

      const pasteResponse = await fetch('https://dpaste.com/api/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'content': latex,
          'syntax': 'text',
          'expiry_days': '1',
        }),
      });

      if (!pasteResponse.ok) {
        throw new Error('Failed to create temporary paste');
      }

      const pasteUrl = await pasteResponse.text();
      const rawUrl = pasteUrl.trim() + '.txt';

      console.log('Created paste at:', rawUrl);
      compileUrl = `https://latexonline.cc/compile?url=${encodeURIComponent(rawUrl)}`;
    }

    console.log('Compiling from:', compileUrl.substring(0, 100) + '...');

    const response = await fetch(compileUrl, {
      method: 'GET',
    });

    console.log('Response status:', response.status);
    console.log('Response content-type:', response.headers.get('Content-Type'));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Compilation error:', errorText.substring(0, 500));

      return new Response(
        JSON.stringify({
          success: false,
          errors: [{
            line: 0,
            message: 'LaTeX compilation failed. Please check your syntax.'
          }]
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const responseData = await response.arrayBuffer();
    console.log('Response size:', responseData.byteLength);

    // Check if it's a PDF
    const pdfHeader = new Uint8Array(responseData.slice(0, 4));
    const isPDF = pdfHeader[0] === 0x25 && pdfHeader[1] === 0x50 && pdfHeader[2] === 0x44 && pdfHeader[3] === 0x46;

    if (!isPDF || responseData.byteLength < 100) {
      const decoder = new TextDecoder();
      const errorText = decoder.decode(responseData.slice(0, 500));
      console.error('Not a valid PDF. Response:', errorText);

      return new Response(
        JSON.stringify({
          success: false,
          errors: [{ line: 0, message: 'Compilation did not produce a valid PDF' }]
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('PDF generated successfully, size:', responseData.byteLength);

    return new Response(responseData, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="resume.pdf"',
      },
    });
  } catch (error) {
    console.error('Compilation error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        errors: [{ line: 0, message: error.message || 'Compilation failed' }]
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});