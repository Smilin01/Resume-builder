import { ResumeData } from '../types/resume';

export interface ResumeTemplate {
    id: string;
    name: string;
    description: string;
    preview: string;
    dummyData: ResumeData;
    generateLaTeX: (data: ResumeData) => string;
}

// Helper function to escape LaTeX special characters
function escapeLaTeX(text: string): string {
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

function formatDate(date: string): string {
    if (!date) return '';
    try {
        const d = new Date(date);
        const month = d.toLocaleDateString('en-US', { month: 'short' });
        const year = d.getFullYear();
        return `${month} ${year}`;
    } catch {
        return date;
    }
}

// --- Dummy Data Sets ---

const classicDummyData: ResumeData = {
    personalInfo: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        location: 'New York, NY',
        summary: 'Experienced Business Analyst with over 5 years of experience in data analysis, project management, and strategic planning. Proven track record of improving operational efficiency and driving business growth through data-driven insights.',
        profiles: [],
    },
    experience: [
        {
            id: '1',
            jobTitle: 'Senior Business Analyst',
            company: 'Global Corp',
            location: 'New York, NY',
            startDate: '2020-01-01',
            endDate: '',
            current: true,
            bulletPoints: [
                'Led a team of 5 analysts to deliver key insights that increased revenue by 15%.',
                'Streamlined reporting processes, reducing manual work by 30%.',
                'Collaborated with cross-functional teams to define project requirements and deliverables.'
            ]
        },
        {
            id: '2',
            jobTitle: 'Business Analyst',
            company: 'Tech Solutions Inc.',
            location: 'Boston, MA',
            startDate: '2017-06-01',
            endDate: '2019-12-31',
            current: false,
            bulletPoints: [
                'Conducted market research and competitor analysis to identify new business opportunities.',
                'Developed and maintained dashboards to track key performance indicators (KPIs).',
                'Assisted in the implementation of a new CRM system.'
            ]
        }
    ],
    education: [
        {
            id: '1',
            degree: 'Master of Business Administration (MBA)',
            institution: 'Harvard Business School',
            location: 'Boston, MA',
            graduationDate: '2017-05-01',
            bulletPoints: ['Focus on Strategy and Analytics']
        },
        {
            id: '2',
            degree: 'Bachelor of Science in Economics',
            institution: 'University of Chicago',
            location: 'Chicago, IL',
            graduationDate: '2015-05-01'
        }
    ],
    skills: [
        {
            id: '1',
            category: 'Analysis',
            skills: ['SQL', 'Tableau', 'Power BI', 'Excel', 'Python']
        },
        {
            id: '2',
            category: 'Management',
            skills: ['Agile', 'Scrum', 'Project Management', 'Strategic Planning']
        }
    ],
    projects: [],
    certifications: [],
    languages: [],
    customSections: []
};

const modernDummyData: ResumeData = {
    personalInfo: {
        name: 'Sarah Smith',
        email: 'sarah.smith@design.com',
        phone: '+1 (555) 987-6543',
        location: 'San Francisco, CA',
        summary: 'Creative UX/UI Designer with a passion for building user-centric digital products. Expertise in user research, wireframing, prototyping, and visual design. Dedicated to creating seamless and enjoyable user experiences.',
        profiles: [],
    },
    experience: [
        {
            id: '1',
            jobTitle: 'Lead Product Designer',
            company: 'Creative Studio',
            location: 'San Francisco, CA',
            startDate: '2021-03-01',
            endDate: '',
            current: true,
            bulletPoints: [
                'Spearheaded the redesign of the company\'s flagship mobile app, resulting in a 20% increase in user engagement.',
                'Mentored junior designers and established a unified design system.',
                'Conducted user testing sessions to gather feedback and iterate on designs.'
            ]
        },
        {
            id: '2',
            jobTitle: 'UX Designer',
            company: 'Web Innovators',
            location: 'Austin, TX',
            startDate: '2018-06-01',
            endDate: '2021-02-28',
            current: false,
            bulletPoints: [
                'Designed intuitive interfaces for web and mobile applications.',
                'Collaborated with developers to ensure accurate implementation of designs.',
                'Created user personas and journey maps to guide product decisions.'
            ]
        }
    ],
    education: [
        {
            id: '1',
            degree: 'Bachelor of Fine Arts in Interaction Design',
            institution: 'California College of the Arts',
            location: 'San Francisco, CA',
            graduationDate: '2018-05-01'
        }
    ],
    skills: [
        {
            id: '1',
            category: 'Design Tools',
            skills: ['Figma', 'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator']
        },
        {
            id: '2',
            category: 'Skills',
            skills: ['User Research', 'Prototyping', 'Wireframing', 'HTML/CSS']
        }
    ],
    projects: [
        {
            id: '1',
            name: 'E-commerce Redesign',
            description: 'Redesigned the checkout flow for a major e-commerce retailer, reducing cart abandonment by 15%.',
            technologies: ['Figma', 'User Testing'],
            link: 'https://portfolio.com/ecommerce'
        }
    ],
    certifications: [],
    languages: [],
    customSections: []
};

