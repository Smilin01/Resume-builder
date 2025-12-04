import { ResumeData, ResumeTemplate } from '../types/resume';
import { glacialTemplate } from './glacialTemplate';
import { escapeLaTeX, formatDate } from '../utils/latexUtils';

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

        // Contact Details - Fixed Header Layout
        if (personalInfo.name) {
            // Name centered at top
            latex += `\\begin{center}
  \\textbf{\\Huge ${escapeLaTeX(personalInfo.name)}}
\\end{center}
\\vspace{2pt}

`;

            // Contact information in a single line, centered
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
                latex += `\\begin{center}
  \\small{${contacts.join(' $|$ ')}}
\\end{center}

`;
            }
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

// Template 4: Minimalist Tech
const minimalistTemplate: ResumeTemplate = {
    id: 'minimalist',
    name: 'Minimalist Tech',
    description: 'Clean, distraction-free layout for modern tech roles',
    preview: '/templates/minimalist-preview.png',
    dummyData: developerDummyData,
    generateLaTeX: (data: ResumeData) => {
        const { personalInfo, experience, education, skills, projects } = data;
        let latex = `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage{tabularx}

\\pagestyle{fancy}
\\fancyhf{} 
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\begin{document}

`;
        // Header
        if (personalInfo.name) {
            latex += `\\begin{center}
    \\textbf{\\Huge \\scshape ${escapeLaTeX(personalInfo.name)}} \\\\ \\vspace{1pt}
    \\small ${escapeLaTeX(personalInfo.phone || '')} $|$ \\href{mailto:${escapeLaTeX(personalInfo.email || '')}}{\\underline{${escapeLaTeX(personalInfo.email || '')}}} $|$ 
    \\href{${escapeLaTeX(personalInfo.profiles?.[0]?.url || '')}}{\\underline{${escapeLaTeX(personalInfo.profiles?.[0]?.username || 'LinkedIn')}}} $|$
    \\href{${escapeLaTeX(personalInfo.profiles?.[1]?.url || '')}}{\\underline{${escapeLaTeX(personalInfo.profiles?.[1]?.username || 'GitHub')}}}
\\end{center}
`;
        }

        // Education
        if (education.length > 0) {
            latex += `\\section{Education}
\\resumeSubHeadingListStart
`;
            education.forEach(edu => {
                latex += `\\resumeSubheading
      {${escapeLaTeX(edu.institution)}}{${escapeLaTeX(edu.location || '')}}
      {${escapeLaTeX(edu.degree)}}{${formatDate(edu.graduationDate)}}
`;
            });
            latex += `\\resumeSubHeadingListEnd
`;
        }

        // Experience
        if (experience.length > 0) {
            latex += `\\section{Experience}
\\resumeSubHeadingListStart
`;
            experience.forEach(exp => {
                latex += `\\resumeSubheading
      {${escapeLaTeX(exp.jobTitle)}}{${formatDate(exp.startDate)} -- ${exp.current ? 'Present' : formatDate(exp.endDate)}}
      {${escapeLaTeX(exp.company)}}{${escapeLaTeX(exp.location || '')}}
      \\resumeItemListStart
`;
                exp.bulletPoints.forEach(bp => {
                    latex += `        \\resumeItem{${escapeLaTeX(bp)}}
`;
                });
                latex += `      \\resumeItemListEnd
`;
            });
            latex += `\\resumeSubHeadingListEnd
`;
        }

        // Projects
        if (projects.length > 0) {
            latex += `\\section{Projects}
\\resumeSubHeadingListStart
`;
            projects.forEach(proj => {
                latex += `\\resumeProjectHeading
      {\\textbf{${escapeLaTeX(proj.name)}} $|$ \\emph{${proj.technologies.map(escapeLaTeX).join(', ')}}}{${proj.link ? `\\href{${escapeLaTeX(proj.link)}}{Link}` : ''}}
      \\resumeItemListStart
        \\resumeItem{${escapeLaTeX(proj.description)}}
      \\resumeItemListEnd
`;
            });
            latex += `\\resumeSubHeadingListEnd
`;
        }

        // Skills
        if (skills.length > 0) {
            latex += `\\section{Technical Skills}
\\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
`;
            skills.forEach(skill => {
                latex += `     \\textbf{${escapeLaTeX(skill.category)}}{: ${skill.skills.map(escapeLaTeX).join(', ')}} \\\\
`;
            });
            latex += `    }}
\\end{itemize}
`;
        }

        latex += `\\end{document}`;

        // Add custom commands definition at the start
        const customCommands = `
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}
\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}
\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}
\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}
\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}
\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}
`;
        return latex.replace('\\begin{document}', customCommands + '\\begin{document}');
    }
};





