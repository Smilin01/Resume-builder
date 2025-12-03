import { ResumeData } from '../types/resume';
import { getTemplateById } from '../data/templates';

export function escapeLaTeX(text: string): string {
  if (!text) return '';

  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

export function formatDate(date: string, current: boolean = false): string {
  if (!date && !current) return '';
  if (current) return 'Present';

  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return date;
    const month = d.toLocaleDateString('en-US', { month: 'short' });
    const year = d.getFullYear();
    return `${month} ${year}`;
  } catch {
    return date;
  }
}

export function generateLaTeXFromData(resumeData: ResumeData, templateId: string = 'classic'): string {
  console.log('Converting to LaTeX with template:', templateId);
  const template = getTemplateById(templateId);

  if (template) {
    return template.generateLaTeX(resumeData);
  }

  // Fallback to classic template if template not found
  const classicTemplate = getTemplateById('classic');
  return classicTemplate!.generateLaTeX(resumeData);
}
