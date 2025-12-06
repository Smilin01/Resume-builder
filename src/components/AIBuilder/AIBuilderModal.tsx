
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { X, ChevronRight, ChevronLeft, Sparkles, Briefcase, User, Code, FolderGit2, Check, GraduationCap, Award } from 'lucide-react';
import { templates } from '../../data/templates';
import { generateResumeWithAI } from '../../services/aiService';
import { useResumeStore } from '../../store/resumeStore';
import { ResumeData } from '../../types/resume';

interface AIBuilderModalProps {
    isOpen: boolean;
    onClose: () => void;
    isDark: boolean;
}

type FormData = {
    personalInfo: {
        name: string;
        email: string;
        phone: string;
        location: string;
        summary: string;
        linkedin: string;
        github: string;
        website: string;
    };
    experience: {
        company: string;
        position: string;
        duration: string;
        description: string;
    }[];
    education: {
        institution: string;
        degree: string;
        date: string;
        location: string;
    }[];
    skills: string;
    projects: {
        name: string;
        description: string;
        technologies: string;
    }[];
    certifications: {
        name: string;
        issuer: string;
        date: string;
    }[];
    hobbies: string;
};

const STEPS = [
    { id: 'personal', title: 'Personal Info', icon: User },
    { id: 'experience', title: 'Experience', icon: Briefcase },
    { id: 'education', title: 'Education', icon: GraduationCap },
    { id: 'skills', title: 'Skills', icon: Code },
    { id: 'projects', title: 'Projects', icon: FolderGit2 },
    { id: 'certifications', title: 'Certifications', icon: Award },
    { id: 'template', title: 'Template', icon: Sparkles },
];

