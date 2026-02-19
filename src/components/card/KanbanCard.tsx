import { MoreHorizontal, FileText, Calendar, MessageSquare, CheckSquare, ArrowUpRight, Trash2, ChevronDown } from 'lucide-react';
import { formatLocalDate } from '../../utils/date';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState, useRef, useEffect } from 'react';
import type { Card, Priority } from '../../types/kanban';
import { STATUS_COLORS, STATUS_TITLE_COLORS } from '../../mock/kanbanData';

interface KanbanCardProps {
    card: Card;
    isOverlay?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
}

export function KanbanCard({ card, isOverlay, onEdit, onDelete }: KanbanCardProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: card.id,
        data: {
            type: 'Card',
            card,
        },
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const bgMain = STATUS_COLORS[card.status]?.card || '#202020';
    const statusColorMap = STATUS_TITLE_COLORS[card.status] || '#373737';

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        backgroundColor: bgMain,
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="border border-notion-border rounded-lg p-3 h-[120px] opacity-30 shadow-inner"
            />
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => {
                if (isOverlay) return;
                onEdit?.();
            }}
            className={`
        border border-notion-border/40 rounded-lg p-4 shadow-sm 
        hover:border-notion-text-muted/30 cursor-grab active:cursor-grabbing transition-all group
        ${isOverlay ? 'shadow-xl rotate-1 scale-105 border-blue-500 z-50' : 'opacity-90 hover:opacity-100 hover:bg-opacity-80'}
      `}
        >
            <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1">
                        <div className="mt-1 text-notion-text-muted">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        </div>
                        <h3 className="text-[13px] font-bold leading-tight text-notion-text uppercase tracking-tight">
                            {card.title}
                        </h3>
                    </div>
                    <div className="relative" ref={menuRef}>
                        <button
                            className="p-1 text-notion-text-muted hover:text-notion-text hover:bg-notion-hover rounded transition-colors flex-shrink-0"
                            onClick={(e) => {
                                e.stopPropagation()
                                setIsMenuOpen(!isMenuOpen)
                            }}
                        >
                            <MoreHorizontal size={14} />
                        </button>
                        
                        {isMenuOpen && (
                            <div className="absolute top-full right-0 mt-1 w-40 bg-notion-sidebar border border-notion-border rounded-lg shadow-2xl z-[60] overflow-hidden">
                                <div
                                    className="flex items-center gap-2 p-2 hover:bg-notion-hover cursor-pointer transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setIsMenuOpen(false)
                                        onEdit?.()
                                    }}
                                >
                                    <ArrowUpRight size={14} className="text-notion-text-muted" />
                                    <span className="text-sm text-notion-text">Abrir</span>
                                </div>
                                <div
                                    className="flex items-center gap-2 p-2 hover:bg-notion-hover cursor-pointer transition-colors text-red-400"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setIsMenuOpen(false)
                                        onDelete?.()
                                    }}
                                >
                                    <Trash2 size={14} />
                                    <span className="text-sm">Deletar</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                    <div className="flex flex-col gap-1">
                        {card.responsible.map((person) => {
                            const name = typeof person.name === 'string' ? person.name : (typeof person === 'string' ? person : 'Usuário');
                            const initial = name.charAt(0).toUpperCase();
                            return (
                                <div key={person.id || name} className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-notion-hover flex items-center justify-center text-[10px] font-bold border border-notion-border text-notion-text flex-shrink-0">
                                        {initial}
                                    </div>
                                    <span className="text-[11px] text-notion-text-muted font-medium truncate">{name}</span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-2 self-start">
                        {card.comments.length > 0 && (
                            <div className="flex items-center gap-1 text-notion-text-muted">
                                <MessageSquare size={12} />
                                <span className="text-[10px]">{card.comments.length}</span>
                            </div>
                        )}
                        {card.subtasks && card.subtasks.length > 0 && (
                            <div className="flex items-center gap-1 text-notion-text-muted">
                                <CheckSquare size={12} />
                                <span className="text-[10px]">
                                    {card.subtasks.filter(s => s.completed).length}/{card.subtasks.length}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {card.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {card.tags.map(tag => (
                            <span
                                key={tag.id}
                                className="text-[10px] px-2 py-0.5 rounded font-bold"
                                style={{ backgroundColor: tag.color ? `${tag.color}33` : '#373737', color: tag.color || '#fff' }}
                            >
                                {tag.name}
                            </span>
                        ))}
                    </div>
                )}

                {card.description && (
                    <div className="relative">
                        <div 
                            className={`text-[11px] text-notion-text-muted leading-relaxed overflow-hidden transition-all duration-300 ${
                                isDescriptionExpanded ? 'max-h-32 overflow-y-auto' : 'max-h-12'
                            }`}
                        >
                            {card.description}
                        </div>
                        
                        {card.description.length > 50 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsDescriptionExpanded(!isDescriptionExpanded);
                                }}
                                className="flex items-center gap-1 text-[10px] text-notion-text-muted hover:text-notion-text mt-1 transition-colors"
                            >
                                <ChevronDown 
                                    size={12} 
                                    className={`transition-transform duration-300 ${isDescriptionExpanded ? 'rotate-180' : ''}`}
                                />
                                <span>{isDescriptionExpanded ? 'Mostrar menos' : 'Mostrar mais'}</span>
                            </button>
                        )}
                    </div>
                )}

                {!card.description && (
                    <div className="flex items-center gap-2 text-notion-text-muted group/feat">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>
                        <span className="text-[10px] font-medium truncate">Criação de interface em código</span>
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1.5"
                        style={{ backgroundColor: statusColorMap, color: '#fff' }}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                        {card.status}
                    </span>
                    <PriorityBadge priority={card.priority} />
                </div>

                <div className="flex flex-col gap-2 pt-2 border-t border-notion-border/30">
                    <div className="flex items-center gap-2 text-notion-text-muted">
                        <Calendar size={12} className="opacity-60" />
                        <span className="text-[10px] font-medium">
                            Entrega: {formatLocalDate(card.deadline, 'pt-BR', { day: '2-digit', month: 'short' })}
                        </span>
                    </div>

                    {card.attachments && card.attachments.length > 0 && (
                        <div className="flex flex-col gap-1">
                            {card.attachments.map((file, index) => {
                                const fileName = typeof file === 'string' ? file : file.name;
                                const fileKey = typeof file === 'string' ? file : (file.id || index);
                                return (
                                    <div
                                        key={fileKey}
                                        className="flex items-center gap-2 p-1.5 rounded bg-notion-hover/50 hover:bg-notion-hover border border-notion-border/40 transition-colors group/file text-notion-text-muted hover:text-notion-text"
                                    >
                                        <FileText size={12} className="group-hover/file:text-blue-400 transition-colors" />
                                        <span className="text-[10px] font-medium truncate">{fileName}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function PriorityBadge({ priority }: { priority: Priority }) {
    const colors = {
        'Baixa': 'text-priority-low bg-priority-low/10',
        'Média': 'text-priority-medium bg-priority-medium/10',
        'Urgente': 'text-priority-urgent bg-priority-urgent/10',
    }

    return (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${colors[priority]}`}>
            {priority}
        </span>
    )
}
