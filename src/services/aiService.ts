import { ResumeData } from '../types/resume';
import { generateLaTeXFromData } from '../utils/latexConverter';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const POLLINATIONS_API_URL = 'https://text.pollinations.ai/openai/chat/completions';

// AI Models for OpenRouter (Secondary Fallback)
const OPENROUTER_MODELS = [
    'qwen/qwen3-coder:free',
    'qwen/qwen3-235b-a22b:free',
    'tngtech/deepseek-r1t-chimera:free',
    'mistralai/mistral-small-3.1-24b-instruct:free',
    'meta-llama/llama-3.3-70b-instruct:free',
    'google/gemini-2.0-flash-exp:free',
];

// Debug: Check if OpenRouter API key is loaded
if (!OPENROUTER_API_KEY) {
    console.warn('⚠️ VITE_OPENROUTER_API_KEY is not set! Secondary fallback (OpenRouter) will not work.');
} else {
    console.log('✅ OpenRouter API Key loaded successfully');
}

// Helper function to try multiple models with fallback
async function callAIWithFallback(messages: any[], temperature: number = 0.7): Promise<any> {
    // 1. Try Pollinations AI (Primary)
    try {
        console.log('🤖 Trying Primary Provider: Pollinations AI...');

        const response = await fetch(POLLINATIONS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'openai', // Generic model identifier for Pollinations
                messages: messages,
                // Pollinations (Azure OpenAI) does not support custom temperature, so we omit it
            })
        });

        if (response.ok) {
            const result = await response.json();
            // Validate response format
            if (!result.choices || !result.choices[0] || !result.choices[0].message) {
                throw new Error(`Invalid Pollinations response format: ${JSON.stringify(result)}`);
            }
            console.log('✅ Success with Pollinations AI');
            return result;
        } else {
            const errorText = await response.text();
            console.warn(`⚠️ Pollinations AI failed: ${response.status} ${response.statusText}`, errorText);
        }
    } catch (error) {
        console.warn('⚠️ Pollinations AI error:', error);
    }

    console.log('🔄 Switching to Secondary Provider: OpenRouter...');

    // 2. Try OpenRouter Models (Secondary)
    let lastError: Error | null = null;

    for (let i = 0; i < OPENROUTER_MODELS.length; i++) {
        const model = OPENROUTER_MODELS[i];
        try {
            console.log(`🤖 Trying OpenRouter model ${i + 1}/${OPENROUTER_MODELS.length}: ${model}`);

            const response = await fetch(OPENROUTER_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'http://localhost:5173',
                    'X-Title': 'Resume Builder AI',
                },
                body: JSON.stringify({
                    model: model,
                    messages: messages,
                    temperature: temperature,
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMsg = errorData.error?.message || response.statusText;
                console.warn(`⚠️ Model ${model} failed: ${errorMsg}`);
                throw new Error(`AI API Error: ${errorMsg}`);
            }

            const result = await response.json();
            console.log(`✅ Success with OpenRouter model: ${model}`);
            return result;

        } catch (error) {
            lastError = error as Error;
            console.warn(`⚠️ Model ${model} failed, trying next...`);

            // If this is the last model, throw the error
            if (i === OPENROUTER_MODELS.length - 1) {
                throw lastError;
            }
        }
    }

    throw lastError || new Error('All AI models failed (Pollinations and OpenRouter)');
}