// Template 7: Creative Modern
const creativeTemplate: ResumeTemplate = {
    id: 'creative',
    name: 'Creative Modern',
    description: 'Stylish layout with color accents for creative pros',
    preview: '/templates/creative-preview.png',
    dummyData: modernDummyData,
    generateLaTeX: (data: ResumeData) => {
        const { personalInfo, experience, education, skills } = data;
        let latex = `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{lato}
\\usepackage{geometry}
\\geometry{top=0.6in, bottom=0.6in, left=0.6in, right=0.6in}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage{xcolor}
\\usepackage{hyperref}

\\definecolor{accent}{RGB}{139, 92, 246} % Violet accent

\\titleformat{\\section}
  {\\color{accent}\\Large\\bfseries\\uppercase}
  {}{0em}
  {}
  [\\titlerule]

\\begin{document}

`;
        // Header
        if (personalInfo.name) {
            latex += `\\begin{center}
    {\\color{accent}\\Huge \\textbf{${escapeLaTeX(personalInfo.name)}}} \\\\[0.2cm]
    \\small ${escapeLaTeX(personalInfo.location || '')} $\\cdot$ ${escapeLaTeX(personalInfo.phone || '')} $\\cdot$ \\href{mailto:${escapeLaTeX(personalInfo.email || '')}}{${escapeLaTeX(personalInfo.email || '')}}
\\end{center}
\\vspace{0.5cm}
`;
        }

        // Summary
        if (personalInfo.summary) {
            latex += `\\section*{Profile}
\\vspace{0.2cm}
${escapeLaTeX(personalInfo.summary)}
\\vspace{0.5cm}
`;
        }

        // Experience
        if (experience.length > 0) {
            latex += `\\section*{Experience}
\\vspace{0.2cm}
`;
            experience.forEach(exp => {
                latex += `\\noindent {\\color{accent}\\textbf{${escapeLaTeX(exp.jobTitle)}}} \\hfill ${formatDate(exp.startDate)} -- ${exp.current ? 'Present' : formatDate(exp.endDate)} \\\\
\\textbf{${escapeLaTeX(exp.company)}} \\hfill ${escapeLaTeX(exp.location || '')}
\\begin{itemize}[noitemsep,topsep=0pt]
`;
                exp.bulletPoints.forEach(bp => {
                    latex += `    \\item ${escapeLaTeX(bp)}
`;
                });
                latex += `\\end{itemize}
\\vspace{0.3cm}
`;
            });
        }

        // Education
        if (education.length > 0) {
            latex += `\\section*{Education}
\\vspace{0.2cm}
`;
            education.forEach(edu => {
                latex += `\\noindent {\\color{accent}\\textbf{${escapeLaTeX(edu.degree)}}} \\\\
${escapeLaTeX(edu.institution)} \\hfill ${formatDate(edu.graduationDate)}
\\vspace{0.2cm}
`;
            });
        }

        // Skills
        if (skills.length > 0) {
            latex += `\\section*{Skills}
\\vspace{0.2cm}
\\begin{itemize}[noitemsep]
`;
            skills.forEach(skill => {
                latex += `\\item \\textbf{${escapeLaTeX(skill.category)}}: ${skill.skills.map(escapeLaTeX).join(', ')}
`;
            });
            latex += `\\end{itemize}
`;
        }

        latex += `\\end{document}`;
        return latex;
    }
};

