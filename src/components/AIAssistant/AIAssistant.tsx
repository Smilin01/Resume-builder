
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

        try {
            const updatedLatex = await updateResumeWithAI(latexCode, userMessage.content);

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
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
            >
                <Sparkles className="h-6 w-6" />
                <span className="font-medium">AI Assistant</span>
            </button>
        );
    }

    return (
        <div className={`fixed bottom-6 right-6 z-50 w-80 md:w-96 rounded-xl shadow-2xl flex flex-col transition-all duration-300 ${isMinimized ? 'h-14' : 'h-[500px]'
            } ${isDark ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'}`}>

            {/* Header */}
            <div className={`p-4 border-b flex items-center justify-between rounded-t-xl ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-indigo-600 text-white'
                }`}>
                <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    <span className="font-semibold">AI Assistant</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="p-1 hover:bg-white/20 rounded"
                    >
                        {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 hover:bg-white/20 rounded"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            {!isMinimized && (
                <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user'
                                        ? 'bg-indigo-100 text-indigo-600'
                                        : 'bg-emerald-100 text-emerald-600'
                                    }`}>
                                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                </div>
                                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-tr-none'
                                        : isDark
                                            ? 'bg-gray-800 text-gray-200 rounded-tl-none'
                                            : 'bg-gray-100 text-gray-800 rounded-tl-none'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isProcessing && (
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                                    <Bot size={16} />
                                </div>
                                <div className={`p-3 rounded-lg rounded-tl-none ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                    <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSubmit} className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask for changes..."
                                className={`flex-1 p-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark
                                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                        : 'bg-white border-gray-300 text-gray-900'
                                    }`}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isProcessing}
                                className={`p-2 rounded-lg bg-indigo-600 text-white transition-colors ${!input.trim() || isProcessing
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:bg-indigo-700'
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
