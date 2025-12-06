import { ResumeData, ResumeTemplate } from '../types/resume';
import { escapeLaTeX, formatDate } from '../utils/latexUtils';

export const glacialDummyData: ResumeData = {
    personalInfo: {
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        phone: '202-555-0166',
        location: 'New York, USA',
        summary: 'Professional Business Developer with more than four years of experience in the business development processes. Involved in product testing, management, and development of new business opportunities.',
        profiles: [
            { network: 'LinkedIn', username: 'linkedin.com/in/john.doe', url: 'https://linkedin.com/in/john.doe' },
            { network: 'Website', username: 'john.doe', url: 'https://john.doe' }
        ],
        profileImage: ''
    },
    experience: [
        {
            id: '1',
            jobTitle: 'Business Development Manager',
            company: 'AirState Solutions',
            location: 'New York, USA',
            startDate: '2014-09',
            endDate: '2017-06',
            current: false,
            bulletPoints: [
                'Successfully managed $2 - 3 million budget projects and successfully achieved the project scheduled goals.',
                'Developed and implemented new marketing and sales plans and defined the strategy for the next 5 years.',
                'Reviewed constantly the customer feedback and then suggested ways to improve the processes and customer service levels which increased the satisfaction rate from 81% to 95%.',
                'Ensured that new clients will grow into a loyal customer base in a specialist niche market by implementing a new loyalty program.'
            ]
        },
        {
            id: '2',
            jobTitle: 'Business Development Assistant',
            company: 'AirState Solutions',
            location: 'Chicago, USA',
            startDate: '2012-08',
            endDate: '2014-05',
            current: false,
            bulletPoints: [
                'Increased the customer satisfaction rate by 25% by improving the customer service.',
                'Planned, supervised, and coordinated daily activity of 3 junior business analysts.',
                'Improved the communication with the Marketing department to better understand the competitive position.',
                'Directed the creation and implementation of a Business Continuity Plan, and the management of audit programs.'
            ]
        }
    ],
    education: [
        {
            id: '1',
            degree: 'MSc in Economics and Business Administration',
            institution: 'The University of Chicago',
            location: 'Chicago, USA',
            graduationDate: '2010-06',
            bulletPoints: []
        }
    ],
    skills: [
        {
            id: '1',
            category: 'Professional Skills',
            skills: [
                'SEO',
                'Public Speaking',
                'Negotiation',
                'Teamwork',
                'Decision Making',
                'Research & Strategy',
                'Emotional Intelligence',
                'Outbound Marketing',
                'Email Marketing',
                'Google Analytics',
                'Sales & Marketing'
            ]
        }
    ],
    projects: [],
    certifications: [
        {
            id: '1',
            name: 'Jury Member, Venture Cup Entrepreneurship Competition',
            issuer: 'Venture Cup USA',
            date: '2016',
            link: ''
        },
        {
            id: '2',
            name: 'Sales Individual & Business Development Award',
            issuer: 'AirState Business Awards',
            date: '2015',
            link: ''
        },
        {
            id: '3',
            name: 'Excellence in Customer Partnering Award',
            issuer: 'IES - Institute of Excellence in Sales',
            date: '',
            link: ''
        }
    ],
    languages: [
        { id: '1', language: 'English', proficiency: 'Native' },
        { id: '2', language: 'Spanish', proficiency: 'Fluent' },
        { id: '3', language: 'French', proficiency: 'Intermediate' }
    ],
    customSections: [
        {
            id: '1',
            title: 'ORGANIZATIONS',
            items: [
                'American Management Association (2015 - Present)',
                'Association of Private Enterprise Education (2014 - Present)',
                'eBusiness Association (eBA) (2013 - Present)'
            ]
        }
    ]
};

