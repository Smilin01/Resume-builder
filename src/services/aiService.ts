import { ResumeData } from '../types/resume';
import { generateLaTeXFromData } from '../utils/latexConverter';

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

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

    const prompt = `
    You are an expert Professional Resume Writer and Career Coach. Your task is to review the provided raw resume data and enhance it to be more professional, impactful, and ATS-friendly.

    **Selected Template:** ${selectedTemplate.description}
    **Page Specifications:** ${selectedTemplate.pageSize}
    **Target:** Single page resume that fills 80-95% of the page
    
    **User Data:**
    ${JSON.stringify(data, null, 2)}

    **CRITICAL CONTENT GENERATION RULES:**
    
    1. **Missing Professional Summary:** 
       - If summary is empty or very short (< 20 words), CREATE a compelling 2-3 sentence professional summary based on the user's experience, education, and skills
       - Highlight their strongest qualifications and career focus
       - Example: "Results-driven [Role] with [X] years of experience in [Domain]. Expertise in [Key Skills]. Proven track record of [Achievement Type]."

    2. **Missing Project Descriptions:**
       - If project description is empty or minimal, GENERATE a professional 1-2 sentence description based on:
         * Project name (infer purpose from name)
         * Technologies used
         * Common use cases for those technologies
       - Focus on technical implementation and business value
       - Example: "Developed a scalable web application using React and Node.js, implementing RESTful APIs and real-time features to enhance user engagement by 40%."

    3. **Missing Certification Details:**
       - If certification lacks description, ADD context about:
         * What the certification validates
         * Relevant skills covered
       - Keep it brief (1 sentence if needed in description field)

    4. **Experience Bullet Points:**
       - If experience has < 2 bullet points, EXPAND to 3-4 points by:
         * Adding quantified achievements
         * Describing key responsibilities
         * Highlighting technical skills used
       - Use strong action verbs: Spearheaded, Architected, Optimized, Implemented, Delivered

    5. **PAGE FILLING & DENSITY STRATEGY (CRITICAL):**
    
       **SCENARIO A: SPARSE CONTENT (Less than 50% of page):**
       - **ELABORATE EXTENSIVELY:** Do not be concise. Write detailed, multi-sentence bullet points (2-3 lines each).
       - **Expand Summary:** Write a robust 4-5 sentence Professional Summary that occupies significant vertical space.
       - **Add Sections:** Create a "Core Competencies" or "Key Skills" section with categorized lists to fill space.
       - **Detailed Projects:** For every project, write a 3-4 sentence description explaining the tech stack, challenges, and business outcome.
       - **Education:** Add "Relevant Coursework", "Academic Projects", or "Achievements" to education entries.
       - **Goal:** Generate enough text volume to naturally fill the page.
       
       **SCENARIO B: MODERATE CONTENT (50-80% of page):**
       - Maintain a professional balance.
       - Ensure 3-4 bullet points per experience role.
       - Keep descriptions clear and impactful.
       
       **SCENARIO C: DENSE CONTENT (Over 80% of page):**
       - Be concise and direct.
       - Limit bullet points to 2-3 per role.
       - Focus on high-impact achievements.

    **Formatting Note:**
    - If the content is still low after elaboration, the system will rely on your expanded text to justify increasing font size and spacing. **PROVIDE VOLUME.**

    **Standard Instructions:**
    6. **Skills:** Categorize into logical groups (2-4 categories). Examples: "Programming Languages", "Frameworks & Libraries", "Tools & Platforms", "Soft Skills"
    7. **ATS Optimization:** Include industry keywords and action verbs
    8. **Formatting:** Clean, professional text. Avoid special characters that break LaTeX
    9. **Structure:** Return valid JSON matching the input structure exactly
    10. **CRITICAL:** Output ONLY raw JSON. No markdown formatting (no \`\`\`json ... \`\`\`)

    **Goal:** Create a complete, professional, single-page resume that fills 80-95% of the page with high-impact content. Generate missing content intelligently based on available information.
  `;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'http://localhost:5173',
                'X-Title': 'Resume Builder AI',
            },
            body: JSON.stringify({
                model: 'qwen/qwen-2.5-coder-32b-instruct:free',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant that enhances resume content and returns valid JSON.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`AI API Error: ${errorData.error?.message || response.statusText}`);
        }

        const result = await response.json();
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
            console.log('Content length:', content.length);
            console.log('First 200 chars:', content.substring(0, 200));
            console.log('Last 200 chars:', content.substring(content.length - 200));
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
    const prompt = `
    You are an expert LaTeX Resume Editor. Your task is to modify the provided LaTeX code based on the user's specific request.

    **User Request:**
    "${userRequest}"

    **Current LaTeX Code:**
    ${currentLatex}

    **Template Layout Guidelines:**
    - **Classic Template:** Uses centered header with tabularx, serif fonts, traditional sections
    - **Modern Compact Template:** Uses tight margins (0.8cm), small fonts (10pt), centered header with footnotesize contacts
    - **Developer Template:** Uses centered name with \\Huge font, centered contact info below with \\small font, blue section headers (RGB 65,105,225), technical focus

    **Instructions:**
    1. Analyze the user's request and the current LaTeX code.
    2. Apply the requested changes to the LaTeX code while maintaining the template's design style.
    3. Ensure the output is valid, compilable LaTeX.
    4. Do not remove any sections unless explicitly asked.
    5. **Preserve Header Structure:** Keep the header layout intact (centered name and contact info for Developer template, etc.)
    6. **"Fit to One Page" Strategy (Balanced Approach):**
       a. **Optimize Content (Crucial):** Rewrite wordy sentences to be more concise without losing impact. Remove "widows" (single words on a new line).
       b. **Adjust Margins:** Reduce margins slightly (e.g., top=0.4in, bottom=0.4in).
       c. **Adjust Spacing:** Reduce vertical spacing using \\vspace{-Xpt} between sections.
       d. **Font Size:** Change to 10pt only if content optimization and spacing aren't enough.
       e. **Goal:** The resume should look full and professional, not cramped or empty.
    7. **"Fill the Page" Strategy (For Low Content):**
       a. **Elaborate Content:** Rewrite bullet points to be more detailed and verbose.
       b. **Increase Font Size:** Change document class to \\documentclass[11pt]{article} or even 12pt if content is very sparse.
       c. **Increase Spacing:** Add \\vspace{5pt} or \\vspace{10pt} between sections and items. Increase \\parskip.
       d. **Margins:** Increase margins to 1in or 1.25in to reduce white space.
    8. **CRITICAL:** Output ONLY the raw LaTeX code. Do not include markdown formatting (like \`\`\`latex ... \`\`\`). Start directly with \\documentclass or the first line of the code.
    `;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'http://localhost:5173',
                'X-Title': 'Resume Builder AI',
            },
            body: JSON.stringify({
                model: 'qwen/qwen-2.5-coder-32b-instruct:free',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant that modifies LaTeX code.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3, // Lower temperature for more deterministic code edits
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`AI API Error: ${errorData.error?.message || response.statusText}`);
        }

        const result = await response.json();
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