// Template 8: Entry Level
const entryTemplate: ResumeTemplate = {
    id: 'entry',
    name: 'Entry Level',
    description: 'Optimized for students and fresh graduates',
    preview: '/templates/entry-preview.png',
    dummyData: modernDummyData,
    generateLaTeX: (data: ResumeData) => {
        const { personalInfo, experience, education, skills, projects } = data;
        let latex = `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\geometry{top=1in, bottom=1in, left=1in, right=1in}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage{hyperref}

\\titleformat{\\section}
  {\\large\\bfseries\\uppercase}
  {}{0em}
  {}
  [\\titlerule]

\\begin{document}

`;
        // Header
        if (personalInfo.name) {
            latex += `\\begin{center}
    {\\Huge \\textbf{${escapeLaTeX(personalInfo.name)}}} \\\\[0.2cm]
    ${escapeLaTeX(personalInfo.location || '')} \\ \\textbullet \\ ${escapeLaTeX(personalInfo.phone || '')} \\ \\textbullet \\ \\href{mailto:${escapeLaTeX(personalInfo.email || '')}}{${escapeLaTeX(personalInfo.email || '')}}
\\end{center}
\\vspace{0.5cm}
`;
        }

        // Education (First for Entry Level)
        if (education.length > 0) {
            latex += `\\section*{EDUCATION}
\\vspace{0.2cm}
`;
            education.forEach(edu => {
                latex += `\\noindent \\textbf{${escapeLaTeX(edu.institution)}} \\hfill ${escapeLaTeX(edu.location || '')} \\\\
${escapeLaTeX(edu.degree)} \\hfill ${formatDate(edu.graduationDate)}
\\vspace{0.2cm}
`;
            });
        }

        // Skills
        if (skills.length > 0) {
            latex += `\\section*{SKILLS}
\\vspace{0.2cm}
\\begin{itemize}[noitemsep]
`;
            skills.forEach(skill => {
                latex += `\\item \\textbf{${escapeLaTeX(skill.category)}}: ${skill.skills.map(escapeLaTeX).join(', ')}
`;
            });
            latex += `\\end{itemize}
\\vspace{0.3cm}
`;
        }

        // Projects
        if (projects.length > 0) {
            latex += `\\section*{PROJECTS}
\\vspace{0.2cm}
`;
            projects.forEach(proj => {
                latex += `\\noindent \\textbf{${escapeLaTeX(proj.name)}} \\\\
${escapeLaTeX(proj.description)}
\\vspace{0.2cm}
`;
            });
        }

        // Experience
        if (experience.length > 0) {
            latex += `\\section*{EXPERIENCE}
\\vspace{0.2cm}
`;
            experience.forEach(exp => {
                latex += `\\noindent \\textbf{${escapeLaTeX(exp.company)}} \\hfill ${escapeLaTeX(exp.location || '')} \\\\
\\textit{${escapeLaTeX(exp.jobTitle)}} \\hfill ${formatDate(exp.startDate)} -- ${exp.current ? 'Present' : formatDate(exp.endDate)}
\\begin{itemize}[noitemsep,topsep=0pt]
`;
                exp.bulletPoints.forEach(bp => {
                    latex += `    \\item ${escapeLaTeX(bp)}
`;
                });
                latex += `\\end{itemize}
\\vspace{0.3cm}
`;
            });
        }

        latex += `\\end{document}`;
        return latex;
    }
};

