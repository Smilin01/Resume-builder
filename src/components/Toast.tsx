import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContainerProps {
    toasts: Toast[];
    onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
    return (
        <div className="fixed bottom-24 right-6 z-50 flex flex-col gap-3 pointer-events-none">
            {toasts.map((toast) => (
                <ToastNotification
                    key={toast.id}
                    toast={toast}
                    onRemove={onRemove}
                />
            ))}
        </div>
    );
}

interface ToastNotificationProps {
    toast: Toast;
    onRemove: (id: string) => void;
}

function ToastNotification({ toast, onRemove }: ToastNotificationProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onRemove(toast.id);
        }, 4000); // Auto-dismiss after 4 seconds

        return () => clearTimeout(timer);
    }, [toast.id, onRemove]);

    const getIcon = () => {
        switch (toast.type) {
            case 'success':
                return <CheckCircle2 className="h-5 w-5 text-violet-500" />;
            case 'error':
                return <XCircle className="h-5 w-5 text-red-500" />;
            case 'info':
                return <AlertCircle className="h-5 w-5 text-blue-500" />;
        }
    };

    const getStyles = () => {
        switch (toast.type) {
            case 'success':
                return 'border-violet-100 bg-white/90 dark:bg-gray-900/90 dark:border-violet-900/30 shadow-violet-500/10';
            case 'error':
                return 'border-red-100 bg-white/90 dark:bg-gray-900/90 dark:border-red-900/30 shadow-red-500/10';
            case 'info':
                return 'border-blue-100 bg-white/90 dark:bg-gray-900/90 dark:border-blue-900/30 shadow-blue-500/10';
        }
    };

    return (
        <div
            className={`
                pointer-events-auto
                flex items-start gap-3 px-4 py-3 rounded-2xl border shadow-xl backdrop-blur-md
                ${getStyles()}
                animate-in slide-in-from-right-full fade-in duration-300
                min-w-[320px] max-w-md transform transition-all hover:scale-[1.02]
            `}
        >
            <div className="mt-0.5 shrink-0">
                {getIcon()}
            </div>
            <div className="flex-1">
                <p className={`text-sm font-medium ${toast.type === 'success' ? 'text-violet-950 dark:text-violet-100' : 'text-gray-900 dark:text-gray-100'}`}>
                    {toast.type === 'success' ? 'Success' : toast.type === 'error' ? 'Error' : 'Info'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5 leading-relaxed">
                    {toast.message}
                </p>
            </div>
            <button
                onClick={() => onRemove(toast.id)}
                className="shrink-0 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}

// Custom hook for managing toasts
export function useToast() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substring(7);
        setToasts((prev) => [...prev, { id, message, type }]);
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return {
        toasts,
        showToast,
        removeToast,
    };
}