const developerDummyData: ResumeData = {
    personalInfo: {
        name: 'Alex Coder',
        email: 'alex.coder@dev.io',
        phone: '+1 (555) 555-0199',
        location: 'Seattle, WA',
        summary: 'Full Stack Developer with 4+ years of experience building scalable web applications. Proficient in JavaScript, React, Node.js, and cloud technologies. Passionate about writing clean, maintainable code and solving complex problems.',
        profiles: [
            {
                network: 'GitHub',
                username: 'alexcoder',
                url: 'https://github.com/alexcoder'
            },
            {
                network: 'LinkedIn',
                username: 'alexcoder',
                url: 'https://linkedin.com/in/alexcoder'
            }
        ],
    },
    experience: [
        {
            id: '1',
            jobTitle: 'Senior Software Engineer',
            company: 'Tech Giants',
            location: 'Seattle, WA',
            startDate: '2022-01-01',
            endDate: '',
            current: true,
            bulletPoints: [
                'Architected and built a microservices-based backend using Node.js and Kubernetes.',
                'Optimized frontend performance, achieving a 40% reduction in load times.',
                'Implemented CI/CD pipelines to automate testing and deployment.'
            ]
        },
        {
            id: '2',
            jobTitle: 'Software Developer',
            company: 'StartUp Inc',
            location: 'Remote',
            startDate: '2019-05-01',
            endDate: '2021-12-31',
            current: false,
            bulletPoints: [
                'Developed full-stack features for a SaaS platform using React and Python.',
                'Integrated third-party APIs for payment processing and email services.',
                'Participated in code reviews and daily stand-ups.'
            ]
        }
    ],
    education: [
        {
            id: '1',
            degree: 'Bachelor of Science in Computer Science',
            institution: 'University of Washington',
            location: 'Seattle, WA',
            graduationDate: '2019-06-01'
        }
    ],
    skills: [
        {
            id: '1',
            category: 'Languages',
            skills: ['JavaScript', 'TypeScript', 'Python', 'Go', 'Java']
        },
        {
            id: '2',
            category: 'Frameworks',
            skills: ['React', 'Next.js', 'Node.js', 'Express', 'Django']
        },
        {
            id: '3',
            category: 'Tools',
            skills: ['Git', 'Docker', 'Kubernetes', 'AWS', 'Linux']
        }
    ],
    projects: [
        {
            id: '1',
            name: 'Cloud Resume Challenge',
            description: 'Built a serverless resume website using AWS Lambda, API Gateway, and DynamoDB.',
            technologies: ['AWS', 'Python', 'Terraform'],
            link: 'https://github.com/alexcoder/cloud-resume'
        },
        {
            id: '2',
            name: 'Task Manager App',
            description: 'A real-time task management application with collaborative features.',
            technologies: ['React', 'Firebase', 'Tailwind CSS'],
            link: 'https://taskmanager.demo'
        }
    ],
    certifications: [
        {
            id: '1',
            name: 'AWS Certified Solutions Architect – Associate',
            issuer: 'Amazon Web Services',
            date: '2023-08-15',
            link: 'https://aws.amazon.com/verification'
        }
    ],
    languages: [],
    customSections: []
};

// --- Templates ---