// Template 9: Modern Malta
const maltaTemplate: ResumeTemplate = {
    id: 'malta',
    name: 'Modern Malta',
    description: 'Vibrant layout with colored headers and multi-column sections',
    preview: '/templates/malta-preview.png',
    dummyData: modernDummyData,
    generateLaTeX: (data: ResumeData) => {
        const { personalInfo, experience, education, skills, projects } = data;
        let latex = `\\documentclass[a4paper,10pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{tgheros}
\\renewcommand*\\familydefault{\\sfdefault}
\\usepackage[margin=1in, top=0.8in, bottom=0.8in]{geometry}
\\usepackage{xcolor}
\\usepackage{titlesec}
\\usepackage{fontawesome5}
\\usepackage{hyperref}
\\usepackage{multicol}
\\usepackage{enumitem}
\\usepackage{calc}

\\definecolor{flame}{HTML}{D14900}
\\definecolor{raisinblack}{HTML}{2D2D2D}

\\titleformat{\\section}{\\Large\\bfseries\\color{flame}\\uppercase}{}{0em}{}[\\color{flame}\\titlerule]
\\titlespacing*{\\section}{0pt}{12pt}{8pt}

\\newcommand{\\cvsection}[1]{\\section*{#1}}

\\begin{document}

`;
        // Header
        if (personalInfo.name) {
            latex += `{\\Huge\\bfseries\\color{raisinblack} ${escapeLaTeX(personalInfo.name)}} \\\\[0.2cm]
${personalInfo.summary ? `{\\large\\itshape\\color{raisinblack} ${escapeLaTeX(personalInfo.summary.split('.')[0])}} \\\\[0.3cm]` : ''}
${personalInfo.summary ? `\\small\\color{raisinblack} ${escapeLaTeX(personalInfo.summary)} \\\\[0.5cm]` : ''}

% Contact Bar
\\noindent\\colorbox{flame}{\\makebox[\\textwidth][c]{\\color{white}
    ${personalInfo.email ? `\\faEnvelope\\ ${escapeLaTeX(personalInfo.email)} \\quad` : ''}
    ${personalInfo.phone ? `\\faPhone\\ ${escapeLaTeX(personalInfo.phone)} \\quad` : ''}
    ${personalInfo.location ? `\\faMapMarker\\ ${escapeLaTeX(personalInfo.location)} \\quad` : ''}
    ${personalInfo.profiles?.map(p => `\\faGlobe\\ \\href{${escapeLaTeX(p.url)}}{${escapeLaTeX(p.username)}}`).join(' \\quad ') || ''}
}}
\\vspace{0.5cm}
`;
        }

        // Skills (Multi-column)
        if (skills.length > 0) {
            latex += `\\cvsection{Skills}
\\begin{multicols}{2}
\\begin{itemize}[noitemsep,label=\\textbullet]
`;
            skills.forEach(skill => {
                latex += `\\item \\textbf{${escapeLaTeX(skill.category)}}: ${skill.skills.map(escapeLaTeX).join(', ')}
`;
            });
            latex += `\\end{itemize}
\\end{multicols}
`;
        }

        // Education
        if (education.length > 0) {
            latex += `\\cvsection{Education}
`;
            education.forEach(edu => {
                latex += `\\noindent \\textbf{${escapeLaTeX(edu.institution)}} \\hfill ${formatDate(edu.graduationDate)} \\\\
\\textbf{${escapeLaTeX(edu.degree)}} \\hfill ${escapeLaTeX(edu.location || '')}
\\vspace{0.2cm}
`;
            });
        }

        // Experience
        if (experience.length > 0) {
            latex += `\\cvsection{Experience}
`;
            experience.forEach(exp => {
                latex += `\\noindent \\textbf{${escapeLaTeX(exp.jobTitle)}} \\hfill ${formatDate(exp.startDate)} -- ${exp.current ? 'Present' : formatDate(exp.endDate)} \\\\
\\textbf{${escapeLaTeX(exp.company)}} \\hfill ${escapeLaTeX(exp.location || '')}
\\begin{itemize}[noitemsep,topsep=0pt]
`;
                exp.bulletPoints.forEach(bp => {
                    latex += `    \\item ${escapeLaTeX(bp)}
`;
                });
                latex += `\\end{itemize}
\\vspace{0.3cm}
`;
            });
        }

        // Projects
        if (projects.length > 0) {
            latex += `\\cvsection{Projects}
`;
            projects.forEach(proj => {
                latex += `\\noindent \\textbf{${escapeLaTeX(proj.name)}} \\\\
${escapeLaTeX(proj.description)}
\\vspace{0.2cm}
`;
            });
        }

        latex += `\\end{document}`;
        return latex;
    }
};


