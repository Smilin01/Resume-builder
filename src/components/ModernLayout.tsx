
import { useState } from 'react';
import { useResumeStore } from '../store/resumeStore';
import { templates } from '../data/templates';
import { generateLaTeXFromData } from '../utils/latexConverter';
import {
    FileText,
    Code2,
    Eye,
    Download,
    Moon,
    Sun,
    ChevronLeft,
    ChevronRight,
    LayoutTemplate,
    Sparkles,
    AlertTriangle
} from 'lucide-react';
import { VisualEditor } from './VisualEditor';
import { CodeEditor } from './CodeEditor';
import { PDFPreview } from './PDFPreview';
import { ToastContainer, useToast } from './Toast';
import { TemplateSelector } from './TemplateSelector';
import { AIBuilderModal } from './AIBuilder/AIBuilderModal';
import { AIAssistant } from './AIAssistant/AIAssistant';

type EditorMode = 'visual' | 'code';
type ViewMode = 'editor' | 'templates';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (loadDummyData: boolean) => void;
    templateName: string;
    isDark: boolean;
}

function ConfirmationModal({ isOpen, onClose, onConfirm, templateName, isDark }: ConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className={`w-full max-w-md rounded-2xl shadow-2xl p-6 transform transition-all scale-100 ${isDark ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}>
                <div className="flex items-start gap-4 mb-6">
                    <div className={`p-3 rounded-full ${isDark ? 'bg-amber-900/30 text-amber-500' : 'bg-amber-100 text-amber-600'}`}>
                        <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Load Example Data?
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            You are switching to <strong>{templateName}</strong>. Would you like to load example data for this template?
                        </p>
                        <p className={`text-sm mt-2 font-medium ${isDark ? 'text-amber-500' : 'text-amber-600'}`}>
                            Warning: This will overwrite your current resume data.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => onConfirm(true)}
                        className="w-full py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium transition-colors shadow-lg shadow-violet-200 dark:shadow-none"
                    >
                        Yes, Load Example Data
                    </button>
                    <button
                        onClick={() => onConfirm(false)}
                        className={`w-full py-2.5 px-4 rounded-xl font-medium transition-colors border ${isDark
                            ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-white'
                            : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                            }`}
                    >
                        No, Keep My Data
                    </button>
                    <button
                        onClick={onClose}
                        className={`w-full py-2.5 px-4 rounded-xl font-medium transition-colors text-sm ${isDark ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

interface ModernLayoutProps {
    initialView?: 'editor' | 'templates';
}

export function ModernLayout({ initialView = 'editor' }: ModernLayoutProps) {
    const { settings, setSettings, pdfState, resumeData, setResumeData, setLatexCode } = useResumeStore();
    const { toasts, showToast, removeToast } = useToast();
    const [editorMode, setEditorMode] = useState<EditorMode>('visual');
    const [activeView, setActiveView] = useState<ViewMode>(initialView);
    const [previewCollapsed, setPreviewCollapsed] = useState(false);
    const [showAIBuilder, setShowAIBuilder] = useState(false);
    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; templateId: string; templateName: string } | null>(null);
    const isDark = settings.theme === 'dark';

    const toggleTheme = () => {
        setSettings({ theme: settings.theme === 'light' ? 'dark' : 'light' });
    };

    const handleTemplateChange = (templateId: string) => {
        const template = templates.find(t => t.id === templateId);
        if (!template) return;

        // If clicking the already selected template, just go back to editor
        if (settings.template === templateId) {
            setActiveView('editor');
            return;
        }

        const hasData = resumeData.personalInfo.name.trim() !== '';

        if (hasData) {
            // Show confirmation modal
            setConfirmModal({
                isOpen: true,
                templateId,
                templateName: template.name
            });
        } else {
            // No data, just load dummy data automatically
            applyTemplate(templateId, true);
        }
    };

    const applyTemplate = (templateId: string, loadDummyData: boolean) => {
        const template = templates.find(t => t.id === templateId);
        if (!template) return;

        const newSettings = { ...settings, template: templateId };
        setSettings(newSettings);

        if (loadDummyData) {
            setResumeData(template.dummyData, 'visual');
            const newLatex = generateLaTeXFromData(template.dummyData, templateId);
            setLatexCode(newLatex, 'visual');
            showToast(`Template "${template.name}" applied with example data`, 'success');
        } else {
            const newLatex = generateLaTeXFromData(resumeData, templateId);
            setLatexCode(newLatex, 'visual');
            showToast(`Template "${template.name}" applied`, 'success');
        }

        // Automatically switch back to editor to see changes
        setActiveView('editor');
        setConfirmModal(null);
    };

    const handleDownloadPDF = async () => {
        if (!pdfState.url) {
            showToast('No PDF available. Please wait for compilation or add content to your resume.', 'info');
            return;
        }

        if (pdfState.isCompiling) {
            showToast('PDF is currently compiling. Please wait a moment...', 'info');
            return;
        }

        try {
            const response = await fetch(pdfState.url);
            const blob = await response.blob();

            const userName = resumeData.personalInfo.name.trim();
            const filename = userName
                ? `${userName.replace(/\s+/g, '_')}_Resume.pdf`
                : 'Resume.pdf';

            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename;

            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            URL.revokeObjectURL(downloadUrl);

            showToast(`✅ Resume downloaded as ${filename}`, 'success');
        } catch (error) {
            console.error('Download error:', error);
            showToast('Failed to download PDF. Please try again.', 'error');
        }
    };

    return (
        <div className={`h-screen flex flex-col ${isDark ? 'bg-gray-950' : 'bg-slate-50'}`}>
            {/* Top Navigation Bar */}
            <nav className={`h-16 border-b flex items-center justify-between px-6 backdrop-blur-md z-10 ${isDark
                ? 'bg-gray-900/80 border-gray-800'
                : 'bg-white/80 border-gray-200'
                }`}>
                {/* Left: Logo & Template Navigation */}
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setActiveView('editor')}>
                        <div className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-gray-800 group-hover:bg-gray-700' : 'bg-violet-50 group-hover:bg-violet-100'}`}>
                            <FileText className="h-5 w-5 text-violet-600" />
                        </div>
                        <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Resume<span className="text-violet-600">Nova</span>
                        </span>
                    </div>

                    <div className="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setActiveView('templates')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${activeView === 'templates'
                                ? isDark ? 'bg-gray-800 text-white shadow-sm' : 'bg-white text-violet-600 shadow-md shadow-violet-100 ring-1 ring-violet-100'
                                : isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-violet-600 hover:bg-violet-50'
                                }`}
                        >
                            <LayoutTemplate className="h-4 w-4" />
                            Templates
                        </button>

                        <button
                            onClick={() => setActiveView('editor')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${activeView === 'editor'
                                ? isDark ? 'bg-gray-800 text-white shadow-sm' : 'bg-white text-violet-600 shadow-md shadow-violet-100 ring-1 ring-violet-100'
                                : isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-violet-600 hover:bg-violet-50'
                                }`}
                        >
                            <FileText className="h-4 w-4" />
                            Editor
                        </button>
                    </div>

                    <button
                        onClick={() => setShowAIBuilder(true)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:shadow-lg hover:shadow-violet-200 hover:scale-105`}
                    >
                        <Sparkles className="h-4 w-4" />
                        AI Builder
                    </button>
                </div>

                {/* Center: Editor Mode Toggle (Only visible in Editor view) */}
                {activeView === 'editor' && (
                    <div className={`flex items-center gap-1 p-1.5 rounded-xl border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'
                        }`}>
                        <button
                            onClick={() => setEditorMode('visual')}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${editorMode === 'visual'
                                ? isDark
                                    ? 'bg-violet-600 text-white shadow-sm'
                                    : 'bg-violet-50 text-violet-700 shadow-sm ring-1 ring-violet-200'
                                : isDark
                                    ? 'text-gray-400 hover:text-gray-200'
                                    : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            <FileText className="inline h-4 w-4 mr-2" />
                            Visual
                        </button>
                        <button
                            onClick={() => setEditorMode('code')}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${editorMode === 'code'
                                ? isDark
                                    ? 'bg-violet-600 text-white shadow-sm'
                                    : 'bg-violet-50 text-violet-700 shadow-sm ring-1 ring-violet-200'
                                : isDark
                                    ? 'text-gray-400 hover:text-gray-200'
                                    : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            <Code2 className="inline h-4 w-4 mr-2" />
                            Code
                        </button>
                    </div>
                )}

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDownloadPDF}
                        disabled={!pdfState.url || pdfState.isCompiling}
                        className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 shadow-lg ${!pdfState.url || pdfState.isCompiling
                            ? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-500'
                            : isDark
                                ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-900/20'
                                : 'bg-gray-900 hover:bg-gray-800 text-white shadow-gray-200'
                            }`}
                        title={
                            pdfState.isCompiling
                                ? 'PDF is compiling...'
                                : !pdfState.url
                                    ? 'No PDF available'
                                    : 'Download PDF'
                        }
                    >
                        {pdfState.isCompiling ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                        ) : (
                            <Download className="h-4 w-4" />
                        )}
                        <span className="hidden sm:inline">Download</span>
                    </button>

                    <button
                        onClick={toggleTheme}
                        className={`p-2.5 rounded-full transition-all border ${isDark
                            ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-300'
                            : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600 shadow-sm'
                            }`}
                        title="Toggle Theme"
                    >
                        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>
                </div>
            </nav>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {activeView === 'templates' ? (
                    <TemplateSelector
                        onSelect={handleTemplateChange}
                        currentTemplateId={settings.template}
                        isDark={isDark}
                    />
                ) : (
                    <>
                        {/* Left Panel: Editor */}
                        <div
                            className={`flex-1 flex flex-col border-r min-w-0 transition-all ${isDark ? 'border-gray-800' : 'border-gray-200'
                                } ${previewCollapsed ? 'flex-[2]' : ''}`}
                        >
                            {/* Editor Header */}
                            <div className={`h-14 border-b flex items-center justify-between px-6 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
                                }`}>
                                <div className="flex items-center gap-2">
                                    <div className={`p-1.5 rounded-md ${isDark ? 'bg-gray-800' : 'bg-violet-50'}`}>
                                        {editorMode === 'visual' ? (
                                            <FileText className="h-4 w-4 text-violet-600" />
                                        ) : (
                                            <Code2 className="h-4 w-4 text-violet-600" />
                                        )}
                                    </div>
                                    <span className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {editorMode === 'visual' ? 'Visual Editor' : 'LaTeX Code'}
                                    </span>
                                </div>

                                <button
                                    onClick={() => setPreviewCollapsed(!previewCollapsed)}
                                    className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                                        }`}
                                    title={previewCollapsed ? 'Show Preview' : 'Hide Preview'}
                                >
                                    {previewCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                </button>
                            </div>

                            {/* Editor Content */}
                            <div className={`flex-1 overflow-hidden ${isDark ? 'bg-gray-900' : 'bg-slate-50'}`}>
                                {editorMode === 'visual' ? <VisualEditor /> : <CodeEditor />}
                            </div>
                        </div>

                        {/* Right Panel: PDF Preview */}
                        {!previewCollapsed && (
                            <div className={`flex-1 flex flex-col min-w-0 ${isDark ? 'bg-gray-950' : 'bg-gray-100/50'}`}>
                                {/* Preview Header */}
                                <div className={`h-14 border-b flex items-center justify-between px-6 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
                                    }`}>
                                    <div className="flex items-center gap-2">
                                        <div className={`p-1.5 rounded-md ${isDark ? 'bg-gray-800' : 'bg-violet-50'}`}>
                                            <Eye className="h-4 w-4 text-violet-600" />
                                        </div>
                                        <span className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            PDF Preview
                                        </span>
                                    </div>

                                    {pdfState.isCompiling && (
                                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-900/20">
                                            <div className="animate-spin rounded-full h-3 w-3 border-2 border-violet-600 border-t-transparent"></div>
                                            <span className="text-xs font-medium text-violet-600 dark:text-violet-400">
                                                Compiling...
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Preview Content */}
                                <div className="flex-1 overflow-hidden p-6">
                                    <PDFPreview />
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Toast Notifications */}
            <ToastContainer toasts={toasts} onRemove={removeToast} />

            {/* AI Builder Modal */}
            <AIBuilderModal
                isOpen={showAIBuilder}
                onClose={() => setShowAIBuilder(false)}
                isDark={isDark}
            />

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={!!confirmModal}
                onClose={() => setConfirmModal(null)}
                onConfirm={(loadDummyData) => confirmModal && applyTemplate(confirmModal.templateId, loadDummyData)}
                templateName={confirmModal?.templateName || ''}
                isDark={isDark}
            />

            {/* AI Assistant Chat - Only visible when resume is created/active */}
            {(resumeData.personalInfo.name.trim() !== '' ||
                resumeData.experience.length > 0 ||
                resumeData.education.length > 0 ||
                resumeData.skills.length > 0 ||
                resumeData.projects.length > 0) && (
                    <AIAssistant />
                )}
        </div>
    );
}