export function AIBuilderModal({ isOpen, onClose, isDark }: AIBuilderModalProps) {
    const [step, setStep] = useState(0);
    const [selectedTemplate, setSelectedTemplate] = useState(templates[0].id);
    const [isGenerating, setIsGenerating] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);
    const { setResumeData, setLatexCode, triggerRecompile, setSettings } = useResumeStore();

    const { register, control, handleSubmit, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            personalInfo: { name: '', email: '', phone: '', location: '', summary: '', linkedin: '', github: '', website: '' },
            experience: [{ company: '', position: '', duration: '', description: '' }],
            education: [{ institution: '', degree: '', date: '', location: '' }],
            skills: '',
            projects: [{ name: '', description: '', technologies: '' }],
            certifications: [{ name: '', issuer: '', date: '' }],
            hobbies: ''
        }
    });

    const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({
        control,
        name: "experience"
    });

    const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({
        control,
        name: "education"
    });

    const { fields: projFields, append: appendProj, remove: removeProj } = useFieldArray({
        control,
        name: "projects"
    });

    const { fields: certFields, append: appendCert, remove: removeCert } = useFieldArray({
        control,
        name: "certifications"
    });

    if (!isOpen) return null;


    const onSubmit = async (data: FormData) => {
        setIsGenerating(true);
        setLoadingStep(0);

        try {
            // Step 1: Analyzing your information
            setLoadingStep(1);
            await new Promise(resolve => setTimeout(resolve, 800));

            // 1. Transform FormData to ResumeData structure
            const resumeData: Partial<ResumeData> = {
                personalInfo: {
                    name: data.personalInfo.name,
                    email: data.personalInfo.email,
                    phone: data.personalInfo.phone,
                    location: data.personalInfo.location,
                    summary: data.personalInfo.summary,
                    profiles: [
                        ...(data.personalInfo.linkedin ? [{ network: 'LinkedIn', username: data.personalInfo.linkedin, url: data.personalInfo.linkedin }] : []),
                        ...(data.personalInfo.github ? [{ network: 'GitHub', username: data.personalInfo.github, url: data.personalInfo.github }] : []),
                        ...(data.personalInfo.website ? [{ network: 'Website', username: data.personalInfo.website, url: data.personalInfo.website }] : []),
                    ]
                },
                experience: data.experience.map(exp => ({
                    id: Math.random().toString(36).substr(2, 9),
                    company: exp.company,
                    jobTitle: exp.position,
                    location: '',
                    startDate: exp.duration, // Simplified
                    endDate: '',
                    current: false,
                    bulletPoints: exp.description.split('\n').filter(Boolean)
                })).filter(e => e.company),
                education: data.education.map(edu => ({
                    id: Math.random().toString(36).substr(2, 9),
                    institution: edu.institution,
                    degree: edu.degree,
                    location: edu.location,
                    graduationDate: edu.date,
                    bulletPoints: []
                })).filter(e => e.institution),
                skills: [{
                    id: Math.random().toString(36).substr(2, 9),
                    category: 'Key Skills',
                    skills: data.skills.split(',').map(s => s.trim()).filter(Boolean)
                }],
                projects: data.projects.map(p => ({
                    id: Math.random().toString(36).substr(2, 9),
                    name: p.name,
                    description: p.description,
                    technologies: p.technologies.split(',').map(t => t.trim()).filter(Boolean),
                    link: ''
                })).filter(p => p.name),
                certifications: data.certifications.map(cert => ({
                    id: Math.random().toString(36).substr(2, 9),
                    name: cert.name,
                    issuer: cert.issuer,
                    date: cert.date,
                    link: ''
                })).filter(c => c.name),
                languages: [],
                customSections: data.hobbies ? [{
                    id: Math.random().toString(36).substr(2, 9),
                    title: 'Hobbies & Interests',
                    items: data.hobbies.split(',').map(h => h.trim()).filter(Boolean)
                }] : []
            };

            // We need to cast to any because we are providing partial data, but the store expects full ResumeData.
            const fullResumeData: ResumeData = {
                personalInfo: { ...resumeData.personalInfo!, profiles: resumeData.personalInfo!.profiles || [] },
                experience: resumeData.experience as any || [],
                education: resumeData.education as any || [],
                skills: resumeData.skills as any || [],
                projects: resumeData.projects as any || [],
                certifications: resumeData.certifications as any || [],
                languages: [],
                customSections: resumeData.customSections as any || [],
            };

            // Step 2: Enhancing with AI
            setLoadingStep(2);
            await new Promise(resolve => setTimeout(resolve, 500));

            // 3. Call AI Service
            const { data: enhancedData, latex } = await generateResumeWithAI(fullResumeData, selectedTemplate);

            // Step 3: Optimizing for ATS
            setLoadingStep(3);
            await new Promise(resolve => setTimeout(resolve, 600));

            // Step 4: Formatting layout
            setLoadingStep(4);
            await new Promise(resolve => setTimeout(resolve, 500));

            // 2. Update Store with Enhanced Data
            setResumeData(enhancedData, 'visual');
            setSettings({ template: selectedTemplate });

            // 4. Update Latex
            setLatexCode(latex, 'code');
            triggerRecompile();

            // Step 5: Finalizing
            setLoadingStep(5);
            await new Promise(resolve => setTimeout(resolve, 400));

            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to generate resume. Please try again.');
        } finally {
            setIsGenerating(false);
            setLoadingStep(0);
        }
    };

    const nextStep = () => setStep(s => Math.min(s + 1, STEPS.length));
    const prevStep = () => setStep(s => Math.max(s - 1, 0));

    const renderStepContent = () => {
        switch (step) {
            case 0: // Personal
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Full Name</label>
                                <input {...register('personalInfo.name', { required: true })} className="w-full p-2.5 border rounded-lg bg-transparent focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all outline-none" placeholder="John Doe" />
                                {errors.personalInfo?.name && <span className="text-red-500 text-xs">Required</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input {...register('personalInfo.email', { required: true })} className="w-full p-2.5 border rounded-lg bg-transparent focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all outline-none" placeholder="john@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Phone</label>
                                <input {...register('personalInfo.phone')} className="w-full p-2.5 border rounded-lg bg-transparent focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all outline-none" placeholder="+1 234 567 890" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Location</label>
                                <input {...register('personalInfo.location')} className="w-full p-2.5 border rounded-lg bg-transparent focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all outline-none" placeholder="New York, NY" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Professional Summary</label>
                            <textarea {...register('personalInfo.summary')} className="w-full p-2.5 border rounded-lg bg-transparent focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all outline-none" rows={4} placeholder="Experienced software engineer..." />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">LinkedIn (Optional)</label>
                                <input {...register('personalInfo.linkedin')} className="w-full p-2.5 border rounded-lg bg-transparent focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all outline-none" placeholder="linkedin.com/in/..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">GitHub (Optional)</label>
                                <input {...register('personalInfo.github')} className="w-full p-2.5 border rounded-lg bg-transparent focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all outline-none" placeholder="github.com/..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Website (Optional)</label>
                                <input {...register('personalInfo.website')} className="w-full p-2.5 border rounded-lg bg-transparent focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all outline-none" placeholder="mysite.com" />
                            </div>
                        </div>
                    </div>
                );
            case 1: // Experience
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        {expFields.map((field, index) => (
                            <div key={field.id} className="p-4 border rounded-xl relative bg-gray-50/50 dark:bg-gray-800/50">
                                <button type="button" onClick={() => removeExp(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><X size={16} /></button>
                                <div className="grid grid-cols-2 gap-4 mb-2">
                                    <input {...register(`experience.${index}.company`)} className="p-2.5 border rounded-lg bg-transparent focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all outline-none" placeholder="Company" />
                                    <input {...register(`experience.${index}.position`)} className="p-2.5 border rounded-lg bg-transparent focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all outline-none" placeholder="Position" />
                                </div>
                                <input {...register(`experience.${index}.duration`)} className="w-full p-2.5 border rounded-lg bg-transparent mb-2 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all outline-none" placeholder="Duration (e.g. Jan 2020 - Present)" />
                                <textarea {...register(`experience.${index}.description`)} className="w-full p-2.5 border rounded-lg bg-transparent focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all outline-none" rows={3} placeholder="Key responsibilities and achievements..." />
                            </div>
                        ))}
                        <button type="button" onClick={() => appendExp({ company: '', position: '', duration: '', description: '' })} className="text-violet-600 text-sm font-medium hover:underline">+ Add Experience</button>
                    </div>
                );
            case 2: // Education
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        {eduFields.map((field, index) => (
                            <div key={field.id} className="p-4 border rounded-xl relative bg-gray-50/50 dark:bg-gray-800/50">
                                <button type="button" onClick={() => removeEdu(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><X size={16} /></button>
                                <div className="grid grid-cols-2 gap-4 mb-2">
                                    <input {...register(`education.${index}.institution`)} className="p-2.5 border rounded-lg bg-transparent focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all outline-none" placeholder="Institution / University" />
                                    <input {...register(`education.${index}.degree`)} className="p-2.5 border rounded-lg bg-transparent focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all outline-none" placeholder="Degree / Major" />
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-2">
                                    <input {...register(`education.${index}.date`)} className="p-2.5 border rounded-lg bg-transparent focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all outline-none" placeholder="Graduation Date (e.g. May 2018)" />
                                    <input {...register(`education.${index}.location`)} className="p-2.5 border rounded-lg bg-transparent focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all outline-none" placeholder="Location" />
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={() => appendEdu({ institution: '', degree: '', date: '', location: '' })} className="text-violet-600 text-sm font-medium hover:underline">+ Add Education</button>
                    </div>
                );
            case 3: // Skills
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div>
                            <label className="block text-sm font-medium mb-1">Skills (Comma separated)</label>
                            <p className="text-xs text-gray-500 mb-2">Enter all your skills here. The AI will automatically categorize them for you.</p>
                            <textarea {...register('skills')} className="w-full p-2.5 border rounded-lg bg-transparent focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all outline-none" rows={6} placeholder="React, TypeScript, Node.js, Python, AWS, Docker, Git, Communication, Leadership..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Hobbies (Optional, Comma separated)</label>
                            <input {...register('hobbies')} className="w-full p-2.5 border rounded-lg bg-transparent focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all outline-none" placeholder="Reading, Hiking, Photography..." />
                        </div>
                    </div>
                );
            case 4: // Projects
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        {projFields.map((field, index) => (
                            <div key={field.id} className="p-4 border rounded-xl relative bg-gray-50/50 dark:bg-gray-800/50">
                                <button type="button" onClick={() => removeProj(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><X size={16} /></button>
                                <input {...register(`projects.${index}.name`)} className="w-full p-2.5 border rounded-lg bg-transparent mb-2 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all outline-none" placeholder="Project Name" />
                                <input {...register(`projects.${index}.technologies`)} className="w-full p-2.5 border rounded-lg bg-transparent mb-2 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all outline-none" placeholder="Technologies Used (e.g. React, Firebase)" />
                                <textarea {...register(`projects.${index}.description`)} className="w-full p-2.5 border rounded-lg bg-transparent focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all outline-none" rows={2} placeholder="Description..." />
                            </div>
                        ))}
                        <button type="button" onClick={() => appendProj({ name: '', description: '', technologies: '' })} className="text-violet-600 text-sm font-medium hover:underline">+ Add Project</button>
                    </div>
                );
            case 5: // Certifications
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        {certFields.map((field, index) => (
                            <div key={field.id} className="p-4 border rounded-xl relative bg-gray-50/50 dark:bg-gray-800/50">
                                <button type="button" onClick={() => removeCert(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><X size={16} /></button>
                                <input {...register(`certifications.${index}.name`)} className="w-full p-2.5 border rounded-lg bg-transparent mb-2 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all outline-none" placeholder="Certification Name (e.g. AWS Certified Solutions Architect)" />
                                <div className="grid grid-cols-2 gap-4">
                                    <input {...register(`certifications.${index}.issuer`)} className="p-2.5 border rounded-lg bg-transparent focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all outline-none" placeholder="Issuer (e.g. Amazon Web Services)" />
                                    <input {...register(`certifications.${index}.date`)} className="p-2.5 border rounded-lg bg-transparent focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all outline-none" placeholder="Date (e.g. Aug 2023)" />
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={() => appendCert({ name: '', issuer: '', date: '' })} className="text-violet-600 text-sm font-medium hover:underline">+ Add Certification</button>
                    </div>
                );
            case 6: // Template
                return (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-right-4 duration-300 max-h-[60vh] overflow-y-auto">
                        {templates.map((t) => (
                            <div
                                key={t.id}
                                onClick={() => setSelectedTemplate(t.id)}
                                className={`cursor-pointer border-2 rounded-xl overflow-hidden relative transition-all ${selectedTemplate === t.id ? 'border-violet-600 ring-2 ring-violet-500/20 shadow-lg' : 'border-transparent hover:border-gray-300'}`}
                            >
                                <img src={t.preview} alt={t.name} className="w-full h-32 object-cover object-top" />
                                <div className="p-2 text-center text-sm font-medium">{t.name}</div>
                                {selectedTemplate === t.id && (
                                    <div className="absolute top-2 right-2 bg-violet-600 text-white rounded-full p-1"><Check size={12} /></div>
                                )}
                            </div>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className={`w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
                {/* Header */}
                <div className="p-6 border-b flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Sparkles className="text-violet-600" />
                        <h2 className="text-xl font-bold">AI Resume Builder</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X /></button>
                </div>

                {/* Progress */}
                <div className="flex border-b overflow-x-auto scrollbar-hide">
                    {STEPS.map((s, i) => {
                        const Icon = s.icon;
                        return (
                            <div key={s.id} className={`flex-1 min-w-[100px] p-3 flex items-center justify-center gap-2 text-sm font-medium border-b-2 transition-colors ${i === step ? 'border-violet-600 text-violet-600' : 'border-transparent text-gray-400'}`}>
                                <Icon size={16} />
                                <span className="hidden md:inline">{s.title}</span>
                            </div>
                        );
                    })}
                </div>




                {/* Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                    {isGenerating ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-8">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-violet-600 border-t-transparent"></div>
                            <div className="text-center space-y-2">
                                <p className="text-xl font-bold">Generating your resume with AI...</p>
                                <p className="text-sm text-gray-500">This may take up to 2-3 minutes. Please don't close this window.</p>
                            </div>

                            {/* Simplified Progress Steps */}
                            <div className="w-full max-w-md space-y-2 min-h-[120px] flex flex-col justify-center">
                                {[
                                    { step: 1, label: 'Analyzing your information' },
                                    { step: 2, label: 'Enhancing content with AI' },
                                    { step: 3, label: 'Optimizing for ATS systems' },
                                    { step: 4, label: 'Formatting professional layout' },
                                    { step: 5, label: 'Finalizing your resume' }
                                ].map((item) => {
                                    // Only show current step and recently completed steps
                                    if (loadingStep === item.step) {
                                        // Current step - prominent
                                        return (
                                            <div
                                                key={item.step}
                                                className="flex items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300"
                                            >
                                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-violet-600 border-t-transparent"></div>
                                                <p className="text-lg font-medium text-violet-600 dark:text-violet-400">
                                                    {item.label}
                                                </p>
                                            </div>
                                        );
                                    } else if (loadingStep === item.step + 1) {
                                        // Just completed - fading up
                                        return (
                                            <div
                                                key={item.step}
                                                className="flex items-center justify-center gap-3 animate-out fade-out slide-out-to-top-2 duration-500"
                                            >
                                                <div className="text-violet-600">✓</div>
                                                <p className="text-sm text-gray-400">
                                                    {item.label}
                                                </p>
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                        </div>
                    ) : (
                        renderStepContent()
                    )}
                </div>

                {/* Footer */}
                {!isGenerating && (
                    <div className="p-6 border-t flex justify-between">
                        <button
                            onClick={prevStep}
                            disabled={step === 0}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${step === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                        >
                            <ChevronLeft size={16} /> Back
                        </button>

                        {step === STEPS.length - 1 ? (
                            <button
                                onClick={handleSubmit(onSubmit)}
                                className="px-6 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg hover:shadow-lg hover:shadow-violet-200 transition-all flex items-center gap-2"
                            >
                                <Sparkles size={16} /> Generate Resume
                            </button>
                        ) : (
                            <button
                                onClick={nextStep}
                                className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors flex items-center gap-2"
                            >
                                Next <ChevronRight size={16} />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