export const glacialTemplate: ResumeTemplate = {
    id: 'glacial',
    name: 'Glacial Professional',
    description: 'A professional two-column layout with profile picture support, skill bars, and blue accents. Perfect for business and management roles.',
    preview: '/templates/glacial-preview.png',
    dummyData: glacialDummyData,
    generateLaTeX: (data: ResumeData) => {
        const { personalInfo, experience, education, skills, certifications, languages, customSections } = data;

        let latex = `
\\documentclass[9pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage[english]{babel}
\\usepackage{geometry}
\\usepackage{xcolor}
\\usepackage{fontawesome5}
\\usepackage{enumitem}
\\usepackage{tikz}
\\usepackage{graphicx}
\\usepackage{hyperref}
\\usepackage{helvet}

% Set font
\\renewcommand{\\familydefault}{\\sfdefault}

% Margins
\\geometry{
    left=1cm,
    right=1cm,
    top=1cm,
    bottom=1cm
}

% Colors
\\definecolor{primary}{RGB}{70, 130, 180}
\\definecolor{darktext}{RGB}{40, 40, 40}
\\definecolor{lighttext}{RGB}{100, 100, 100}

% Custom commands
\\newcommand{\\sectiontitle}[1]{
    \\vspace{0.25cm}
    {\\color{darktext}\\large\\textbf{\\uppercase{#1}}} \\\\
    {\\color{primary}\\rule{\\linewidth}{0.8pt}}
    \\vspace{0.15cm}
}

% Skill bar command
\\newcommand{\\skillbar}[2]{
    \\noindent\\begin{minipage}{0.45\\linewidth}
        \\small #1
    \\end{minipage}
    \\begin{minipage}{0.5\\linewidth}
        \\begin{tikzpicture}
            \\fill[lightgray!30, rounded corners=2pt] (0,0) rectangle (3.5, 0.15);
            \\fill[primary, rounded corners=2pt] (0,0) rectangle (#2*0.035, 0.15);
            \\draw[primary!50] (3.5, 0.075) circle (0.08);
        \\end{tikzpicture}
    \\end{minipage}
    \\vspace{0.05cm}
}

\\setlength{\\parindent}{0pt}

\\begin{document}

% Header with centered profile placeholder
\\begin{minipage}[t]{0.4\\textwidth}
    {\\LARGE\\textbf{${escapeLaTeX(personalInfo.name)}}} \\\\[0.1cm]
    {\\color{primary}\\large\\textbf{Business Development Manager}} \\\\[0.15cm]
    {\\footnotesize ${escapeLaTeX(personalInfo.summary)}}
\\end{minipage}
\\hfill
\\begin{minipage}[t]{0.2\\textwidth}
    \\centering
    \\vspace{0.2cm}
    ${personalInfo.profileImage ?
                `\\begin{tikzpicture}
            \\clip (0,0) circle (1.2cm);
            \\node at (0,0) {\\includegraphics[width=2.4cm]{profile.jpg}};
        \\end{tikzpicture}` :
                `\\begin{tikzpicture}
            \\fill[gray!20] (0,0) circle (1.2cm);
            \\node[text=gray!50] at (0,0) {\\Large\\faUser};
        \\end{tikzpicture}`
            }
\\end{minipage}
\\hfill
\\begin{minipage}[t]{0.3\\textwidth}
    \\raggedleft
    \\footnotesize
    ${escapeLaTeX(personalInfo.email)} \\hspace{0.1cm} \\faEnvelope \\\\
    ${escapeLaTeX(personalInfo.phone)} \\hspace{0.1cm} \\faMobile \\\\
    ${escapeLaTeX(personalInfo.location)} \\hspace{0.1cm} \\faMapMarker \\\\
    ${personalInfo.profiles.map(p => `${escapeLaTeX(p.username)} \\hspace{0.1cm} \\faLinkedin`).join(' \\\\ ')}
\\end{minipage}

\\vspace{0.3cm}
\\color{primary}\\rule{\\linewidth}{0.8pt}
\\vspace{0.3cm}

% Two column layout
\\begin{minipage}[t]{0.55\\textwidth}
    \\sectiontitle{WORK EXPERIENCE}
    
    ${experience.map(exp => `
        \\begin{minipage}[t]{0.05\\linewidth}
            \\color{primary}\\rule{0.25cm}{0.25cm}
        \\end{minipage}
        \\begin{minipage}[t]{0.9\\linewidth}
            \\textbf{\\normalsize ${escapeLaTeX(exp.jobTitle)}} \\\\
            \\textbf{\\small ${escapeLaTeX(exp.company)}} \\\\
            {\\color{primary}\\footnotesize ${formatDate(exp.startDate)} -- ${exp.current ? 'Present' : formatDate(exp.endDate)}} \\hfill {\\color{primary}\\footnotesize ${escapeLaTeX(exp.location)}}
            
            \\vspace{0.05cm}
            \\begin{itemize}[leftmargin=*, nosep, itemsep=1pt, topsep=2pt]
                ${(exp.bulletPoints || []).map(bp => `\\item \\footnotesize ${escapeLaTeX(bp)}`).join('\n')}
            \\end{itemize}
        \\end{minipage}
        \\vspace{0.2cm}
    `).join('\n')}

    \\sectiontitle{EDUCATION}
    ${education.map(edu => `
        \\begin{minipage}[t]{0.05\\linewidth}
            \\color{primary}\\rule{0.25cm}{0.25cm}
        \\end{minipage}
        \\begin{minipage}[t]{0.9\\linewidth}
            \\textbf{\\normalsize ${escapeLaTeX(edu.degree)}} \\\\
            \\textbf{\\small ${escapeLaTeX(edu.institution)}} \\\\
            {\\color{primary}\\footnotesize ${formatDate(edu.graduationDate)}}
        \\end{minipage}
        \\vspace{0.15cm}
    `).join('\n')}

    \\sectiontitle{LANGUAGES}
    \\begin{itemize}[label={\\color{primary}$\\blacksquare$}, nosep, itemsep=1pt, leftmargin=*]
        ${languages.map(l => `\\item \\small ${escapeLaTeX(l.language)}`).join('\n')}
    \\end{itemize}

\\end{minipage}
\\hfill
\\begin{minipage}[t]{0.4\\textwidth}
    \\sectiontitle{SKILLS}
    
    ${skills.flatMap(cat => cat.skills).map(skill => `
        \\skillbar{${escapeLaTeX(skill)}}{${Math.floor(Math.random() * 40) + 60}}
    `).join('\n')}

    ${customSections.map(section => `
        \\sectiontitle{${escapeLaTeX(section.title)}}
        \\begin{itemize}[leftmargin=*, nosep, itemsep=1pt]
            ${section.items.map(item => `\\item \\footnotesize ${escapeLaTeX(item)}`).join('\n')}
        \\end{itemize}
    `).join('\n')}

    \\sectiontitle{HONOURS AND AWARDS}
    ${certifications.map(cert => `
        \\textbf{\\small ${escapeLaTeX(cert.name)}} \\\\
        {\\footnotesize ${escapeLaTeX(cert.issuer)}} \\\\
        {\\color{lighttext}\\footnotesize ${escapeLaTeX(cert.date)}}
        \\vspace{0.1cm}
    `).join('\n')}

\\end{minipage}

\\end{document}
`;
        return latex;
    }
};