export async function generateResumeWithAI(data: Partial<ResumeData>, templateId: string): Promise<{ data: ResumeData, latex: string }> {
    // Template-specific descriptions and page sizes
    const templateInfo: Record<string, { description: string, pageSize: string }> = {
        'classic': {
            description: 'Classic Professional template with centered header, traditional layout, and serif fonts. Suitable for corporate and business roles.',
            pageSize: 'A4 (210mm x 297mm), margins: 0.9in all sides, 12pt font'
        },
        'modern-compact': {
            description: 'Modern Compact template optimized for single-page resumes with tight spacing and clean design. Best for tech and creative roles.',
            pageSize: 'Letter (8.5in x 11in), margins: 0.8cm all sides, 10pt font'
        },
        'developer': {
            description: 'Developer Resume template with centered name, contact info below, blue section headers, and technical focus. Optimized for software engineers and developers.',
            pageSize: 'A4 (210mm x 297mm), margins: 0.5in all sides, 11pt font'
        }
    };

    const selectedTemplate = templateInfo[templateId] || {
        description: 'Standard professional template',
        pageSize: 'A4 (210mm x 297mm), margins: 1in all sides, 11pt font'
    };

    const systemPrompt = `You are an expert Professional Resume Writer and Career Coach. 
    Your goal is to review raw resume data and enhance it to be professional, impactful, and ATS-friendly.
    
    **CRITICAL OUTPUT RULES:**
    1. You must output ONLY valid JSON.
    2. Do not include any markdown formatting (no \`\`\`json ... \`\`\`).
    3. Do not include any conversational text or explanations.
    4. The JSON structure must match the input exactly.`;

    const userPrompt = `
    **Task:** Enhance the provided resume data for a single-page resume (80-95% fill).

    **Template Context:**
    - Style: ${selectedTemplate.description}
    - Layout: ${selectedTemplate.pageSize}

    **Raw User Data:**
    ${JSON.stringify(data, null, 2)}

    **Enhancement Instructions:**

    1. **Professional Summary:** 
       - If missing or weak, create a compelling 2-3 sentence summary highlighting key skills and career focus.

    2. **Handling Missing Experience (CRITICAL):**
       - If the user has NO experience but HAS projects:
         * You MAY convert the most significant Project into an "Experience" entry to fill the template section.
         * **MANDATORY:** If you do this, you MUST provide valid, realistic values for all fields:
           - **Company:** Use "Personal Project", "Academic Project", or "Freelance".
           - **Role:** Use "Full Stack Developer", "Project Lead", or "Software Engineer".
           - **Location:** Use "Remote", "Campus", or the user's city.
           - **Date:** Use a valid range (e.g., "Jan 2023 - Present"). **NEVER output "Invalid Date"**.
       - If the user has experience, ensure 3-4 strong bullet points per role with action verbs.

    3. **Project Descriptions:** 
       - Expand to 2-3 sentences focusing on technologies, implementation, and business value.

    4. **Certifications:**
       - **IF present in input:** You MUST include them in the output. Improve descriptions if needed.
       - **IF missing:** Do NOT hallucinate certifications. However, if the user lists "AWS" in skills, you may add a "Relevant Skills" entry under certifications if the template requires it, or leave it empty.

    5. **Skills:** 
       - Categorize logically (e.g., Languages, Frameworks, Tools).

    6. **Page Density Strategy:**
       - **Sparse Content:** Elaborate extensively. Write detailed, multi-sentence bullet points. Add a "Core Competencies" section if needed.
       - **Dense Content:** Be concise to fit one page.
    
    **Output:** Return the enhanced JSON data.
    `;

    try {
        const result = await callAIWithFallback([
            {
                role: 'system',
                content: systemPrompt
            },
            {
                role: 'user',
                content: userPrompt
            }
        ], 0.7);
        let content = result.choices[0].message.content;

        // Enhanced cleanup: Remove markdown code blocks and extract JSON
        content = content.trim();

        // Remove markdown code blocks (```json ... ``` or ``` ... ```)
        content = content.replace(/^```json\s*/gm, '').replace(/^```\s*/gm, '').replace(/```\s*$/gm, '');

        // Try to extract JSON if there's extra text
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            content = jsonMatch[0];
        }

        // Remove any trailing commas before closing brackets (common JSON error)
        content = content.replace(/,(\s*[}\]])/g, '$1');

        let enhancedData: ResumeData;
        try {
            enhancedData = JSON.parse(content);
        } catch (parseError) {
            console.error('Failed to parse AI JSON response:', parseError);
            console.log('Raw content:', content);
            // Fallback: Use original data if AI response is invalid
            enhancedData = data as ResumeData;
        }

        // Generate LaTeX using the enhanced data and the selected template
        const latex = generateLaTeXFromData(enhancedData, templateId);

        return { data: enhancedData, latex };

    } catch (error) {
        console.error('Error generating resume with AI:', error);
        // Fallback: Generate LaTeX with original data
        const latex = generateLaTeXFromData(data as ResumeData, templateId);
        return { data: data as ResumeData, latex };
    }
}

export async function updateResumeWithAI(currentLatex: string, userRequest: string): Promise<string> {
    const systemPrompt = `You are an expert LaTeX Resume Developer. 
    Your goal is to modify LaTeX code based on user requests while maintaining perfect compilation and design integrity.
    
    **CRITICAL OUTPUT RULES:**
    1. Output ONLY valid, compilable LaTeX code.
    2. Do not include markdown formatting (no \`\`\`latex ... \`\`\`).
    3. Start directly with \\documentclass or the relevant code block.
    4. Do not remove sections unless explicitly requested.`;

    const userPrompt = `
    **Task:** Modify the LaTeX resume based on the user's request.

    **User Request:**
    "${userRequest}"

    **Current LaTeX Code:**
    ${currentLatex}

    **Modification Guidelines:**
    1. **Design:** Maintain the existing template style (Classic/Modern/Developer).
    2. **Content:** Optimize text for impact and conciseness. Remove "widows" (single words on new lines).
    3. **Spacing:** Adjust vertical spacing (\\vspace) and margins to ensure the resume fits perfectly on one page.
    4. **Safety:** Ensure all LaTeX syntax is valid. Escape special characters if adding new text.

    **Output:** Return the complete, modified LaTeX code.
    `;

    try {
        const result = await callAIWithFallback([
            {
                role: 'system',
                content: systemPrompt
            },
            {
                role: 'user',
                content: userPrompt
            }
        ], 0.3); // Lower temperature for more deterministic code edits
        let content = result.choices[0].message.content;

        // Enhanced cleanup: Remove markdown code blocks and extract LaTeX
        content = content.trim();

        // Remove markdown code blocks (```latex ... ``` or ``` ... ```)
        content = content.replace(/^```latex\s*/gm, '').replace(/^```\s*/gm, '').replace(/```\s*$/gm, '');

        // Try to extract LaTeX if there's extra text (starts with \documentclass)
        const latexMatch = content.match(/\\documentclass[\s\S]*/);
        if (latexMatch) {
            content = latexMatch[0];
        }

        content = content.trim();

        return content;

    } catch (error) {
        console.error('Error updating resume with AI:', error);
        throw error;
    }
}
