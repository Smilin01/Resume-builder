
import { useState, useRef, useEffect } from 'react';
import { Send, X, Sparkles, Bot, User, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';
import { updateResumeWithAI } from '../../services/aiService';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'Hi! I can help you edit your resume. You can ask me to "shorten the summary", "remove the education section", or "fit everything to one page". What would you like to do?'
        }
    ]);

    const { latexCode, setLatexCode, triggerRecompile, settings } = useResumeStore();
    const isDark = settings.theme === 'dark';
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isProcessing) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsProcessing(true);
        setLoadingStep(0);

        try {
            // Step 1: Analyzing request
            setLoadingStep(1);
            await new Promise(resolve => setTimeout(resolve, 400));

            // Step 2: Processing with AI
            setLoadingStep(2);
            const updatedLatex = await updateResumeWithAI(latexCode, userMessage.content);

            // Step 3: Applying changes
            setLoadingStep(3);
            await new Promise(resolve => setTimeout(resolve, 300));

            setLatexCode(updatedLatex, 'code');
            triggerRecompile();

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'I\'ve updated your resume based on your request. Check the preview!'
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error(error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Sorry, I encountered an error while processing your request. Please try again.'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsProcessing(false);
            setLoadingStep(0);
        }
    };

    const handleQuickCommand = (command: string) => {
        if (isProcessing) return;
        setInput(command);
        // Trigger submit programmatically
        setTimeout(() => {
            const form = document.querySelector('form');
            if (form) {
                form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
            }
        }, 100);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2 group"
            >
                <Sparkles className="h-6 w-6 group-hover:animate-spin-slow" />
                <span className="font-bold">AI Assistant</span>
            </button>
        );
    }

    return (
        <div className={`fixed bottom-6 right-6 z-50 w-80 md:w-96 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[600px]'
            } ${isDark ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'}`}>

            {/* Header */}
            <div className={`p-4 border-b flex items-center justify-between rounded-t-2xl ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white'
                }`}>
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Bot className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">AI Assistant</h3>
                        <span className="text-xs opacity-80 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                            Online
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            {!isMinimized && (
                <>
                    <div className={`flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin ${isDark ? 'scrollbar-thumb-gray-700' : 'scrollbar-thumb-gray-200'}`}>
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user'
                                    ? 'bg-violet-100 text-violet-600'
                                    : 'bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white'
                                    }`}>
                                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                </div>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user'
                                    ? 'bg-violet-600 text-white rounded-tr-none'
                                    : isDark
                                        ? 'bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700'
                                        : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isProcessing && (
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                                    <Bot size={16} />
                                </div>
                                <div className={`flex-1 p-3 rounded-2xl rounded-tl-none shadow-sm ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
                                    <div className="space-y-2">
                                        {/* Show only current step */}
                                        {[
                                            { step: 1, label: 'Analyzing request...' },
                                            { step: 2, label: 'Processing with AI...' },
                                            { step: 3, label: 'Applying changes...' }
                                        ].map((item) => {
                                            if (loadingStep === item.step) {
                                                return (
                                                    <div key={item.step} className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom-1 duration-200">
                                                        <Loader2 className="h-4 w-4 animate-spin text-violet-600" />
                                                        <span className="text-sm font-medium text-violet-600 dark:text-violet-400">
                                                            {item.label}
                                                        </span>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Actions */}
                    <div className={`px-4 pb-2 ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}>
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mask-linear-fade">
                            {[
                                "Fit to one page",
                                "Fix grammar & typos",
                                "Enhance professional tone",
                                "Elaborate bullet points",
                                "Summarize for brevity"
                            ].map((cmd) => (
                                <button
                                    key={cmd}
                                    onClick={() => handleQuickCommand(cmd)}
                                    className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border shadow-sm ${isDark
                                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700 hover:border-violet-500 hover:text-violet-400'
                                        : 'bg-white hover:bg-violet-50 text-gray-600 border-gray-200 hover:border-violet-200 hover:text-violet-700'
                                        }`}
                                >
                                    {cmd}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSubmit} className={`p-4 border-t ${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-100 bg-gray-50/50'}`}>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask for changes..."
                                className={`flex-1 p-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all ${isDark
                                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 shadow-sm'
                                    }`}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isProcessing}
                                className={`p-2.5 rounded-xl bg-violet-600 text-white transition-all shadow-md shadow-violet-200 dark:shadow-none ${!input.trim() || isProcessing
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:bg-violet-700 hover:scale-105'
                                    }`}
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
}
