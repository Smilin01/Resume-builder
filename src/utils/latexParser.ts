import { ResumeData, ExperienceItem, EducationItem, SkillCategory, ProjectItem, CertificationItem, LanguageItem } from '../types/resume';

function unescapeLaTeX(text: string): string {
  if (!text) return '';

  return text
    .replace(/\\textbackslash\{\}/g, '\\')
    .replace(/\\&/g, '&')
    .replace(/\\%/g, '%')
    .replace(/\\\$/g, '$')
    .replace(/\\#/g, '#')
    .replace(/\\_/g, '_')
    .replace(/\\\{/g, '{')
    .replace(/\\\}/g, '}')
    .replace(/\\textasciitilde\{\}/g, '~')
    .replace(/\\textasciicircum\{\}/g, '^');
}



function extractSection(latex: string, sectionName: string): string {
  // Match \section{Name} or \section*{Name}, allowing for optional whitespace
  const regex = new RegExp(`\\\\section\\*?\\{${sectionName}\\}([\\s\\S]*?)(?=\\\\section|\\\\end\\{document\\}|$)`, 'i');
  const match = latex.match(regex);
  return match ? match[1].trim() : '';
}

function parseContactInfo(latex: string): { email: string; phone: string; location: string; profiles: { network: string; username: string; url: string }[] } {
  const centerMatch = latex.match(/\\begin\{center\}([\s\S]*?)\\end\{center\}/);
  if (!centerMatch) return { email: '', phone: '', location: '', profiles: [] };

  // Let's restart the logic for parseContactInfo to be safer
  return parseContactInfoSafe(centerMatch[1]);
}

function parseContactInfoSafe(content: string): { email: string; phone: string; location: string; profiles: { network: string; username: string; url: string }[] } {
  let email = '';
  let phone = '';
  let location = '';
  const profiles: { network: string; username: string; url: string }[] = [];

  // Normalize separators
  const normalizedContent = content
    .replace(/\\AND/g, '|')
    .replace(/\\quad/g, '')
    .replace(/\$\|\$/g, '|')
    .replace(/\\bullet/g, '|')
    .replace(/\\cdot/g, '|');

  const lines = normalizedContent.split('\\\\');

  for (const line of lines) {
    const parts = line.split('|').map(p => p.trim());

    for (const part of parts) {
      // Extract text content and hrefs
      const hrefMatch = part.match(/\\href\{([^}]+)\}\{([^}]+)\}/);
      const textContent = unescapeLaTeX(part.replace(/\\href\{[^}]+\}\{[^}]+\}/, '').replace(/\\[a-zA-Z]+(\{[^}]*\})?/g, '').trim());

      if (hrefMatch) {
        const url = hrefMatch[1];
        const text = unescapeLaTeX(hrefMatch[2]);

        if (url.startsWith('mailto:')) {
          email = text;
        } else if (url.startsWith('tel:')) {
          phone = text;
        } else {
          let network = 'Website';
          if (url.includes('linkedin')) network = 'LinkedIn';
          else if (url.includes('github')) network = 'GitHub';
          else if (url.includes('twitter') || url.includes('x.com')) network = 'Twitter';
          else if (url.includes('portfolio')) network = 'Portfolio';

          profiles.push({ network, username: text, url });
        }
      } else {
        // Try to identify email/phone/location from plain text
        if (textContent.includes('@')) {
          email = textContent;
        } else if (/[\d\-\(\)\+]{7,}/.test(textContent)) {
          phone = textContent;
        } else if (textContent && textContent.length > 2 && !textContent.toLowerCase().includes('page')) {
          // Assume it's location if it's not empty and doesn't look like a page number
          // Also check it's not the name (which is usually handled separately, but might leak here)
          location = textContent;
        }
      }
    }
  }
  return { email, phone, location, profiles };
}

function parseName(latex: string): string {
  // Try standard template format
  let nameMatch = latex.match(/\{\\Huge\\bfseries\s+([^}]+)\}/);
  if (nameMatch) return unescapeLaTeX(nameMatch[1].trim());

  // Try \textbf{Name} inside center environment
  const centerMatch = latex.match(/\\begin\{center\}([\s\S]*?)\\end\{center\}/);
  if (centerMatch) {
    const content = centerMatch[1];
    // Look for \textbf{...} or \Huge ...
    const bfMatch = content.match(/\\textbf\{([^}]+)\}/);
    if (bfMatch) return unescapeLaTeX(bfMatch[1].trim());

    // Look for just text at the beginning if no commands
    const firstLine = content.split('\\\\')[0].trim();
    const cleanLine = unescapeLaTeX(firstLine.replace(/\\[a-zA-Z]+(\{[^}]*\})?/g, '').trim());
    if (cleanLine) return cleanLine;
  }

  return '';
}