// Template 10: LuxSleek CV
const luxSleekDummyData: ResumeData = {
    personalInfo: {
        name: 'Guillaume Ouancaux',
        email: 'wonky.william123@gmail.com',
        phone: '+352 123 456 789',
        location: '49 Paddocks Spring, Farthingtonshire SG2 9UD, UK',
        summary: 'Innovative and passionate data analyst with over 15 years of experience in the chocolate and confectionery industry, seeking to leverage extensive background in data analysis, flavour profiling, and market trends. Proficient in Python programming, I have successfully developed and maintained multiple scalable and efficient software applications.',
        profiles: [
            {
                network: 'GitHub',
                username: 'github.com/WillyWonka',
                url: 'https://github.com/WillyWonka'
            }
        ],
    },
    experience: [
        {
            id: '1',
            jobTitle: 'Senior Data Scientist',
            company: 'Shockelasrull (Luxembourg)',
            location: '',
            startDate: '2021-04-01',
            endDate: '',
            current: true,
            bulletPoints: [
                'Natural language processing, topic modelling, olfactory analysis, building chained processes, automation of reports.'
            ]
        },
        {
            id: '2',
            jobTitle: 'Data Scientist',
            company: 'Chocky-Facky SA (United Kingdom)',
            location: '',
            startDate: '2019-02-01',
            endDate: '2020-11-01',
            current: false,
            bulletPoints: [
                'Predictive models for consumer taste preferences, market trend analysis, advanced data visualisation, negotiations with stakeholders.'
            ]
        },
        {
            id: '3',
            jobTitle: 'Data Analyst',
            company: 'Chocolate River Factory (France)',
            location: '',
            startDate: '2018-02-01',
            endDate: '2018-12-01',
            current: false,
            bulletPoints: [
                'Data collection processes, extensive research on carbonation levels, collaboration with product development teams.'
            ]
        }
    ],
    education: [
        {
            id: '1',
            degree: 'Master in Economics',
            institution: 'University of Sweets and Treats',
            location: '',
            graduationDate: '2015-06-01',
            bulletPoints: [
                'Mathematical Methods of Economic Analysis.',
                'Thesis title: The Effect of Beverage Sugar Content on Their Shelf Life.',
                'Econometric analysis, survival analysis, panel and time-series models.'
            ]
        },
        {
            id: '2',
            degree: 'Bachelor of Science in Biology',
            institution: 'Bolzmann State Technical University',
            location: '',
            graduationDate: '2010-06-01',
            bulletPoints: [
                'Faculty of Experimental Confectionery.',
                'Mathematical modelling, numerical methods, mathematical optimisation.'
            ]
        }
    ],
    skills: [
        {
            id: '1',
            category: 'Technical',
            skills: ['Python', 'SQL', 'PySpark', 'R', 'Matlab', 'Azure Databricks']
        },
        {
            id: '2',
            category: 'Office',
            skills: ['MS Word', 'Excel', 'PowerPoint']
        },
        {
            id: '3',
            category: 'Soft Skills',
            skills: ['Communication', 'Team collaboration']
        }
    ],
    projects: [],
    certifications: [
        {
            id: '1',
            name: 'Stanford introduction to food and health',
            issuer: 'Coursera',
            date: '2021-01-01',
            link: ''
        }
    ],
    languages: [
        { id: '1', language: 'French', proficiency: 'Professional' },
        { id: '2', language: 'Luxembourgish', proficiency: 'Basic' },
        { id: '3', language: 'German', proficiency: 'Basic' },
        { id: '4', language: 'English', proficiency: 'Native' }
    ],
    customSections: [
        {
            id: '1',
            title: 'Hobbies',
            items: [
                'Music: imitating birds on the banjo, composing and decomposing (morally).',
                'Poetry: inventing rhymes, surreal art.',
                'Miscellaneous: zoology, mycology, trainspotting, 1930s horror films.'
            ]
        }
    ]
};

