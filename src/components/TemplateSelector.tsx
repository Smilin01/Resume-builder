import { templates } from '../data/templates';
import { Check, LayoutTemplate, Sparkles } from 'lucide-react';

interface TemplateSelectorProps {
    onSelect: (templateId: string) => void;
    currentTemplateId: string;
    isDark: boolean;
}

// Helper to generate a consistent pseudo-random number from a string seed
function getPseudoRandomNumber(seed: string, min: number, max: number) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const range = max - min;
    return Math.abs(hash % range) + min;
}

export function TemplateSelector({ onSelect, currentTemplateId, isDark }: TemplateSelectorProps) {
    return (
        <div className={`w-full h-full overflow-y-auto p-8 scrollbar-hide ${isDark ? 'bg-gray-950' : 'bg-slate-50'}`}>
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-600 text-white text-sm font-medium mb-2 shadow-lg shadow-violet-200 dark:shadow-none">
                        <Sparkles size={16} />
                        <span>Professional Designs</span>
                    </div>
                    <h2 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Choose Your <span className="text-violet-600">Perfect Template</span>
                    </h2>
                    <p className={`text-xl max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Select a design that matches your industry and personality. All templates are ATS-friendly and fully customizable.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
                    {templates.map((template) => {
                        // Generate random stats for this template
                        const userCount = getPseudoRandomNumber(template.id + 'count', 50, 1500);

                        return (
                            <div
                                key={template.id}
                                onClick={() => onSelect(template.id)}
                                className={`group relative rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer hover:-translate-y-1 ${currentTemplateId === template.id
                                    ? 'border-violet-600 ring-4 ring-violet-500/20 shadow-2xl shadow-violet-500/10'
                                    : isDark
                                        ? 'border-gray-800 hover:border-violet-500/50 shadow-lg hover:shadow-xl'
                                        : 'border-white hover:border-violet-500/50 shadow-lg hover:shadow-xl'
                                    }`}
                            >
                                {/* Preview Image */}
                                <div className={`aspect-[1/1.414] w-full overflow-hidden relative ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
                                    {template.preview ? (
                                        <img
                                            src={template.preview}
                                            alt={template.name}
                                            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                                            <div className={`p-6 rounded-full ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                                                <LayoutTemplate className="h-12 w-12 opacity-50" />
                                            </div>
                                            <span className="text-sm font-medium">Preview Coming Soon</span>
                                        </div>
                                    )}

                                    {/* Overlay Gradient */}
                                    <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                                </div>

                                {/* Overlay for Selection State */}
                                {currentTemplateId === template.id && (
                                    <div className="absolute inset-0 bg-violet-600/10 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
                                        <div className="bg-violet-600 text-white p-4 rounded-full shadow-lg transform scale-100 animate-in fade-in zoom-in duration-200">
                                            <Check className="h-8 w-8" />
                                        </div>
                                    </div>
                                )}

                                {/* Template Info */}
                                <div className={`p-6 border-t relative ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className={`font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {template.name}
                                        </h3>
                                        {currentTemplateId === template.id && (
                                            <span className="px-2 py-1 bg-violet-100 text-violet-700 text-xs font-bold rounded uppercase tracking-wider">
                                                Selected
                                            </span>
                                        )}
                                    </div>
                                    <p className={`text-sm line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {template.description}
                                    </p>

                                    <div className="mt-4 pt-4 border-t border-dashed border-gray-200 dark:border-gray-700 flex items-center gap-2">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(i => {
                                                const imgId = getPseudoRandomNumber(template.id + i, 1, 70);
                                                return (
                                                    <div key={i} className={`w-6 h-6 rounded-full border-2 ${isDark ? 'border-gray-900' : 'border-white'} bg-gray-300 overflow-hidden`}>
                                                        <img src={`https://i.pravatar.cc/100?img=${imgId}`} alt="User" />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <span className="text-xs text-gray-500 ml-2">Used by {userCount.toLocaleString()} people</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
