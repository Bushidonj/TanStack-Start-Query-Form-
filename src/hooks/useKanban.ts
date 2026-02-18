import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/task.service';
import type { CardStatus } from '../types/kanban';

export function useKanban() {
  const queryClient = useQueryClient();

  // Query to fetch cards do backend REAL
  const { data: cards = [], isPending: isQueryPending } = useQuery({
    queryKey: ['cards'],
    queryFn: taskService.getTasks,
    staleTime: 1000 * 60, // 1 minuto
  });

  // Log para debug
  console.log('[useKanban] 🔍 Cards data:', cards);
  console.log('[useKanban] 📊 Cards length:', cards.length);
  console.log('[useKanban] ⏳ Is pending:', isQueryPending);

  if (cards.length > 0) {
    console.log('[useKanban] ✅ First card:', cards[0]);
  }

  // Mutation para criar card
  const createCardMutation = useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
  });

  // Mutation para atualizar card
  const updateCardMutation = useMutation({
    mutationFn: taskService.updateTask,
    onMutate: async (updatedCard) => {
      // Cancelar queries em andamento
      await queryClient.cancelQueries({ queryKey: ['cards'] });
      
      // Snapshot do estado anterior
      const previousCards = queryClient.getQueryData(['cards']);
      
      // Atualização otimista
      queryClient.setQueryData(['cards'], (old: any[] = []) => 
        old.map(card => card.id === updatedCard.id ? updatedCard : card)
      );
      
      return { previousCards };
    },
    onError: (_error, _updatedCard, context: any) => {
      // Rollback em caso de erro
      queryClient.setQueryData(['cards'], context.previousCards);
    },
    onSettled: () => {
      // Refetch para garantir consistência
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
  });

  // Mutation para mover card (mudar status)
  const moveCardMutation = useMutation({
    mutationFn: ({ cardId, newStatus }: { cardId: string; newStatus: CardStatus }) => 
      taskService.moveTask(cardId, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
  });

  // Mutation para deletar card
  const deleteCardMutation = useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
  });

  return {
    cards,
    addCard: createCardMutation.mutate,
    updateCard: updateCardMutation.mutate,
    moveCard: moveCardMutation.mutate,
    deleteCard: deleteCardMutation.mutate,
    isInitialLoading: isQueryPending,
    isMutationPending: createCardMutation.isPending || updateCardMutation.isPending || moveCardMutation.isPending || deleteCardMutation.isPending,
  };
}
