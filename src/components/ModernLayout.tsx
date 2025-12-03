
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
    Sparkles
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

export function ModernLayout() {
    const { settings, setSettings, pdfState, resumeData, setResumeData, setLatexCode } = useResumeStore();
    const { toasts, showToast, removeToast } = useToast();
    const [editorMode, setEditorMode] = useState<EditorMode>('visual');
    const [activeView, setActiveView] = useState<ViewMode>('editor');
    const [previewCollapsed, setPreviewCollapsed] = useState(false);
    const [showAIBuilder, setShowAIBuilder] = useState(false);
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
        let shouldLoadDummyData = false;

        if (hasData) {
            if (window.confirm(`Load example data for "${template.name}"?\n\nThis will overwrite your current resume.`)) {
                shouldLoadDummyData = true;
            }
        } else {
            shouldLoadDummyData = true;
        }

        const newSettings = { ...settings, template: templateId };
        setSettings(newSettings);

        if (shouldLoadDummyData) {
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
        <div className={`h-screen flex flex-col ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
            {/* Top Navigation Bar */}
            <nav className={`h-14 border-b flex items-center justify-between px-4 ${isDark
                ? 'bg-gray-900 border-gray-800'
                : 'bg-white border-gray-200'
                }`}>
                {/* Left: Logo & Template Navigation */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveView('editor')}>
                        <FileText className="h-6 w-6 text-emerald-500" />
                        <span className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Resume Builder
                        </span>
                    </div>

                    <div className="h-6 w-px bg-gray-300 dark:bg-gray-700"></div>

                    <button
                        onClick={() => setActiveView('templates')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeView === 'templates'
                            ? isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'
                            : isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                    >
                        <LayoutTemplate className="h-4 w-4" />
                        Templates
                    </button>

                    <button
                        onClick={() => setActiveView('editor')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeView === 'editor'
                            ? isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'
                            : isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                    >
                        <FileText className="h-4 w-4" />
                        Editor
                    </button>

                    <button
                        onClick={() => setShowAIBuilder(true)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-sm`}
                    >
                        <Sparkles className="h-4 w-4" />
                        AI Builder
                    </button>
                </div>

                {/* Center: Editor Mode Toggle (Only visible in Editor view) */}
                {activeView === 'editor' && (
                    <div className={`flex items-center gap-1 p-1 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'
                        }`}>
                        <button
                            onClick={() => setEditorMode('visual')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${editorMode === 'visual'
                                ? isDark
                                    ? 'bg-emerald-600 text-white shadow-sm'
                                    : 'bg-emerald-500 text-white shadow-sm'
                                : isDark
                                    ? 'text-gray-400 hover:text-gray-200'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <FileText className="inline h-4 w-4 mr-1.5" />
                            Visual
                        </button>
                        <button
                            onClick={() => setEditorMode('code')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${editorMode === 'code'
                                ? isDark
                                    ? 'bg-emerald-600 text-white shadow-sm'
                                    : 'bg-emerald-500 text-white shadow-sm'
                                : isDark
                                    ? 'text-gray-400 hover:text-gray-200'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <Code2 className="inline h-4 w-4 mr-1.5" />
                            Code
                        </button>
                    </div>
                )}

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleDownloadPDF}
                        disabled={!pdfState.url || pdfState.isCompiling}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${!pdfState.url || pdfState.isCompiling
                            ? 'opacity-50 cursor-not-allowed'
                            : isDark
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                            }`}
                        title={
                            pdfState.isCompiling
                                ? 'PDF is compiling...'
                                : !pdfState.url
                                    ? 'No PDF available'
                                    : 'Download PDF'
                        }
                    >
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">Download</span>
                    </button>

                    <button
                        onClick={toggleTheme}
                        className={`p-2 rounded-lg transition-all ${isDark
                            ? 'hover:bg-gray-800 text-gray-300'
                            : 'hover:bg-gray-100 text-gray-600'
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
                            className={`flex-1 flex flex-col border-r transition-all ${isDark ? 'border-gray-800' : 'border-gray-200'
                                } ${previewCollapsed ? 'flex-[2]' : ''}`}
                        >
                            {/* Editor Header */}
                            <div className={`h-12 border-b flex items-center justify-between px-4 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'
                                }`}>
                                <div className="flex items-center gap-2">
                                    {editorMode === 'visual' ? (
                                        <FileText className="h-4 w-4 text-emerald-500" />
                                    ) : (
                                        <Code2 className="h-4 w-4 text-emerald-500" />
                                    )}
                                    <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {editorMode === 'visual' ? 'Visual Editor' : 'LaTeX Code'}
                                    </span>
                                </div>

                                <button
                                    onClick={() => setPreviewCollapsed(!previewCollapsed)}
                                    className={`p-1.5 rounded transition-all ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
                                        }`}
                                    title={previewCollapsed ? 'Show Preview' : 'Hide Preview'}
                                >
                                    {previewCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                </button>
                            </div>

                            {/* Editor Content */}
                            <div className="flex-1 overflow-hidden">
                                {editorMode === 'visual' ? <VisualEditor /> : <CodeEditor />}
                            </div>
                        </div>

                        {/* Right Panel: PDF Preview */}
                        {!previewCollapsed && (
                            <div className={`flex-1 flex flex-col ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
                                {/* Preview Header */}
                                <div className={`h-12 border-b flex items-center justify-between px-4 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'
                                    }`}>
                                    <div className="flex items-center gap-2">
                                        <Eye className="h-4 w-4 text-emerald-500" />
                                        <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            PDF Preview
                                        </span>
                                    </div>

                                    {pdfState.isCompiling && (
                                        <div className="flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-500 border-t-transparent"></div>
                                            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Compiling...
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Preview Content */}
                                <div className="flex-1 overflow-hidden">
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

            {/* AI Assistant Chat */}
            <AIAssistant />
        </div>
    );
}
