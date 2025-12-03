import { templates } from '../data/templates';
import { Check, LayoutTemplate } from 'lucide-react';

interface TemplateSelectorProps {
    onSelect: (templateId: string) => void;
    currentTemplateId: string;
    isDark: boolean;
}

export function TemplateSelector({ onSelect, currentTemplateId, isDark }: TemplateSelectorProps) {
    return (
        <div className={`h-full overflow-y-auto p-8 ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 text-center">
                    <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Choose Your Resume Template
                    </h2>
                    <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Select a professional design that suits your style and career goals.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {templates.map((template) => (
                        <div
                            key={template.id}
                            onClick={() => onSelect(template.id)}
                            className={`group relative rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer hover:scale-[1.02] ${currentTemplateId === template.id
                                ? 'border-emerald-500 ring-4 ring-emerald-500/20 shadow-xl'
                                : isDark
                                    ? 'border-gray-800 hover:border-emerald-500/50 shadow-lg'
                                    : 'border-gray-200 hover:border-emerald-500/50 shadow-lg'
                                }`}
                        >
                            {/* Preview Image */}
                            <div className={`aspect-[1/1.414] w-full overflow-hidden ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
                                {template.preview ? (
                                    <img
                                        src={template.preview}
                                        alt={template.name}
                                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <LayoutTemplate className="h-16 w-16 opacity-50" />
                                    </div>
                                )}
                            </div>

                            {/* Overlay for Selection State */}
                            {currentTemplateId === template.id && (
                                <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center pointer-events-none">
                                    <div className="bg-emerald-500 text-white p-3 rounded-full shadow-lg transform scale-100 animate-in fade-in zoom-in duration-200">
                                        <Check className="h-6 w-6" />
                                    </div>
                                </div>
                            )}

                            {/* Template Info */}
                            <div className={`p-4 border-t ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                                <h3 className={`font-semibold text-lg mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {template.name}
                                </h3>
                                <p className={`text-sm line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {template.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
