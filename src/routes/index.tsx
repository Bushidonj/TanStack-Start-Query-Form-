import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { INITIAL_COLUMNS } from '../mock/kanbanData'
import type { Card, CardStatus } from '../types/kanban'
import { useKanban } from '../hooks/useKanban'
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core'
import type { DragOverEvent, DragStartEvent } from '@dnd-kit/core'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import CardModal from '../components/modal/CardModal'
import { KanbanColumn } from '../components/kanban/KanbanColumn'
import { KanbanCard } from '../components/card/KanbanCard'

export const Route = createFileRoute('/')({
  component: KanbanPage,
})

function KanbanPage() {
  const router = useRouter()
  const { cards, moveCard, updateCard, addCard, isInitialLoading, isMutationPending } = useKanban()
  const [activeCard, setActiveCard] = useState<Card | null>(null)
  const [editingCard, setEditingCard] = useState<Card | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Verificar autenticação
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
    if (!isAuthenticated) {
      router.navigate({ to: '/login' })
      return
    }
    setIsMounted(true)
  }, [router])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  )

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Card') {
      setActiveCard(event.active.data.current.card)
    }
  }

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const isActiveACard = active.data.current?.type === 'Card'
    const isOverACard = over.data.current?.type === 'Card'
    const isOverAColumn = over.data.current?.type === 'Column'

    if (!isActiveACard) return

    // Dropping a Card over another Card
    if (isActiveACard && isOverACard) {
      const overCardStatus = over.data.current?.card.status
      if (active.data.current?.card.status !== overCardStatus) {
        moveCard({ cardId: activeId as string, newStatus: overCardStatus })
      }
    }

    // Dropping a Card over a Column
    if (isActiveACard && isOverAColumn) {
      moveCard({ cardId: activeId as string, newStatus: overId as CardStatus })
    }
  }

  return (
    <div className="flex flex-col h-full bg-notion-bg">
      <header className="px-8 pt-8 pb-4">
        <div className="flex items-center justify-between group">
          <h1 className="text-3xl font-bold flex items-center gap-2 text-notion-text">
            <span>🚀</span>
            Kanban / Backlog de Produto
          </h1>
          {isMutationPending && (
            <div className="flex items-center gap-2 text-[11px] text-notion-text-muted animate-in fade-in duration-300">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span>Salvando alterações...</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 mt-6 text-sm text-notion-text-muted border-b border-notion-border pb-2">
          <div className="px-2 py-1 bg-notion-hover text-notion-text rounded cursor-pointer">Board</div>
          <div className="px-2 py-1 hover:bg-notion-hover rounded cursor-pointer transition-colors text-notion-text-muted">Project Info</div>
        </div>
      </header>

      {!isMounted || isInitialLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-notion-text/20 border-t-notion-text rounded-full animate-spin" />
            <span className="text-sm text-notion-text-muted animate-pulse">Carregando Board...</span>
          </div>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={() => setActiveCard(null)}
        >
          <div className="flex-1 overflow-x-auto overflow-y-hidden px-8 pb-8 flex gap-4 min-h-0">
            {INITIAL_COLUMNS.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                cards={cards.filter(c => c.status === column.id)}
                onEditCard={setEditingCard}
                onAddCard={(status) => {
                  const newCard: Card = {
                    id: `new-${Date.now()}`,
                    title: '',
                    description: '',
                    responsible: [],
                    status,
                    deadline: new Date().toISOString().split('T')[0],
                    priority: 'Baixa',
                    tags: [],
                    comments: [],
                  };
                  setEditingCard(newCard);
                }}
              />
            ))}
            <div className="min-w-[280px] w-[280px] h-fit opacity-50 hover:opacity-100 cursor-pointer flex items-center gap-2 p-2 rounded hover:bg-notion-hover transition-all text-notion-text-muted">
              <Plus size={16} />
              <span className="text-sm font-medium">Adicionar coluna</span>
            </div>
          </div>

          {createPortal(
            <DragOverlay dropAnimation={{
              sideEffects: defaultDropAnimationSideEffects({
                styles: {
                  active: {
                    opacity: '0.5',
                  },
                },
              }),
            }}>
              {activeCard && <KanbanCard card={activeCard} isOverlay />}
            </DragOverlay>,
            document.body
          )}

          {editingCard && (
            <CardModal
              card={cards.find(c => c.id === editingCard.id) || editingCard}
              onClose={() => setEditingCard(null)}
              onUpdate={editingCard.id.startsWith('new-') ? (card) => addCard(card) : updateCard}
            />
          )}
        </DndContext>
      )}
    </div>
  )
}