// Template 1: Classic Professional
const classicTemplate: ResumeTemplate = {
    id: 'classic',
    name: 'Classic Professional',
    description: 'Clean and professional layout with centered header',
    preview: '/templates/classic-preview.png',
    dummyData: classicDummyData,
    generateLaTeX: (data: ResumeData) => {
        const { personalInfo, experience, education, skills, projects } = data;

        let latex = `\\documentclass[a4paper,12pt]{article}
\\usepackage{url}
\\usepackage{parskip}
\\usepackage[usenames,dvipsnames]{xcolor}
\\usepackage[scale=0.9]{geometry}
\\usepackage{tabularx}
\\usepackage{enumitem}
\\usepackage{titlesec}
\\usepackage[unicode, draft=false]{hyperref}

\\definecolor{linkcolour}{rgb}{0,0.2,0.6}
\\hypersetup{colorlinks,breaklinks,urlcolor=linkcolour,linkcolor=linkcolour}

\\newcolumntype{C}{>{\\centering\\arraybackslash}X}

\\titleformat{\\section}{\\Large\\scshape\\raggedright}{}{0em}{}[\\titlerule]
\\titlespacing{\\section}{0pt}{10pt}{10pt}

\\pagestyle{empty}

\\begin{document}

`;

        // Header
        if (personalInfo.name) {
            latex += `\\begin{tabularx}{\\linewidth}{@{} C @{}}
\\Huge{${escapeLaTeX(personalInfo.name)}} \\\\[7.5pt]
`;

            const contacts = [];
            if (personalInfo.email) contacts.push(`\\href{mailto:${escapeLaTeX(personalInfo.email)}}{${escapeLaTeX(personalInfo.email)}}`);
            if (personalInfo.phone) contacts.push(escapeLaTeX(personalInfo.phone));
            if (personalInfo.location) contacts.push(escapeLaTeX(personalInfo.location));

            if (personalInfo.profiles && personalInfo.profiles.length > 0) {
                personalInfo.profiles.forEach(profile => {
                    contacts.push(`\\href{${escapeLaTeX(profile.url)}}{${escapeLaTeX(profile.username || profile.network)}}`);
                });
            }

            if (contacts.length > 0) {
                latex += contacts.join(' $|$ ') + ' \\\\\\n';
            }

            latex += `\\end{tabularx}

`;
        }

        // Summary
        if (personalInfo.summary) {
            latex += `\\section{Summary}
${escapeLaTeX(personalInfo.summary)}

`;
        }

        // Experience
        if (experience.length > 0) {
            latex += `\\section{Work Experience}

`;
            experience.forEach((exp) => {
                const dateRange = `${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}`;
                latex += `\\begin{tabularx}{\\linewidth}{@{}l X r@{}}
\\textbf{${escapeLaTeX(exp.jobTitle)}} & \\hfill & ${dateRange} \\\\[3.75pt]
\\end{tabularx}
\\textit{${escapeLaTeX(exp.company)}}${exp.location ? ', ' + escapeLaTeX(exp.location) : ''}

`;
                if (exp.bulletPoints && exp.bulletPoints.length > 0) {
                    latex += `\\begin{itemize}[nosep,after=\\strut, leftmargin=1em, itemsep=3pt,label=--]
`;
                    exp.bulletPoints.forEach((bullet) => {
                        if (bullet.trim()) {
                            latex += `\\item ${escapeLaTeX(bullet)}\n`;
                        }
                    });
                    latex += `\\end{itemize}

`;
                }
            });
        }

        // Projects
        if (projects.length > 0) {
            latex += `\\section{Projects}

`;
            projects.forEach((proj) => {
                latex += `\\begin{tabularx}{\\linewidth}{ @{}l r@{} }
\\textbf{${escapeLaTeX(proj.name)}} & \\hfill ${proj.link ? `\\href{${escapeLaTeX(proj.link)}}{Link}` : ''} \\\\[3.75pt]
\\multicolumn{2}{@{}X@{}}{${escapeLaTeX(proj.description)}}  \\\\
\\end{tabularx}

`;
            });
        }

        // Education
        if (education.length > 0) {
            latex += `\\section{Education}
\\begin{tabularx}{\\linewidth}{@{}l X@{}}
`;
            education.forEach((edu) => {
                const dateStr = formatDate(edu.graduationDate) || 'Present';
                latex += `${dateStr} & ${escapeLaTeX(edu.degree)} at \\textbf{${escapeLaTeX(edu.institution)}} \\\\

`;
            });
            latex += `\\end{tabularx}

`;
        }

        // Skills
        if (skills.length > 0) {
            latex += `\\section{Skills}
\\begin{itemize}[leftmargin=*, label={}]
`;
            skills.forEach((skill) => {
                latex += `\\item \\textbf{${escapeLaTeX(skill.category)}:} ${skill.skills.map(escapeLaTeX).join(', ')}
`;
            });
            latex += `\\end{itemize}

`;
        }

        // Custom Sections
        if (data.customSections && data.customSections.length > 0) {
            data.customSections.forEach((section) => {
                latex += `\\section{${escapeLaTeX(section.title)}}
\\begin{itemize}[nosep,after=\\strut, leftmargin=1em, itemsep=3pt,label=--]
`;
                section.items.forEach((item) => {
                    if (item.trim()) {
                        latex += `\\item ${escapeLaTeX(item)}\n`;
                    }
                });
                latex += `\\end{itemize}

`;
            });
        }

        latex += `\\end{document}`;
        return latex;
    }
};

