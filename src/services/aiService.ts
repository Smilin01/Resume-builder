import { ResumeData } from '../types/resume';
import { generateLaTeXFromData } from '../utils/latexConverter';

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function generateResumeWithAI(data: Partial<ResumeData>, templateId: string): Promise<{ data: ResumeData, latex: string }> {
    const prompt = `
    You are an expert Professional Resume Writer and Career Coach. Your task is to review the provided raw resume data and enhance it to be more professional, impactful, and ATS-friendly.

    **User Data:**
    ${JSON.stringify(data, null, 2)}

    **Instructions:**
    1. **Professional Summary:** Rewrite the summary to be concise, powerful, and highlight key strengths.
    2. **Experience:** Enhance bullet points. Use strong action verbs (e.g., "Spearheaded", "Optimized", "Developed"). Quantify achievements where possible (e.g., "increased efficiency by 20%").
    3. **Skills:** Analyze the provided skills list and **categorize them into logical groups** (e.g., "Programming Languages", "DevOps Tools", "Cloud Platforms", "Frameworks"). Return them as an array of objects with "category" and "skills" fields.
    4. **Projects:** Polish project descriptions to focus on technical challenges and outcomes.
    5. **Structure:** Return the result as a valid JSON object that strictly matches the structure of the input "User Data", but with the \`skills\` array populated with categorized skills.
    6. **ATS Optimization:** Ensure all content is keyword-rich and optimized for Applicant Tracking Systems.
    7. **CRITICAL:** Output ONLY the raw JSON string. Do not include markdown formatting (like \`\`\`json ... \`\`\`).

    **Goal:** The content should sound like it was written by a top-tier professional, ready to be put into a premium resume template.
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

        // Cleanup: Remove markdown code blocks if present
        content = content.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/```$/, '');

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
    const prompt = `
    You are an expert LaTeX Resume Editor. Your task is to modify the provided LaTeX code based on the user's specific request.

    **User Request:**
    "${userRequest}"

    **Current LaTeX Code:**
    ${currentLatex}

    **Instructions:**
    1. Analyze the user's request and the current LaTeX code.
    2. Apply the requested changes to the LaTeX code.
    3. Ensure the output is valid, compilable LaTeX.
    4. Do not remove any sections unless explicitly asked.
    5. **"Fit to One Page" Strategy (Balanced Approach):**
       a. **Optimize Content (Crucial):** Rewrite wordy sentences to be more concise without losing impact. Remove "widows" (single words on a new line).
       b. **Adjust Margins:** Reduce margins slightly (e.g., top=0.4in, bottom=0.4in).
       c. **Adjust Spacing:** Reduce vertical spacing using \\vspace{-Xpt} between sections.
       d. **Font Size:** Change to 10pt only if content optimization and spacing aren't enough.
       e. **Goal:** The resume should look full and professional, not cramped or empty.
    6. **"Fill the Page" Strategy:**
       a. **Spacing:** Increase vertical spacing between sections and items.
       b. **Font Size:** Change to \\documentclass[11pt]{article} or 12pt.
       c. **Margins:** Increase margins slightly (e.g., 1in).
    7. **CRITICAL:** Output ONLY the raw LaTeX code. Do not include markdown formatting (like \`\`\`latex ... \`\`\`). Start directly with \\documentclass or the first line of the code.
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

        // Cleanup
        content = content.replace(/^```latex\s*/, '').replace(/^```\s*/, '').replace(/```$/, '');

        return content;

    } catch (error) {
        console.error('Error updating resume with AI:', error);
        throw error;
    }
}
