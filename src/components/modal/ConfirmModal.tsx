import { X, Trash2 } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'delete' | 'warning';
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    type = 'delete'
}: ConfirmModalProps) {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
        if (e.key === 'Enter' && e.shiftKey === false) {
            e.preventDefault();
            handleConfirm();
        }
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={onClose}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
        >
            <div 
                className="bg-notion-sidebar border border-notion-border rounded-xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-4 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b border-notion-border">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                            type === 'delete' 
                                ? 'bg-red-500/10 text-red-400' 
                                : 'bg-orange-500/10 text-orange-400'
                        }`}>
                            <Trash2 size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-notion-text">
                            {title}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-notion-hover rounded transition-colors text-notion-text-muted hover:text-notion-text"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    <p className="text-notion-text-muted leading-relaxed">
                        {message}
                    </p>
                    
                    {type === 'delete' && (
                        <div className="mt-4 p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                            <p className="text-xs text-red-400 font-medium">
                                ⚠️ Esta ação não pode ser desfeita
                            </p>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 p-4 border-t border-notion-border bg-notion-hover/30">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-notion-text-muted hover:text-notion-text hover:bg-notion-hover rounded-lg transition-colors cursor-pointer"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                            type === 'delete'
                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                : 'bg-orange-500 hover:bg-orange-600 text-white'
                        }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