function parseExperience(experienceSection: string): ExperienceItem[] {
  const experiences: ExperienceItem[] = [];

  // Try standard subsection format first
  const subsectionRegex = /\\subsection\*?\{([^}]+)\}([\s\S]*?)(?=\\subsection|\\textbf|$)/g;
  let match = subsectionRegex.exec(experienceSection);

  if (match) {
    subsectionRegex.lastIndex = 0;
    while ((match = subsectionRegex.exec(experienceSection)) !== null) {
      const title = match[1];
      const content = match[2];
      const titleParts = title.split(' at ');
      const jobTitle = unescapeLaTeX(titleParts[0]?.trim() || '');
      const company = unescapeLaTeX(titleParts[1]?.trim() || '');

      const dateMatch = content.match(/\{\\textit\{([^}]+)\}\}/);
      let startDate = '';
      let endDate = '';
      let current = false;
      let location = '';

      if (dateMatch) {
        const dateStr = dateMatch[1];
        if (dateStr.includes('$|$')) {
          const parts = dateStr.split('$|$');
          const dates = parts[0].trim();
          location = unescapeLaTeX(parts[1]?.trim() || '');
          const dateParts = dates.split('--').map(d => d.trim());
          startDate = dateParts[0] || '';
          const endPart = dateParts[1] || '';
          if (endPart === 'Present') current = true; else endDate = endPart;
        } else {
          const dateParts = dateStr.split('--').map(d => d.trim());
          startDate = dateParts[0] || '';
          const endPart = dateParts[1] || '';
          if (endPart === 'Present') current = true; else endDate = endPart;
        }
      }

      const bulletPoints: string[] = [];
      const itemizeMatch = content.match(/\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/);
      if (itemizeMatch) {
        const items = itemizeMatch[1].match(/\\item\s+([^\n\\]+)/g);
        if (items) {
          items.forEach(item => {
            bulletPoints.push(unescapeLaTeX(item.replace(/\\item\s+/, '').trim()));
          });
        }
      }

      experiences.push({
        id: Math.random().toString(36).substr(2, 9),
        jobTitle,
        company,
        location,
        startDate,
        endDate,
        current,
        bulletPoints,
      });
    }
  } else {
    // Try \textbf based format (User's format)
    // Regex to find: \textbf{Title} \hfill Date
    // We use a regex that matches the start of an entry and looks ahead to the next one or end of string
    const entryRegex = /\\textbf\{([^}]+)\}\s*\\hfill\s*([^\n]+)([\s\S]*?)(?=\\textbf\{[^}]+\}\s*\\hfill|$)/g;

    while ((match = entryRegex.exec(experienceSection)) !== null) {
      const title = unescapeLaTeX(match[1].trim());
      const dateStr = match[2].trim();
      const content = match[3];

      let jobTitle = title;
      let company = '';
      let startDate = '';
      let endDate = '';
      let current = false;
      let location = '';

      // Parse date: Jan 2024 – Present
      const dateParts = dateStr.split(/–|-|--/).map(d => d.trim());
      startDate = dateParts[0] || '';
      const endPart = dateParts[1] || '';
      if (endPart.toLowerCase() === 'present') current = true; else endDate = endPart;

      // Try to find company name (often in \textit)
      const italicMatch = content.match(/\\textit\{([^}]+)\}/);
      if (italicMatch) {
        company = unescapeLaTeX(italicMatch[1]);
      }

      const bulletPoints: string[] = [];
      const itemizeMatch = content.match(/\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/);
      if (itemizeMatch) {
        // Be careful not to match nested itemizes if any, but standard regex is greedy.
        // Better to match \item until next \item or end
        const items = itemizeMatch[1].match(/\\item\s+((?:(?!\\item).)*)/gs);
        if (items) {
          items.forEach(item => {
            bulletPoints.push(unescapeLaTeX(item.replace(/\\item\s+/, '').trim()));
          });
        }
      }

      experiences.push({
        id: Math.random().toString(36).substr(2, 9),
        jobTitle,
        company,
        location,
        startDate,
        endDate,
        current,
        bulletPoints,
      });
    }
  }

  return experiences;
}

