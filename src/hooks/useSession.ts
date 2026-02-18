import { useQuery } from '@tanstack/react-query';
import { authService } from '../services/auth.service';

export function useSession() {
  return useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const user = authService.getCurrentUser();
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      
      return {
        user,
        isAuthenticated,
      };
    },
    // Manter o dado como "fresco" já que o localStorage é síncrono, 
    // mas queremos a reatividade do Query para invalidação.
    staleTime: Infinity,
  });
}