// Template 2: Modern Compact
const modernCompactTemplate: ResumeTemplate = {
    id: 'modern-compact',
    name: 'Modern Compact',
    description: 'Compact layout optimized for single-page resumes',
    preview: '/templates/modern-preview.png',
    dummyData: modernDummyData,
    generateLaTeX: (data: ResumeData) => {
        const { personalInfo, experience, education, skills, projects, certifications } = data;

        let latex = `\\documentclass[10pt, letterpaper]{article}

\\usepackage[
    top=0.8 cm,
    bottom=0.8 cm,
    left=1.2 cm,
    right=1.2 cm,
]{geometry}
\\usepackage{titlesec, tabularx, array, enumitem, hyperref}
\\usepackage[dvipsnames]{xcolor}

\\linespread{1.02}
\\raggedright
\\pagestyle{empty}
\\setlength{\\parindent}{0pt}

\\titleformat{\\section}{\\bfseries\\large}{}{0pt}{}[\\vspace{-2pt}\\titlerule]
\\titlespacing{\\section}{-1pt}{7pt}{4pt}

\\setlist[itemize]{leftmargin=*,itemsep=1pt,topsep=1pt}

\\begin{document}

`;

        // Header
        if (personalInfo.name) {
            latex += `\\begin{center}
    \\fontsize{20pt}{20pt}\\selectfont \\textbf{${escapeLaTeX(personalInfo.name)}}\\\\
    \\vspace{4pt}
    \\footnotesize
`;

            const contacts = [];
            if (personalInfo.location) contacts.push(escapeLaTeX(personalInfo.location));
            if (personalInfo.email) contacts.push(`\\href{mailto:${escapeLaTeX(personalInfo.email)}}{${escapeLaTeX(personalInfo.email)}}`);
            if (personalInfo.phone) contacts.push(`\\href{tel:${escapeLaTeX(personalInfo.phone)}}{${escapeLaTeX(personalInfo.phone)}}`);

            if (personalInfo.profiles && personalInfo.profiles.length > 0) {
                personalInfo.profiles.forEach(profile => {
                    contacts.push(`\\href{${escapeLaTeX(profile.url)}}{${escapeLaTeX(profile.username || profile.network)}}`);
                });
            }

            if (contacts.length > 0) {
                latex += '    ' + contacts.join(' $|$ ') + '\n';
            }

            latex += `\\end{center}

`;
        }

        // Summary
        if (personalInfo.summary) {
            latex += `\\section{Professional Summary}
${escapeLaTeX(personalInfo.summary)}

`;
        }

        // Education
        if (education.length > 0) {
            latex += `\\section{Education}
`;
            education.forEach((edu) => {
                const dateStr = formatDate(edu.graduationDate) || 'Present';
                latex += `\\textbf{${escapeLaTeX(edu.institution)}} — ${escapeLaTeX(edu.degree)} \\hfill ${dateStr}

`;
            });
        }

        // Skills
        if (skills.length > 0) {
            latex += `\\section{Technical Skills}
`;
            skills.forEach((skill) => {
                latex += `\\textbf{${escapeLaTeX(skill.category)}:} ${skill.skills.map(escapeLaTeX).join(', ')} \\\\
`;
            });
            latex += '\n';
        }

        // Experience
        if (experience.length > 0) {
            latex += `\\section{Professional Experience}
`;
            experience.forEach((exp) => {
                const dateRange = `${formatDate(exp.startDate)} – ${exp.current ? 'Present' : formatDate(exp.endDate)}`;
                latex += `\\textbf{${escapeLaTeX(exp.jobTitle)}} \\hfill ${dateRange}
`;
                if (exp.bulletPoints && exp.bulletPoints.length > 0) {
                    latex += `\\begin{itemize}
`;
                    exp.bulletPoints.forEach((bullet) => {
                        if (bullet.trim()) {
                            latex += `    \\item ${escapeLaTeX(bullet)}\n`;
                        }
                    });
                    latex += `\\end{itemize}

`;
                }
            });
        }

        // Projects
        if (projects.length > 0) {
            latex += `\\section{Key Projects}
`;
            projects.forEach((proj) => {
                const techStr = proj.technologies.length > 0 ? ` \\hfill \\textit{Tech: ${proj.technologies.map(escapeLaTeX).join(', ')}}` : '';
                latex += `\\textbf{${escapeLaTeX(proj.name)}}${techStr}
${escapeLaTeX(proj.description)}

`;
            });
        }

        // Certifications
        if (certifications.length > 0) {
            latex += `\\section{Certifications}
`;
            certifications.forEach((cert) => {
                const dateStr = cert.date ? ` \\hfill ${formatDate(cert.date)}` : '';
                latex += `\\textbf{${escapeLaTeX(cert.name)}}${dateStr}

`;
            });
        }

        // Custom Sections
        if (data.customSections && data.customSections.length > 0) {
            data.customSections.forEach((section) => {
                latex += `\\section{${escapeLaTeX(section.title)}}
\\begin{itemize}
`;
                section.items.forEach((item) => {
                    if (item.trim()) {
                        latex += `    \\item ${escapeLaTeX(item)}\n`;
                    }
                });
                latex += `\\end{itemize}

`;
            });
        }

        latex += `\\end{document}`;
        return latex;
    }
};