function parseEducation(educationSection: string): EducationItem[] {
  const education: EducationItem[] = [];

  if (educationSection.includes('\\subsection')) {
    const subsectionRegex = /\\subsection\*?\{([^}]+)\}([\s\S]*?)(?=\\subsection|\\textbf|$)/g;
    let match;
    while ((match = subsectionRegex.exec(educationSection)) !== null) {
      const degree = unescapeLaTeX(match[1]);
      const content = match[2];
      const institutionMatch = content.match(/\{\\textit\{([^}]+)\}\}/);
      const institution = institutionMatch ? unescapeLaTeX(institutionMatch[1]) : '';
      const gradMatch = content.match(/Graduated:\s*([^\}\\$]+)/);
      const graduationDate = gradMatch ? gradMatch[1].trim() : '';
      education.push({
        id: Math.random().toString(36).substr(2, 9),
        degree,
        institution,
        location: '',
        graduationDate,
        bulletPoints: []
      });
    }
  } else {
    // User format: \textbf{Institution} — Degree \hfill Date
    // Regex: \textbf{Inst} [—] Degree \hfill Date
    const entryRegex = /\\textbf\{([^}]+)\}\s*[—–-]\s*([^\\]+)\s*\\hfill\s*([^\n]+)([\s\S]*?)(?=\\textbf\{[^}]+\}|\\section|$)/g;
    let match;

    while ((match = entryRegex.exec(educationSection)) !== null) {
      const institution = unescapeLaTeX(match[1].trim());
      const degree = unescapeLaTeX(match[2].trim());
      const graduationDate = unescapeLaTeX(match[3].trim());
      const content = match[4];

      const bulletPoints: string[] = [];
      const italicMatch = content.match(/\\textit\{Relevant Coursework:\}\s*([^\n]+)/);
      if (italicMatch) {
        bulletPoints.push('Relevant Coursework: ' + unescapeLaTeX(italicMatch[1]));
      }

      education.push({
        id: Math.random().toString(36).substr(2, 9),
        degree,
        institution,
        location: '',
        graduationDate,
        bulletPoints
      });
    }
  }

  return education;
}

function parseSkills(skillsSection: string): SkillCategory[] {
  const skills: SkillCategory[] = [];
  const lines = skillsSection.split('\\\\').filter(line => line.trim());

  for (const line of lines) {
    const match = line.match(/\\textbf\{([^}]+)\}:\s*([^\n]+)/);
    if (match) {
      const category = unescapeLaTeX(match[1]);
      const skillsStr = match[2].trim();
      const skillList = skillsStr.split(',').map(s => unescapeLaTeX(s.trim())).filter(s => s);

      skills.push({
        id: Math.random().toString(36).substr(2, 9),
        category,
        skills: skillList,
      });
    }
  }

  return skills;
}

function parseProjects(projectsSection: string): ProjectItem[] {
  const projects: ProjectItem[] = [];

  if (projectsSection.includes('\\subsection')) {
    const subsectionRegex = /\\subsection\*?\{([^}]+)\}([\s\S]*?)(?=\\subsection|\\textbf|$)/g;
    let match;
    while ((match = subsectionRegex.exec(projectsSection)) !== null) {
      const titlePart = match[1];
      const content = match[2];
      const name = unescapeLaTeX(titlePart.split('|')[0].trim());
      const descLines = content.split('\\\\');
      let description = '';
      for (const line of descLines) {
        if (!line.includes('\\textbf') && line.trim()) description = unescapeLaTeX(line.trim());
      }
      projects.push({
        id: Math.random().toString(36).substr(2, 9),
        name,
        description,
        technologies: [],
        bulletPoints: []
      });
    }
  } else {
    // User format: \textbf{Project Name} \hfill \textit{Tech: ...}
    const entryRegex = /\\textbf\{([^}]+)\}\s*\\hfill\s*([^\n]+)([\s\S]*?)(?=\\textbf\{[^}]+\}\s*\\hfill|$)/g;
    let match;

    while ((match = entryRegex.exec(projectsSection)) !== null) {
      const name = unescapeLaTeX(match[1].trim());
      const techAndDesc = match[2] + match[3]; // Combine to parse tech and desc

      let description = '';
      let technologies: string[] = [];

      // Extract technologies
      const techMatch = techAndDesc.match(/\\textit\{Tech:\s*([^}]+)\}/);
      if (techMatch) {
        technologies = techMatch[1].split(',').map(t => unescapeLaTeX(t.trim()));
      }

      // Extract description
      // Remove the tech part and clean up
      let cleanContent = techAndDesc.replace(/\\textit\{Tech:[^}]+\}/, '').trim();

      // If description is on new lines, it might be separated by newlines
      const lines = cleanContent.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('\\hfill')) {
          description += unescapeLaTeX(trimmed) + ' ';
        }
      }
      description = description.trim();

      projects.push({
        id: Math.random().toString(36).substr(2, 9),
        name,
        description,
        technologies,
        bulletPoints: []
      });
    }
  }

  return projects;
}