const luxSleekTemplate: ResumeTemplate = {
    id: 'lux-sleek',
    name: 'LuxSleek CV',
    description: 'Elegant two-column layout with blue accents',
    preview: '/templates/lux-sleek-preview.jpg',
    dummyData: luxSleekDummyData,
    generateLaTeX: (data: ResumeData) => {
        const { personalInfo, experience, education, skills, certifications, languages, customSections } = data;

        // Helper to format date as YYYY.MM
        const formatLuxDate = (dateStr: string) => {
            if (!dateStr) return '';
            try {
                const d = new Date(dateStr);
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                return `${year}.${month}`;
            } catch {
                return dateStr;
            }
        };

        let latex = `\\documentclass[11pt, a4paper]{article} 

\\usepackage[T1]{fontenc}     
\\usepackage[utf8]{inputenc}  
\\usepackage[british]{babel}  
\\usepackage[left = 0mm, right = 0mm, top = 0mm, bottom = 0mm]{geometry}
\\usepackage[stretch = 25, shrink = 25, tracking=true, letterspace=30]{microtype}  
\\usepackage{graphicx}        
\\usepackage{xcolor}          
\\usepackage{marvosym}        

\\usepackage{enumitem}        
\\setlist{parsep = 0pt, topsep = 0pt, partopsep = 1pt, itemsep = 1pt, leftmargin = 6mm}

\\usepackage{FiraSans}        
\\renewcommand{\\familydefault}{\\sfdefault}

\\definecolor{cvblue}{HTML}{304263}

%%%%%%% USER COMMAND DEFINITIONS %%%%%%%%%%%%%%%%%%%%%%%%%%%
\\newcommand{\\dates}[1]{\\hfill\\mbox{\\textbf{#1}}} 
\\newcommand{\\is}{\\par\\vskip.5ex plus .4ex} 
\\newcommand{\\smaller}[1]{{\\small$\\diamond$\\ #1}}
\\newcommand{\\headleft}[1]{\\vspace*{3ex}\\textsc{\\textbf{#1}}\\par%
    \\vspace*{-1.5ex}\\hrulefill\\par\\vspace*{0.7ex}}
\\newcommand{\\headright}[1]{\\vspace*{2.5ex}\\textsc{\\Large\\color{cvblue}#1}\\par%
     \\vspace*{-2ex}{\\color{cvblue}\\hrulefill}\\par}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\usepackage[colorlinks = true, urlcolor = white, linkcolor = white]{hyperref}

\\begin{document}

\\setlength{\\topskip}{0pt}
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{0pt}
\\setlength{\\fboxsep}{0pt}
\\pagestyle{empty}
\\raggedbottom

\\begin{minipage}[t]{0.33\\textwidth} 
\\colorbox{cvblue}{\\begin{minipage}[t][5mm][t]{\\textwidth}\\null\\hfill\\null\\end{minipage}}

\\vspace{-.2ex} 
\\colorbox{cvblue!90}{\\color{white}  
\\kern0.09\\textwidth\\relax
\\begin{minipage}[t][293mm][t]{0.82\\textwidth}
\\raggedright
\\vspace*{2.5ex}

\\Large ${escapeLaTeX(personalInfo.name)} \\normalsize 

% Placeholder for image if we had one
% \\null\\hfill\\includegraphics[width=0.65\\textwidth]{oval-transparent.png}\\hfill\\null
\\vspace*{2.5ex}

\\headleft{Profile}
${escapeLaTeX(personalInfo.summary)}

\\headleft{Contact details}
\\small 
`;

        if (personalInfo.email) latex += `\\MVAt\\ {\\small \\href{mailto:${escapeLaTeX(personalInfo.email)}}{${escapeLaTeX(personalInfo.email)}}} \\\\[0.4ex]\n`;
        if (personalInfo.phone) latex += `\\Mobilefone\\ ${escapeLaTeX(personalInfo.phone)} \\\\[0.5ex]\n`;
        personalInfo.profiles?.forEach(p => {
            latex += `\\Mundus\\ \\href{${escapeLaTeX(p.url)}}{${escapeLaTeX(p.username)}} \\\\[0.1ex]\n`;
        });
        if (personalInfo.location) latex += `\\Letter\\ ${escapeLaTeX(personalInfo.location)}\n`;

        latex += `\\normalsize

\\headleft{Personal information}
`;
        // Mapping languages to Personal Information section as per template style
        if (languages && languages.length > 0) {
            latex += `Languages: \\textbf{${languages.map(l => escapeLaTeX(`${l.language} (${l.proficiency})`)).join(', ')}} \\\\[0.5ex]\n`;
        }

        // Add custom sections that might fit in the left column (short ones)
        // For now, we'll put Skills here as per template
        if (skills.length > 0) {
            latex += `
\\headleft{Skills}
\\begin{itemize}
`;
            skills.forEach(skillGroup => {
                // Flatten skills for this template or list them by category?
                // Template uses simple itemize. Let's list all skills.
                skillGroup.skills.forEach(skill => {
                    latex += `\\item ${escapeLaTeX(skill)}\n`;
                });
            });
            latex += `\\end{itemize} 
`;
        }

        latex += `
\\end{minipage}%
\\kern0.09\\textwidth\\relax
}
\\end{minipage}% Right column
\\hskip2.5em% Left margin for the white area
\\begin{minipage}[t]{0.56\\textwidth}
\\setlength{\\parskip}{0.8ex}

\\vspace{2ex}

`;

        // Experience
        if (experience.length > 0) {
            latex += `\\headright{Experience}\n\n`;
            experience.forEach((exp, index) => {
                if (index > 0) latex += `\\is\n`;
                const dateRange = `${formatLuxDate(exp.startDate)}--${exp.current ? 'pres.' : formatLuxDate(exp.endDate)}`;
                latex += `\\textsc{${escapeLaTeX(exp.jobTitle)}} at \\textit{${escapeLaTeX(exp.company)}}.  \\dates{${dateRange}} \\\\
`;
                if (exp.bulletPoints && exp.bulletPoints.length > 0) {
                    latex += `\\smaller{${exp.bulletPoints.map(escapeLaTeX).join(' ')}}
`;
                }
            });
        }

        // Education
        if (education.length > 0) {
            latex += `\n\\headright{Education}\n\n`;
            education.forEach((edu, index) => {
                if (index > 0) latex += `\\is\n`;
                const dateRange = `${formatLuxDate(edu.graduationDate).split('.')[0]}--${formatLuxDate(edu.graduationDate).split('.')[0]}`; // Just years for education usually
                latex += `\\textsc{${escapeLaTeX(edu.degree)}.} ${escapeLaTeX(edu.institution)}. \\dates{${dateRange}} \\\\
`;
                if (edu.bulletPoints && edu.bulletPoints.length > 0) {
                    edu.bulletPoints.forEach(bp => {
                        latex += `\\smaller{${escapeLaTeX(bp)}} \\\\
`;
                    });
                }
            });
        }

        // Certifications as Additional Education
        if (certifications.length > 0) {
            latex += `\n\\headright{Additional education}\n\n`;
            certifications.forEach((cert, index) => {
                if (index > 0) latex += `\\is\n`;
                const dateStr = cert.date ? formatLuxDate(cert.date).split('.')[0] : '';
                latex += `\\textsc{${escapeLaTeX(cert.name)}.}
\\textit{${escapeLaTeX(cert.issuer)}}. \\dates{${dateStr}} \\\\
`;
            });
        }

        // Custom Sections (Hobbies etc)
        if (customSections && customSections.length > 0) {
            customSections.forEach(section => {
                latex += `\n\\headright{${escapeLaTeX(section.title)}}\n\n`;
                section.items.forEach(item => {
                    // Try to split by colon for bolding prefix if it exists
                    if (item.includes(':')) {
                        const [prefix, content] = item.split(':');
                        latex += `\\textit{${escapeLaTeX(prefix)}:} ${escapeLaTeX(content.substring(1))}\n\n`;
                    } else {
                        latex += `${escapeLaTeX(item)}\n\n`;
                    }
                });
            });
        }

        latex += `\\end{minipage}

\\end{document}
`;
        return latex;
    }
};

export const templates: ResumeTemplate[] = [
    classicTemplate,
    modernCompactTemplate,
    developerTemplate,
    minimalistTemplate,

    creativeTemplate,
    entryTemplate,
    maltaTemplate,
    luxSleekTemplate,
    glacialTemplate,
];

export function getTemplateById(id: string): ResumeTemplate | undefined {
    return templates.find(t => t.id === id);
}
