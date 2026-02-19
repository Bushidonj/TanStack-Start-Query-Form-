import { Plus, MoreHorizontal } from 'lucide-react';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Column, Card, CardStatus } from '../../types/kanban';
import { STATUS_COLORS, STATUS_TITLE_COLORS } from '../../mock/kanbanData';
import { KanbanCard } from '../card/KanbanCard';

interface KanbanColumnProps {
    column: Column;
    cards: Card[];
    onEditCard: (card: Card) => void;
    onDeleteCard: (card: Card) => void;
    onAddCard: (status: CardStatus) => void;
}

export function KanbanColumn({ column, cards, onEditCard, onDeleteCard, onAddCard }: KanbanColumnProps) {
    const { setNodeRef } = useSortable({
        id: column.id,
        data: {
            type: 'Column',
            column,
        },
    });

    const colColor = STATUS_COLORS[column.id]?.column || 'transparent';
    const titleBg = STATUS_TITLE_COLORS[column.id] || '#373737';

    return (
        <div className="min-w-[280px] w-[280px] flex flex-col gap-3 group h-full">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                    <span
                        className="text-xs font-bold px-2 py-0.5 rounded shadow-sm border border-white/5"
                        style={{ backgroundColor: titleBg, color: '#fff' }}
                    >
                        {column.title}
                    </span>
                    <span className="text-notion-text-muted text-xs font-medium">{cards.length}</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus
                        size={14}
                        className="text-notion-text-muted hover:text-notion-text cursor-pointer"
                        onClick={() => onAddCard(column.id)}
                    />
                    <MoreHorizontal size={14} className="text-notion-text-muted hover:text-notion-text cursor-pointer" />
                </div>
            </div>

            <div
                ref={setNodeRef}
                className="flex flex-col gap-2 rounded-xl p-2 transition-all min-h-[44px] overflow-y-auto pb-4 pr-1 scrollbar-thin h-fit"
                style={{ backgroundColor: colColor }}
            >
                <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
                    {cards.map(card => (
                        <KanbanCard 
                            key={card.id} 
                            card={card} 
                            onEdit={() => onEditCard(card)} 
                            onDelete={() => onDeleteCard(card)}
                        />
                    ))}
                </SortableContext>

                <div
                    className="flex items-center gap-2 p-2 mt-auto text-notion-text-muted hover:bg-white/5 rounded-lg cursor-pointer transition-all text-sm group/btn border border-transparent hover:border-white/5"
                    onClick={() => onAddCard(column.id)}
                >
                    <Plus size={14} className="group-hover/btn:text-notion-text" />
                    <span className="group-hover/btn:text-notion-text font-medium">Nova Tarefa</span>
                </div>
            </div>
        </div>
    );
}
