import { useForm } from '@tanstack/react-form';
import { X, Calendar as CalendarIcon, Tag, MessageSquare, FileText, Target, Users, CircleDot, ArrowDownCircle, ArrowUpRight, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { authService } from '../../services/auth.service';
import api from '../../services/api';
import type { Card, CardStatus, Priority, ResponsibleUser } from '../../types/kanban';
import { STATUS_COLORS, STATUS_CATEGORIES, STATUS_TITLE_COLORS, MOCK_USERS, DESCRIPTION_TEMPLATES, AVAILABLE_TAGS } from '../../mock/kanbanData';
import { useState, useRef, useEffect } from 'react';
import { Plus, FileText as FileTextIcon } from 'lucide-react';

interface CardModalProps {
    card: Card;
    onClose: () => void;
    onUpdate: (card: Card) => void;
}

export default function CardModal({ card, onClose, onUpdate }: CardModalProps) {
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isUserOpen, setIsUserOpen] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isPriorityOpen, setIsPriorityOpen] = useState(false);
    const [isTagsOpen, setIsTagsOpen] = useState(false);
    const statusRef = useRef<HTMLDivElement>(null);
    const userRef = useRef<HTMLDivElement>(null);
    const calendarRef = useRef<HTMLDivElement>(null);
    const priorityRef = useRef<HTMLDivElement>(null);
    const tagsRef = useRef<HTMLDivElement>(null);

    // Estados de usuários
    const [users, setUsers] = useState<ResponsibleUser[]>([]);
    const [isUsersLoading, setIsUsersLoading] = useState(false);

    // Buscar usuários reais do backend
    useEffect(() => {
        const loadUsers = async () => {
            setIsUsersLoading(true);
            try {
                const response = await api.get('/users');
                setUsers(response.data);
            } catch (error) {
                console.error('[CardModal] ❌ Erro ao buscar usuários:', error);
                // Fallback para MOCK_USERS transformados em objetos se der erro
                setUsers(MOCK_USERS.map(u => ({ id: u, name: u })));
            } finally {
                setIsUsersLoading(false);
            }
        };
        loadUsers();
    }, []);

    // Obter usuário
    const currentUser = authService.getCurrentUser();
    const isAdmin = currentUser?.role === 'Admin';

    // Função para verificar se usuário pode deletar comentário
    const canDeleteComment = (commentAuthor: string) => {
        return isAdmin || currentUser?.name === commentAuthor;
    };

    // Estado local para comentários (otimização)
    // Removido estado local - usar dados do card diretamente
    // const [localComments, setLocalComments] = useState(card.comments);

    // Removido - usar dados do card diretamente

    // Função para adicionar comentário sem fechar o modal
    const handleAddComment = async () => {
        const newComment = form.getFieldValue('newComment');
        if (newComment && newComment.trim()) {
            // Criar comentário otimista
            const newCommentObj = {
                id: `comment-${Date.now()}`,
                author: currentUser?.name || 'Usuário',
                content: newComment.trim(),
                createdAt: new Date().toISOString(),
            };

            // Adicionar imediatamente à UI (otimista)
            const updatedComments = [...card.comments, newCommentObj];

            // Limpar campo
            form.setFieldValue('newComment', '');

            // Atualizar card com comentários atualizados
            const updatedCard = {
                ...card,
                comments: updatedComments,
                newComment: '',
            };

            // Salvar no backend (background)
            try {
                await onUpdate(updatedCard);
                console.log('[CardModal] ✅ Comentário salvo com sucesso');
            } catch (error) {
                console.error('[CardModal] ❌ Erro ao salvar comentário:', error);
                // Rollback automático via TanStack Query
            }
        }
    };
    const handleDeleteComment = async (commentId: string, e?: React.MouseEvent) => {
        e?.stopPropagation(); // Impedir que o formulário seja submetido

        console.log('[CardModal] 🗑️ Deletando comentário:', commentId);
        console.log('[CardModal] 📋 Comentários antes:', card.comments);

        // Remover imediatamente da UI (otimista)
        const updatedComments = card.comments.filter((comment: any) => comment.id !== commentId);

        // Atualizar card com comentários atualizados
        const updatedCard = {
            ...card,
            comments: updatedComments,
        };

        // Salvar no backend (background)
        try {
            await onUpdate(updatedCard);
            console.log('[CardModal] ✅ Comentário deletado com sucesso');
        } catch (error) {
            console.error('[CardModal] ❌ Erro ao deletar comentário:', error);
            // Rollback automático via TanStack Query
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
                setIsStatusOpen(false);
            }
            if (userRef.current && !userRef.current.contains(event.target as Node)) {
                setIsUserOpen(false);
            }
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setIsCalendarOpen(false);
            }
            if (priorityRef.current && !priorityRef.current.contains(event.target as Node)) {
                setIsPriorityOpen(false);
            }
            if (tagsRef.current && !tagsRef.current.contains(event.target as Node)) {
                setIsTagsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const form = useForm({
        defaultValues: {
            title: card.title,
            responsible: card.responsible,
            status: card.status,
            deadline: card.deadline,
            priority: card.priority,
            description: card.description || '',
            tags: card.tags,
            comments: card.comments,
            newComment: '',
        },
        onSubmit: async ({ value }) => {
            // Não processar comentários aqui - eles são processados pelo handleAddComment
            const updatedCard = {
                ...card,
                ...value,
                comments: card.comments, // Usar comentários locais atualizados
                newComment: '', // Limpar campo newComment
            };

            onUpdate(updatedCard);
            onClose();
        },
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-notion-sidebar border border-notion-border rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b border-notion-border">
                    <div className="flex items-center gap-2 text-notion-text-muted text-sm capitalize">
                        {/* Como não temos LayoutIcon aqui, vou usar um fallback */}
                        <span>{card.status}</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-notion-hover rounded transition-colors text-notion-text-muted hover:text-notion-text"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            form.handleSubmit();
                        }}
                        className="space-y-6"
                    >
                        {/* Title */}
                        <form.Field
                            name="title"
                            children={(field) => (
                                <input
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    className="text-4xl font-bold bg-transparent border-none outline-none w-full text-notion-text placeholder-notion-text-muted/30"
                                    placeholder="Título sem nome"
                                />
                            )}
                        />

                        {/* Properties Grid */}
                        <div className="space-y-1">
                            <PropertyItem icon={<Users size={16} />} label="Responsável(is)">
                                <div className="relative" ref={userRef}>
                                    <form.Field
                                        name="responsible"
                                        children={(field) => (
                                            <>
                                                <div
                                                    className="flex flex-wrap items-center gap-1.5 cursor-pointer p-1 rounded hover:bg-notion-hover transition-colors min-h-[28px]"
                                                    onClick={() => setIsUserOpen(!isUserOpen)}
                                                >
                                                    {field.state.value.length > 0 ? (
                                                        field.state.value.map((person: any) => (
                                                            <div key={person.id} className="flex items-center gap-1.5 bg-notion-hover px-1.5 py-0.5 rounded border border-notion-border">
                                                                <div className="w-4 h-4 rounded-full bg-notion-border flex items-center justify-center text-[8px] font-bold text-notion-text">
                                                                    {person.name[0]}
                                                                </div>
                                                                <span className="text-xs text-notion-text">{person.name}</span>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <span className="text-sm text-notion-text-muted">Ninguém</span>
                                                    )}
                                                </div>

                                                {isUserOpen && (
                                                    <div className="absolute top-full left-0 mt-1 w-56 bg-notion-sidebar border border-notion-border rounded-lg shadow-2xl z-[60] overflow-hidden p-1">
                                                        {isUsersLoading ? (
                                                            <div className="p-4 text-center text-xs text-notion-text-muted">Carregando usuários...</div>
                                                        ) : (
                                                            users.map(user => {
                                                                const isSelected = field.state.value.some((u: any) => u.id === user.id);
                                                                return (
                                                                    <div
                                                                        key={user.id}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            const newValue = isSelected
                                                                                ? field.state.value.filter((u: any) => u.id !== user.id)
                                                                                : [...field.state.value, { id: user.id, name: user.name }];
                                                                            field.handleChange(newValue);
                                                                        }}
                                                                        className={`
                                                                            flex items-center justify-between p-2 rounded cursor-pointer transition-colors
                                                                            ${isSelected ? 'bg-notion-hover' : 'hover:bg-notion-hover'}
                                                                        `}
                                                                    >
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="w-5 h-5 rounded-full bg-notion-hover flex items-center justify-center text-[8px] font-bold border border-notion-border text-notion-text">
                                                                                {user.name[0]}
                                                                            </div>
                                                                            <span className="text-sm text-notion-text">{user.name}</span>
                                                                        </div>
                                                                        {isSelected && (
                                                                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                                        )}
                                                                    </div>
                                                                );
                                                            })
                                                        )}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    />
                                </div>
                            </PropertyItem>

                            <PropertyItem icon={<CircleDot size={16} />} label="Status">
                                <form.Field
                                    name="status"
                                    children={(field) => (
                                        <div className="relative" ref={statusRef}>
                                            <div
                                                className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-notion-hover transition-colors"
                                                onClick={() => setIsStatusOpen(!isStatusOpen)}
                                            >
                                                <span
                                                    className="text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1.5"
                                                    style={{ backgroundColor: STATUS_TITLE_COLORS[field.state.value] || '#373737', color: '#fff' }}
                                                >
                                                    <span
                                                        className="w-1.5 h-1.5 rounded-full"
                                                        style={{ backgroundColor: STATUS_COLORS[field.state.value]?.column || '#fff' }}
                                                    />
                                                    {field.state.value}
                                                </span>
                                            </div>

                                            {isStatusOpen && (
                                                <div className="absolute top-full left-0 mt-1 w-64 bg-notion-sidebar border border-notion-border rounded-lg shadow-2xl z-[60] overflow-hidden p-2">
                                                    {STATUS_CATEGORIES.map(category => (
                                                        <div key={category.name} className="mb-2 last:mb-0">
                                                            <div className="text-[10px] font-bold text-notion-text-muted px-2 py-1 uppercase tracking-wider">
                                                                {category.name}
                                                            </div>
                                                            <div className="space-y-0.5 mt-1">
                                                                {category.statuses.map(status => (
                                                                    <div
                                                                        key={status}
                                                                        onClick={() => {
                                                                            field.handleChange(status as CardStatus);
                                                                            setIsStatusOpen(false);
                                                                            form.handleSubmit();
                                                                        }}
                                                                        className={`
                                                                            flex items-center gap-2 p-1 rounded cursor-pointer transition-colors
                                                                            ${field.state.value === status ? 'bg-notion-hover' : 'hover:bg-notion-hover'}
                                                                        `}
                                                                    >
                                                                        <span
                                                                            className="text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1.5 w-fit"
                                                                            style={{ backgroundColor: STATUS_TITLE_COLORS[status] || '#373737', color: '#fff' }}
                                                                        >
                                                                            <span
                                                                                className="w-1.5 h-1.5 rounded-full"
                                                                                style={{ backgroundColor: STATUS_COLORS[status]?.column || '#fff' }}
                                                                            />
                                                                            {status}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                />
                            </PropertyItem>

                            <PropertyItem icon={<CalendarIcon size={16} />} label="Prazo">
                                <form.Field
                                    name="deadline"
                                    children={(field) => (
                                        <div className="relative" ref={calendarRef}>
                                            <div
                                                className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-notion-hover transition-colors"
                                                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                                            >
                                                <span className="text-sm text-notion-text capitalize">
                                                    {new Date(field.state.value).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>

                                            {isCalendarOpen && (
                                                <div className="absolute top-full left-0 mt-1 z-[60]">
                                                    <NotionCalendar
                                                        value={field.state.value}
                                                        onChange={(date) => {
                                                            field.handleChange(date);
                                                            // form.handleSubmit(); // User requested to keep interactive but not change until backend, 
                                                            // but for UX we'll update the form state. 
                                                            // The prompt said "the date won't be swapped (on the backend/persistence)" 
                                                            // but to feel interactive it should update locally.
                                                        }}
                                                        onClear={() => {
                                                            field.handleChange(new Date().toISOString().split('T')[0]);
                                                            setIsCalendarOpen(false);
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                />
                            </PropertyItem>

                            <PropertyItem icon={<Target size={16} />} label="Feature(s)">
                                <div className="flex items-center gap-2 text-notion-text text-sm">
                                    <Target size={14} className="text-notion-text-muted" />
                                    <span className="border-b border-notion-border/60 hover:border-notion-text transition-colors cursor-pointer">Criação do Wireframe</span>
                                </div>
                            </PropertyItem>

                            <PropertyItem icon={<ArrowDownCircle size={16} />} label="Prioridade">
                                <form.Field
                                    name="priority"
                                    children={(field) => (
                                        <div className="relative" ref={priorityRef}>
                                            <div
                                                className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-notion-hover transition-colors"
                                                onClick={() => setIsPriorityOpen(!isPriorityOpen)}
                                            >
                                                <span
                                                    className={`text-xs font-bold px-2 py-0.5 rounded ${field.state.value === 'Urgente' ? 'bg-red-900/40 text-red-400' :
                                                        field.state.value === 'Média' ? 'bg-orange-900/40 text-orange-400' :
                                                            'bg-green-900/40 text-green-400'
                                                        }`}
                                                >
                                                    {field.state.value}
                                                </span>
                                            </div>

                                            {isPriorityOpen && (
                                                <div className="absolute top-full left-0 mt-1 w-48 bg-notion-sidebar border border-notion-border rounded-lg shadow-2xl z-[60] overflow-hidden p-1">
                                                    {(['Baixa', 'Média', 'Urgente'] as Priority[]).map(priority => (
                                                        <div
                                                            key={priority}
                                                            onClick={() => {
                                                                field.handleChange(priority);
                                                                setIsPriorityOpen(false);
                                                            }}
                                                            className={`
                                                                flex items-center gap-2 p-2 rounded cursor-pointer transition-colors
                                                                ${field.state.value === priority ? 'bg-notion-hover' : 'hover:bg-notion-hover'}
                                                            `}
                                                        >
                                                            <span
                                                                className={`text-xs font-bold px-2 py-0.5 rounded ${priority === 'Urgente' ? 'bg-red-900/40 text-red-400' :
                                                                    priority === 'Média' ? 'bg-orange-900/40 text-orange-400' :
                                                                        'bg-green-900/40 text-green-400'
                                                                    }`}
                                                            >
                                                                {priority}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                />
                            </PropertyItem>

                            <PropertyItem icon={<Tag size={16} />} label="Tags">
                                <form.Field
                                    name="tags"
                                    children={(field) => (
                                        <div className="relative" ref={tagsRef}>
                                            <div
                                                className="flex flex-wrap gap-2 min-h-[32px] p-1 rounded border border-notion-border/30 hover:border-notion-border/60 transition-colors cursor-pointer"
                                                onClick={() => setIsTagsOpen(!isTagsOpen)}
                                            >
                                                {field.state.value.length > 0 ? (
                                                    field.state.value.map((tag: any) => (
                                                        <span
                                                            key={tag.id}
                                                            className="text-xs px-2 py-0.5 rounded font-bold flex items-center gap-1"
                                                            style={{ backgroundColor: `${tag.color}33`, color: tag.color }}
                                                        >
                                                            {tag.name}
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    const newTags = field.state.value.filter((t: any) => t.id !== tag.id);
                                                                    field.handleChange(newTags);
                                                                }}
                                                                className="ml-1 hover:opacity-70 transition-opacity"
                                                            >
                                                                <X size={10} />
                                                            </button>
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-sm text-notion-text-muted">Select an option or create one</span>
                                                )}
                                            </div>

                                            {isTagsOpen && (
                                                <div className="absolute top-full left-0 mt-1 w-64 bg-notion-sidebar border border-notion-border rounded-lg shadow-2xl z-[60] overflow-hidden p-2 max-h-48 overflow-y-auto">
                                                    {AVAILABLE_TAGS.map(tag => {
                                                        const isSelected = field.state.value.some((t: any) => t.id === tag.id);
                                                        return (
                                                            <div
                                                                key={tag.id}
                                                                onClick={() => {
                                                                    const newTags = isSelected
                                                                        ? field.state.value.filter((t: any) => t.id !== tag.id)
                                                                        : [...field.state.value, tag];
                                                                    field.handleChange(newTags);
                                                                }}
                                                                className={`
                                                                    flex items-center gap-2 p-2 rounded cursor-pointer transition-colors
                                                                    ${isSelected ? 'bg-notion-hover' : 'hover:bg-notion-hover'}
                                                                `}
                                                            >
                                                                <span
                                                                    className="text-xs px-2 py-0.5 rounded font-bold"
                                                                    style={{ backgroundColor: `${tag.color}33`, color: tag.color }}
                                                                >
                                                                    {tag.name}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                />
                            </PropertyItem>

                            {/* Attachments shown as Sub-tasks */}
                            <PropertyItem icon={<ArrowUpRight size={16} />} label="Sub-task">
                                <div className="flex flex-col gap-2">
                                    {card.attachments && card.attachments.length > 0 ? (
                                        card.attachments.map(file => (
                                            <div key={file} className="flex items-center gap-2 group/file cursor-pointer">
                                                <FileText size={16} className="text-notion-text-muted group-hover/file:text-notion-text" />
                                                <span className="text-sm font-bold border-b border-notion-border/60 group-hover/file:border-notion-text transition-colors">
                                                    {file.includes('.') ? file.split('.')[0] : file}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-notion-text-muted text-sm italic">Nenhum anexo</span>
                                    )}
                                </div>
                            </PropertyItem>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <div className="text-xs font-bold text-notion-text-muted uppercase tracking-wider">Descrição</div>
                            <form.Field
                                name="description"
                                children={(field) => (
                                    <div className="space-y-4">
                                        {!field.state.value && (
                                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <div className="text-sm text-notion-text-muted">
                                                    Pressione 'Enter' para continuar com uma página vazia, ou escolha um template
                                                    <span className="block text-[10px] opacity-60">(use '↑' e '↓' para selecionar)</span>
                                                </div>

                                                <div className="flex flex-col gap-1">
                                                    <TemplateOption
                                                        icon={<FileTextIcon size={16} />}
                                                        label="Template Front-end Atividades"
                                                        onClick={() => field.handleChange(DESCRIPTION_TEMPLATES.frontend)}
                                                    />
                                                    <TemplateOption
                                                        icon={<FileTextIcon size={16} />}
                                                        label="Template Back-end Atividades"
                                                        onClick={() => field.handleChange(DESCRIPTION_TEMPLATES.backend)}
                                                    />
                                                    <TemplateOption
                                                        icon={<Plus size={16} />}
                                                        label="Novo Template"
                                                        onClick={() => { }}
                                                        isLast
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {(field.state.value || field.state.value === ' ') && (
                                            <textarea
                                                name={field.name}
                                                value={field.state.value === ' ' ? '' : field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                className="w-full bg-notion-hover border border-notion-border rounded-lg p-3 min-h-[150px] outline-none text-notion-text resize-none text-sm transition-all focus:border-notion-text-muted/30"
                                                placeholder="Adicione uma descrição detalhada..."
                                                autoFocus={field.state.value === ' '}
                                            />
                                        )}
                                    </div>
                                )}
                            />
                        </div>

                        {/* Comments Section */}
                        <div className="pt-6 border-t border-notion-border space-y-4">
                            <div className="flex items-center gap-2 text-notion-text font-semibold">
                                <MessageSquare size={18} />
                                <span>Comentários ({card.comments.length})</span>
                            </div>

                            <div className="space-y-4">
                                {card.comments.map((comment: any) => (
                                    <div key={comment.id} className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400 border border-blue-500/30 flex-shrink-0">
                                            {comment.author[0]}
                                        </div>
                                        <div className="space-y-1 flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-notion-text">{comment.author}</span>
                                                    <span className="text-[10px] text-notion-text-muted">{new Date(comment.createdAt).toLocaleString()}</span>
                                                </div>
                                                {canDeleteComment(comment.author) && (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            console.log('[CardModal] 🖱️ Botão deletar clicado!');
                                                            console.log('[CardModal] 🎯 Comment ID:', comment.id);
                                                            console.log('[CardModal] 👤 Comment Author:', comment.author);
                                                            console.log('[CardModal] 👤 Current User:', currentUser?.name);
                                                            console.log('[CardModal] 🛡️ Can Delete:', canDeleteComment(comment.author));

                                                            e.stopPropagation();
                                                            e.preventDefault();
                                                            handleDeleteComment(comment.id, e);
                                                        }}
                                                        className="p-1 hover:bg-red-500/20 rounded transition-colors text-red-400 hover:text-red-300"
                                                        title="Deletar comentário"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                )}
                                            </div>
                                            <p className="text-sm text-notion-text-muted bg-notion-hover px-3 py-2 rounded-lg border border-notion-border inline-block">
                                                {comment.content}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {/* New Comment Input */}
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-notion-hover border border-notion-border flex items-center justify-center text-xs font-bold text-notion-text-muted">
                                        U
                                    </div>
                                    <div className="flex-1 flex gap-2">
                                        <form.Field
                                            name="newComment"
                                            children={(field) => (
                                                <>
                                                    <input
                                                        name={field.name}
                                                        value={field.state.value || ''}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                                e.preventDefault(); // Impedir que o formulário seja submetido
                                                                handleAddComment(); // Adicionar comentário sem fechar
                                                            }
                                                        }}
                                                        className="flex-1 bg-transparent border border-notion-border rounded-lg p-2 text-sm outline-none focus:border-notion-text-muted/50 transition-colors"
                                                        placeholder="Escreva um comentário..."
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={handleAddComment}
                                                        disabled={!field.state.value?.trim()}
                                                        className="px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800/30 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
                                                    >
                                                        Enviar
                                                    </button>
                                                </>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hidden Submit */}
                        <button type="submit" className="hidden" id="card-modal-submit" />
                    </form>
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t border-notion-border flex justify-end gap-3 bg-notion-hover/30">
                    <button
                        onClick={onClose}
                        className="px-4 py-1.5 rounded-lg text-sm font-medium text-notion-text-muted hover:bg-notion-hover hover:text-notion-text transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => {
                            form.handleSubmit();
                            onClose();
                        }}
                        className="px-4 py-1.5 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                    >
                        Salvar Alterações
                    </button>
                </div>
            </div >
        </div >
    );
}

function PropertyItem({ icon, label, children }: { icon: React.ReactNode, label: string, children: React.ReactNode }) {
    return (
        <div className="flex items-start gap-4 px-2 py-1.5 hover:bg-notion-hover/40 rounded transition-colors group relative">
            <div className="flex items-center gap-2 w-36 flex-shrink-0 text-notion-text-muted group-hover:text-notion-text transition-colors">
                <div className="w-4 flex justify-center">{icon}</div>
                <span className="font-medium text-xs tracking-tight">{label}</span>
            </div>
            <div className="flex-1 relative">
                {children}
            </div>
        </div>
    );
}

function TemplateOption({ icon, label, onClick, isLast }: { icon: React.ReactNode, label: string, onClick: () => void, isLast?: boolean }) {
    return (
        <div
            onClick={onClick}
            className={`flex items-center gap-3 p-2 hover:bg-notion-hover rounded-md cursor-pointer transition-colors group/opt ${isLast ? 'mt-1 pt-3 border-t border-notion-border' : ''}`}
        >
            <div className="text-notion-text-muted group-hover/opt:text-notion-text transition-colors">
                {icon}
            </div>
            <span className="text-sm text-notion-text-muted group-hover/opt:text-notion-text transition-colors font-medium">
                {label}
            </span>
        </div>
    );
}

function LayoutIcon({ status }: { status: CardStatus }) {
    const color = STATUS_COLORS[status]?.column || '#373737';
    return (
        <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-full bg-notion-hover border border-notion-border">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
        </div>
    );
}

function NotionCalendar({ value, onChange, onClear }: { value: string, onChange: (date: string) => void, onClear: () => void }) {
    const [currentDate, setCurrentDate] = useState(new Date(value));
    const [selectedDate, setSelectedDate] = useState(new Date(value));

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDateSelect = (day: number) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(newDate);
        onChange(newDate.toISOString().split('T')[0]);
    };

    const handleToday = () => {
        const today = new Date();
        setCurrentDate(today);
        setSelectedDate(today);
        onChange(today.toISOString().split('T')[0]);
    };

    return (
        <div className="bg-notion-sidebar border border-notion-border rounded-lg shadow-2xl p-4 w-[280px]">
            {/* Header Date Display */}
            <div className="mb-4">
                <div className="bg-notion-hover border border-notion-border rounded p-2 text-sm text-notion-text">
                    {selectedDate.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mb-4 px-1">
                <span className="text-sm font-bold text-notion-text capitalize">
                    {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </span>
                <div className="flex items-center gap-1">
                    <button onClick={handleToday} className="text-xs text-notion-text-muted hover:text-notion-text hover:bg-notion-hover px-2 py-1 rounded transition-colors mr-2">
                        Hoje
                    </button>
                    <button onClick={handlePrevMonth} className="p-1 hover:bg-notion-hover rounded transition-colors text-notion-text-muted">
                        <ChevronLeft size={16} />
                    </button>
                    <button onClick={handleNextMonth} className="p-1 hover:bg-notion-hover rounded transition-colors text-notion-text-muted">
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Week Days */}
            <div className="grid grid-cols-7 gap-1 mb-1">
                {weekDays.map(day => (
                    <div key={day} className="text-[10px] text-notion-text-muted text-center font-bold">
                        {day[0]}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-8" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const isSelected = selectedDate.getDate() === day &&
                        selectedDate.getMonth() === currentDate.getMonth() &&
                        selectedDate.getFullYear() === currentDate.getFullYear();
                    const isToday = new Date().getDate() === day &&
                        new Date().getMonth() === currentDate.getMonth() &&
                        new Date().getFullYear() === currentDate.getFullYear();

                    return (
                        <div
                            key={day}
                            onClick={() => handleDateSelect(day)}
                            className={`
                                h-8 w-8 flex items-center justify-center rounded cursor-pointer text-xs transition-colors
                                ${isSelected ? 'bg-blue-600 text-white font-bold' :
                                    isToday ? 'text-blue-500 font-bold hover:bg-notion-hover' :
                                        'text-notion-text hover:bg-notion-hover'}
                            `}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>

            {/* Footer Buttons */}
            <div className="mt-4 pt-2 border-t border-notion-border flex flex-col gap-1">
                <button
                    onClick={onClear}
                    className="w-full text-left text-xs text-notion-text-muted hover:text-notion-text hover:bg-notion-hover px-2 py-1.5 rounded transition-colors"
                >
                    Limpar
                </button>
                <div className="px-2 py-2 text-[10px] text-notion-text-muted flex items-center gap-1.5 border-t border-notion-border mt-1 opacity-50">
                    <div className="w-3 h-3 rounded-full bg-notion-hover flex items-center justify-center">?</div>
                    Sobre lembretes
                </div>
            </div>
        </div>
    );
}
