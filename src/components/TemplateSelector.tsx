import { useState } from 'react';
import { templates } from '../data/templates';
import { useResumeStore } from '../store/resumeStore';
import { generateLaTeXFromData } from '../utils/latexConverter';
import { FileText, Check, AlertTriangle } from 'lucide-react';

export function TemplateSelector() {
    const { settings, setSettings, resumeData, setResumeData, setLatexCode } = useResumeStore();
    const [selectedTemplate, setSelectedTemplate] = useState(settings.template || 'classic');
    const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({});
    const isDark = settings.theme === 'dark';

    const handleTemplateSelect = (templateId: string) => {
        const template = templates.find(t => t.id === templateId);
        if (!template) return;

        // Check if user has significant data (e.g., name is not empty)
        const hasData = resumeData.personalInfo.name.trim() !== '';

        let shouldLoadDummyData = false;

        if (hasData) {
            // If user has data, ask if they want to load example data
            if (window.confirm(`Do you want to load example data for the "${template.name}" template?\n\nClick OK to overwrite your current resume with example data.\nClick Cancel to keep your current data and just apply the style.`)) {
                shouldLoadDummyData = true;
            }
        } else {
            // If no data, load dummy data automatically
            shouldLoadDummyData = true;
        }

        // Update settings
        const newSettings = { ...settings, template: templateId };
        setSettings(newSettings);
        setSelectedTemplate(templateId);

        if (shouldLoadDummyData) {
            // Load dummy data
            setResumeData(template.dummyData, 'visual');
            // The sync system will pick this up, but we can also force an immediate update for responsiveness
            const newLatex = generateLaTeXFromData(template.dummyData, templateId);
            setLatexCode(newLatex, 'visual');
        } else {
            // Just regenerate LaTeX with existing data and new template
            const newLatex = generateLaTeXFromData(resumeData, templateId);
            setLatexCode(newLatex, 'visual');
        }
    };

    return (
        <div className={`p-6 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
            <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Choose a Template
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {templates.map((template) => (
                    <div
                        key={template.id}
                        onClick={() => handleTemplateSelect(template.id)}
                        className={`
              relative cursor-pointer rounded-lg border-2 transition-all group
              ${selectedTemplate === template.id
                                ? 'border-blue-500 shadow-lg'
                                : isDark
                                    ? 'border-gray-700 hover:border-gray-600'
                                    : 'border-gray-200 hover:border-gray-300'
                            }
              ${isDark ? 'bg-gray-800' : 'bg-white'}
            `}
                    >
                        {/* Selected Indicator */}
                        {selectedTemplate === template.id && (
                            <div className="absolute top-3 right-3 bg-blue-500 text-white rounded-full p-1 z-10">
                                <Check size={16} />
                            </div>
                        )}

                        {/* Template Preview */}
                        <div className={`
              aspect-[8.5/11] rounded-t-lg flex items-center justify-center overflow-hidden relative
              ${isDark ? 'bg-gray-700' : 'bg-gray-100'}
            `}>
                            {/* Loading skeleton */}
                            {loadingImages[template.id] !== false && (
                                <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700" />
                            )}

                            {/* Template preview image */}
                            <img
                                src={template.preview}
                                alt={`${template.name} preview`}
                                className={`w-full h-full object-cover object-top transition-all duration-300 group-hover:scale-105 ${loadingImages[template.id] === false ? 'opacity-100' : 'opacity-0'
                                    }`}
                                onLoad={() => {
                                    setLoadingImages(prev => ({ ...prev, [template.id]: false }));
                                }}
                                onError={(e) => {
                                    // Fallback to icon if image fails to load
                                    setLoadingImages(prev => ({ ...prev, [template.id]: false }));
                                    e.currentTarget.style.display = 'none';
                                    const fallback = e.currentTarget.nextElementSibling;
                                    if (fallback) {
                                        (fallback as HTMLElement).style.display = 'flex';
                                    }
                                }}
                            />
                            {/* Fallback icon (hidden by default) */}
                            <div className="hidden w-full h-full items-center justify-center">
                                <FileText size={64} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200" />
                        </div>

                        {/* Template Info */}
                        <div className="p-4">
                            <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {template.name}
                            </h3>
                            <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {template.description}
                            </p>

                            <div className="flex items-center text-xs text-blue-500 font-medium">
                                Click to apply
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className={`mt-6 p-4 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-100'}`}>
                <div className="flex items-start">
                    <AlertTriangle className={`h-5 w-5 mr-3 mt-0.5 ${isDark ? 'text-yellow-500' : 'text-blue-500'}`} />
                    <div>
                        <h4 className={`text-sm font-semibold mb-1 ${isDark ? 'text-white' : 'text-blue-900'}`}>
                            About Templates
                        </h4>
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-blue-800'}`}>
                            Selecting a template will allow you to load example data tailored for that style.
                            You can then edit the information in the Visual Editor.
                            <strong>Warning:</strong> Loading example data will overwrite your current resume.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
