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

function extractBetweenBraces(text: string): string {
  const match = text.match(/\{([^}]*)\}/);
  return match ? match[1] : text;
}

function extractSection(latex: string, sectionName: string): string {
  const regex = new RegExp(`\\\\section\\*\\{${sectionName}\\}([\\s\\S]*?)(?=\\\\section\\*|\\\\end\\{document\\}|$)`, 'i');
  const match = latex.match(regex);
  return match ? match[1].trim() : '';
}

function parseContactInfo(latex: string): { email: string; phone: string; location: string } {
  const centerMatch = latex.match(/\\begin\{center\}([\s\S]*?)\\end\{center\}/);
  if (!centerMatch) return { email: '', phone: '', location: '' };

  const content = centerMatch[1];
  const lines = content.split('\\\\');

  let email = '';
  let phone = '';
  let location = '';

  for (const line of lines) {
    if (line.includes('$|$')) {
      const parts = line.split('$|$').map(p => unescapeLaTeX(p.trim()));

      for (const part of parts) {
        if (part.includes('@')) {
          email = part;
        } else if (/[\d\-\(\)\+]/.test(part)) {
          phone = part;
        } else if (part && !part.includes('bfseries') && !part.includes('Huge')) {
          location = part;
        }
      }
    }
  }

  return { email, phone, location };
}

function parseName(latex: string): string {
  const nameMatch = latex.match(/\{\\Huge\\bfseries\s+([^}]+)\}/);
  if (nameMatch) {
    return unescapeLaTeX(nameMatch[1].trim());
  }
  return '';
}

function parseExperience(experienceSection: string): ExperienceItem[] {
  const experiences: ExperienceItem[] = [];
  const subsectionRegex = /\\subsection\*\{([^}]+)\}([\s\S]*?)(?=\\subsection|$)/g;
  let match;

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
        if (endPart === 'Present') {
          current = true;
        } else {
          endDate = endPart;
        }
      } else {
        const dateParts = dateStr.split('--').map(d => d.trim());
        startDate = dateParts[0] || '';
        const endPart = dateParts[1] || '';
        if (endPart === 'Present') {
          current = true;
        } else {
          endDate = endPart;
        }
      }
    }

    const bulletPoints: string[] = [];
    const itemizeMatch = content.match(/\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/);
    if (itemizeMatch) {
      const items = itemizeMatch[1].match(/\\item\s+([^\n\\]+)/g);
      if (items) {
        items.forEach(item => {
          const bulletText = item.replace(/\\item\s+/, '').trim();
          bulletPoints.push(unescapeLaTeX(bulletText));
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

  return experiences;
}

function parseEducation(educationSection: string): EducationItem[] {
  const education: EducationItem[] = [];
  const subsectionRegex = /\\subsection\*\{([^}]+)\}([\s\S]*?)(?=\\subsection|$)/g;
  let match;

  while ((match = subsectionRegex.exec(educationSection)) !== null) {
    const degree = unescapeLaTeX(match[1]);
    const content = match[2];

    const institutionMatch = content.match(/\{\\textit\{([^}]+)\}\}/);
    const institution = institutionMatch ? unescapeLaTeX(institutionMatch[1]) : '';

    let location = '';
    const locationMatch = content.match(/\$\|\$\s*([^\\\n]+)/);
    if (locationMatch) {
      location = unescapeLaTeX(locationMatch[1].trim());
    }

    const gradMatch = content.match(/Graduated:\s*([^\}\\$]+)/);
    const graduationDate = gradMatch ? gradMatch[1].trim() : '';

    const gpaMatch = content.match(/GPA:\s*([^\\\n]+)/);
    const gpa = gpaMatch ? unescapeLaTeX(gpaMatch[1].trim()) : '';

    const bulletPoints: string[] = [];
    const itemizeMatch = content.match(/\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/);
    if (itemizeMatch) {
      const items = itemizeMatch[1].match(/\\item\s+([^\n\\]+)/g);
      if (items) {
        items.forEach(item => {
          const bulletText = item.replace(/\\item\s+/, '').trim();
          bulletPoints.push(unescapeLaTeX(bulletText));
        });
      }
    }

    education.push({
      id: Math.random().toString(36).substr(2, 9),
      degree,
      institution,
      location,
      gpa,
      graduationDate,
      bulletPoints,
    });
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
  const subsectionRegex = /\\subsection\*\{([^}]+)\}([\s\S]*?)(?=\\subsection|$)/g;
  let match;

  while ((match = subsectionRegex.exec(projectsSection)) !== null) {
    const titlePart = match[1];
    const content = match[2];

    const nameMatch = titlePart.match(/([^|]+)/);
    const name = nameMatch ? unescapeLaTeX(nameMatch[1].trim()) : '';

    const linkMatch = titlePart.match(/\\href\{([^}]+)\}/);
    const link = linkMatch ? linkMatch[1] : '';

    const descLines = content.split('\\\\');
    let description = '';
    let technologies: string[] = [];

    for (const line of descLines) {
      if (line.includes('\\textbf{Technologies:}')) {
        const techMatch = line.match(/\\textbf\{Technologies:\}\s*([^\n]+)/);
        if (techMatch) {
          technologies = techMatch[1].split(',').map(t => unescapeLaTeX(t.trim())).filter(t => t);
        }
      } else if (line.trim() && !line.includes('\\begin') && !line.includes('\\item')) {
        description = unescapeLaTeX(line.trim());
      }
    }

    const bulletPoints: string[] = [];
    const itemizeMatch = content.match(/\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/);
    if (itemizeMatch) {
      const items = itemizeMatch[1].match(/\\item\s+([^\n\\]+)/g);
      if (items) {
        items.forEach(item => {
          const bulletText = item.replace(/\\item\s+/, '').trim();
          bulletPoints.push(unescapeLaTeX(bulletText));
        });
      }
    }

    projects.push({
      id: Math.random().toString(36).substr(2, 9),
      name,
      description,
      link,
      technologies,
      bulletPoints,
    });
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
    const { email, phone, location } = parseContactInfo(latex);
    const summarySection = extractSection(latex, 'Professional Summary');
    const summary = unescapeLaTeX(summarySection.replace(/\n/g, ' ').trim());

    const experienceSection = extractSection(latex, 'Experience');
    const experience = parseExperience(experienceSection);

    const educationSection = extractSection(latex, 'Education');
    const education = parseEducation(educationSection);

    const skillsSection = extractSection(latex, 'Skills');
    const skills = parseSkills(skillsSection);

    const projectsSection = extractSection(latex, 'Projects');
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
      },
      experience,
      education,
      skills,
      projects,
      certifications,
      languages,
    };
  } catch (error) {
    console.error('Error parsing LaTeX:', error);
    throw new Error('Failed to parse LaTeX code. Please check your syntax.');
  }
}