function parseCertifications(certsSection: string): CertificationItem[] {
  const certifications: CertificationItem[] = [];
  const itemizeMatch = certsSection.match(/\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/);

  if (itemizeMatch) {
    const items = itemizeMatch[1].match(/\\item\s+([^\n]+)/g);
    if (items) {
      items.forEach(item => {
        const content = item.replace(/\\item\s+/, '').trim();
        const nameMatch = content.match(/\\textbf\{([^}]+)\}/);
        const name = nameMatch ? unescapeLaTeX(nameMatch[1]) : '';

        const issuerMatch = content.match(/--\s*([^(\\]+)/);
        const issuer = issuerMatch ? unescapeLaTeX(issuerMatch[1].trim()) : '';

        const dateMatch = content.match(/\(([^)]+)\)/);
        const date = dateMatch ? dateMatch[1] : '';

        const linkMatch = content.match(/\\href\{([^}]+)\}/);
        const link = linkMatch ? linkMatch[1] : '';

        certifications.push({
          id: Math.random().toString(36).substr(2, 9),
          name,
          issuer,
          date,
          link,
        });
      });
    }
  }

  return certifications;
}

function parseLanguages(langsSection: string): LanguageItem[] {
  const languages: LanguageItem[] = [];
  const itemizeMatch = langsSection.match(/\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/);

  if (itemizeMatch) {
    const items = itemizeMatch[1].match(/\\item\s+([^\n]+)/g);
    if (items) {
      items.forEach(item => {
        const content = item.replace(/\\item\s+/, '').trim();
        const match = content.match(/\\textbf\{([^}]+)\}:\s*(\w+)/);
        if (match) {
          const language = unescapeLaTeX(match[1]);
          const proficiency = match[2] as LanguageItem['proficiency'];

          languages.push({
            id: Math.random().toString(36).substr(2, 9),
            language,
            proficiency,
          });
        }
      });
    }
  }

  return languages;
}

export function parseLaTeXToJSON(latex: string): ResumeData {
  try {
    const name = parseName(latex);
    const { email, phone, location, profiles } = parseContactInfo(latex);

    let summarySection = extractSection(latex, 'Professional Summary');
    if (!summarySection) summarySection = extractSection(latex, 'Summary');
    if (!summarySection) summarySection = extractSection(latex, 'Objective');

    const summary = unescapeLaTeX(summarySection.replace(/\n/g, ' ').trim());

    let experienceSection = extractSection(latex, 'Experience');
    if (!experienceSection) experienceSection = extractSection(latex, 'Professional Experience');
    if (!experienceSection) experienceSection = extractSection(latex, 'Work Experience');

    const experience = parseExperience(experienceSection);

    const educationSection = extractSection(latex, 'Education');
    const education = parseEducation(educationSection);

    let skillsSection = extractSection(latex, 'Skills');
    if (!skillsSection) skillsSection = extractSection(latex, 'Technical Skills');

    const skills = parseSkills(skillsSection);

    let projectsSection = extractSection(latex, 'Projects');
    if (!projectsSection) projectsSection = extractSection(latex, 'Key Projects');
    if (!projectsSection) projectsSection = extractSection(latex, 'Academic Projects');

    const projects = parseProjects(projectsSection);

    const certsSection = extractSection(latex, 'Certifications');
    const certifications = parseCertifications(certsSection);

    const langsSection = extractSection(latex, 'Languages');
    const languages = parseLanguages(langsSection);

    return {
      personalInfo: {
        name,
        email,
        phone,
        location,
        summary,
        profiles,
      },
      experience,
      education,
      skills,
      projects,
      certifications,
      languages,
      customSections: [], // Initialize empty to prevent crashes
    };
  } catch (error) {
    console.error('Error parsing LaTeX:', error);
    throw new Error('Failed to parse LaTeX code. Please check your syntax.');
  }
}