// Template 3: Developer Resume
const developerTemplate: ResumeTemplate = {
    id: 'developer',
    name: 'Developer Resume',
    description: 'Optimized for software developers and engineers',
    preview: '/templates/developer-preview.png',
    dummyData: developerDummyData,
    generateLaTeX: (data: ResumeData) => {
        const { personalInfo, experience, education, skills, projects, certifications } = data;

        let latex = `\\documentclass[a4paper,11pt]{article}

\\usepackage[usenames,dvipsnames]{xcolor}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage{tabularx}
\\usepackage[margin=0.5in]{geometry}
\\usepackage[hidelinks]{hyperref}

\\pagestyle{empty}
\\setlength{\\tabcolsep}{0in}

\\raggedbottom
\\raggedright

\\definecolor{sectioncolor}{RGB}{65,105,225}

\\titleformat{\\section}{\\scshape\\large\\color{sectioncolor}}{}{0em}{}[\\color{black}\\titlerule\\vspace{0pt}]

\\begin{document}

`;

        // Contact Details
        if (personalInfo.name) {
            latex += `\\begin{tabular*}{\\textwidth}{l@{\\extracolsep{\\fill}}r}
  \\textbf{\\Huge ${escapeLaTeX(personalInfo.name)} \\vspace{2pt}} &
  ${personalInfo.location ? `Location: ${escapeLaTeX(personalInfo.location)}` : ''} \\\\
`;

            const links = [];
            if (personalInfo.email) links.push(`Email: \\href{mailto:${escapeLaTeX(personalInfo.email)}}{${escapeLaTeX(personalInfo.email)}}`);
            if (personalInfo.phone) links.push(`Mobile: ${escapeLaTeX(personalInfo.phone)}`);

            if (personalInfo.profiles && personalInfo.profiles.length > 0) {
                personalInfo.profiles.forEach(profile => {
                    links.push(`${escapeLaTeX(profile.network)}: \\href{${escapeLaTeX(profile.url)}}{${escapeLaTeX(profile.username)}}`);
                });
            }

            if (links.length > 0) {
                latex += '  & ' + links.join(' $|$ ') + ' \\\\\n';
            }

            latex += `\\end{tabular*}

`;
        }

        // Summary
        if (personalInfo.summary) {
            latex += `\\section{Professional Summary}
\\small{
  ${escapeLaTeX(personalInfo.summary)}
}

`;
        }

        // Skills
        if (skills.length > 0) {
            latex += `\\section{Technical Skills}
\\begin{itemize}[leftmargin=0.15in, label={}]
`;
            skills.forEach((skill) => {
                latex += `  \\item\\begin{tabular*}{0.96\\textwidth}[t]{
    p{0.15\\linewidth}p{0.02\\linewidth}p{0.81\\linewidth}
  }
    \\textbf{${escapeLaTeX(skill.category)}} & : & ${skill.skills.map(escapeLaTeX).join(', ')}
  \\end{tabular*}\\vspace{-2pt}
`;
            });
            latex += `\\end{itemize}

`;
        }

        // Experience
        if (experience.length > 0) {
            latex += `\\section{Experience}
\\begin{itemize}[leftmargin=0.15in, label={}]
`;
            experience.forEach((exp) => {
                const dateRange = `${formatDate(exp.startDate)} -- ${exp.current ? 'Present' : formatDate(exp.endDate)}`;
                latex += `  \\item
  \\begin{tabular*}{0.96\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
    \\textbf{${escapeLaTeX(exp.jobTitle)}} & ${dateRange} \\\\
    \\textit{\\small${escapeLaTeX(exp.company)}} & \\textit{\\small ${escapeLaTeX(exp.location || '')}} \\\\
  \\end{tabular*}
`;
                if (exp.bulletPoints && exp.bulletPoints.length > 0) {
                    latex += `    \\begin{itemize}
`;
                    exp.bulletPoints.forEach((bullet) => {
                        if (bullet.trim()) {
                            latex += `      \\item\\small{${escapeLaTeX(bullet)}}\n`;
                        }
                    });
                    latex += `    \\end{itemize}
`;
                }
            });
            latex += `\\end{itemize}

`;
        }

        // Education
        if (education.length > 0) {
            latex += `\\section{Education}
  \\begin{itemize}[leftmargin=0.15in, label={}]
`;
            education.forEach((edu) => {
                const dateStr = formatDate(edu.graduationDate) || 'Present';
                latex += `    \\item
    \\begin{tabular*}{0.96\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{${escapeLaTeX(edu.institution)}} & ${escapeLaTeX(edu.location || '')} \\\\
      \\textit{\\small${escapeLaTeX(edu.degree)}} & \\textit{\\small ${dateStr}} \\\\
    \\end{tabular*}
`;
            });
            latex += `  \\end{itemize}

`;
        }

        // Projects
        if (projects.length > 0) {
            latex += `\\section{Projects}
  \\begin{itemize}[leftmargin=0.15in, label={}]
`;
            projects.forEach((proj) => {
                const techStr = proj.technologies.length > 0 ? proj.technologies.map(escapeLaTeX).join(', ') : '';
                latex += `    \\item\\small{
    \\begin{tabular*}{0.96\\textwidth}[t]{
      l@{\\extracolsep{\\fill}}r
    }
      \\textbf{${escapeLaTeX(proj.name)}} & ${techStr}
    \\end{tabular*}
  }
      \\begin{itemize}
        \\item\\small{${escapeLaTeX(proj.description)}}
      \\end{itemize}
`;
            });
            latex += `  \\end{itemize}

`;
        }

        // Certifications
        if (certifications.length > 0) {
            latex += `\\section{Certifications}
  \\begin{itemize}
`;
            certifications.forEach((cert) => {
                latex += `    \\item\\small{\\textbf{${escapeLaTeX(cert.name)}}${cert.issuer ? ` - ${escapeLaTeX(cert.issuer)}` : ''}}\n`;
            });
            latex += `  \\end{itemize}

`;
        }

        // Custom Sections
        if (data.customSections && data.customSections.length > 0) {
            data.customSections.forEach((section) => {
                latex += `\\section{${escapeLaTeX(section.title)}}
  \\begin{itemize}
`;
                section.items.forEach((item) => {
                    if (item.trim()) {
                        latex += `    \\item\\small{${escapeLaTeX(item)}}\n`;
                    }
                });
                latex += `  \\end{itemize}

`;
            });
        }

        latex += `\\end{document}`;
        return latex;
    }
};

export const templates: ResumeTemplate[] = [
    classicTemplate,
    modernCompactTemplate,
    developerTemplate,
];

export function getTemplateById(id: string): ResumeTemplate | undefined {
    return templates.find(t => t.id === id);
}
