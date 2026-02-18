import api from './api';
import type { Card, CardStatus } from '../types/kanban';

// Cache de usuários para não buscar toda hora
let usersCache: any[] = [];

// Mapeamento de status do frontend para o backend
const statusMap: Record<CardStatus, string> = {
  'Backlog': 'Backlog',
  'To Do': 'To Do',
  'Doing': 'Doing',
  'Waiting Response': 'Waiting Response',
  'Waiting Review': 'Waiting Review',
  'Waiting Test': 'Waiting Test',
  'Blocked': 'Blocked',
  'Bug': 'Bug',
  'Complete': 'Complete',
  'Closed': 'Closed',
};

// Mapeamento de prioridade do frontend para o backend
const priorityMap: Record<string, string> = {
  'Baixa': 'Baixa',
  'Média': 'Média',
  'Urgente': 'Urgente',
};

// Mapeamento inverso do backend para o frontend
const reverseStatusMap: Record<string, CardStatus> = {
  'Backlog': 'Backlog',
  'To Do': 'To Do',
  'Doing': 'Doing',
  'Waiting Response': 'Waiting Response',
  'Waiting Review': 'Waiting Review',
  'Waiting Test': 'Waiting Test',
  'Blocked': 'Blocked',
  'Bug': 'Bug',
  'Complete': 'Complete',
  'Closed': 'Closed',
};

const reversePriorityMap: Record<string, string> = {
  'Baixa': 'Baixa',
  'Média': 'Média',
  'Urgente': 'Urgente',
};

// Função para buscar usuários e cache
const fetchUsers = async (): Promise<any[]> => {
  if (usersCache.length > 0) return usersCache;
  
  try {
    const response = await api.get('/users');
    usersCache = response.data;
    console.log('[TaskService] ✅ Users cached:', usersCache.length);
    return usersCache;
  } catch (error) {
    console.error('[TaskService] ❌ Error fetching users:', error);
    return [];
  }
};

// Função para obter nomes dos responsáveis
const getResponsibleNames = async (responsibleIds: any[]): Promise<string[]> => {
  if (responsibleIds.length === 0) return [];
  
  console.log('[TaskService] 🔍 Getting responsible names for IDs:', responsibleIds);
  console.log('[TaskService] 🔍 Responsible IDs type:', typeof responsibleIds);
  console.log('[TaskService] 🔍 First responsible item:', responsibleIds[0]);
  console.log('[TaskService] 🔍 First responsible item type:', typeof responsibleIds[0]);
  
  // Se já for array de objetos com nome, extrair nomes diretamente
  if (responsibleIds.length > 0 && typeof responsibleIds[0] === 'object' && responsibleIds[0].name) {
    console.log('[TaskService] ✅ Responsible already has names, extracting directly');
    console.log('[TaskService] 🔍 First responsible object:', JSON.stringify(responsibleIds[0], null, 2));
    console.log('[TaskService] 🔍 All responsible objects:', JSON.stringify(responsibleIds, null, 2));
    
    const names = responsibleIds.map(r => {
      console.log('[TaskService] 🔍 Processing responsible:', r);
      console.log('[TaskService] 🔍 Responsible name:', r.name);
      return r.name;
    });
    
    console.log('[TaskService] ✅ Extracted names:', names);
    return names;
  }
  
  const users = await fetchUsers();
  console.log('[TaskService] 👥 Available users:', users.map(u => ({ id: u.id, name: u.name })));
  
  const names = responsibleIds.map(id => {
    console.log('[TaskService] 🔍 Processing ID:', id, 'Type:', typeof id, 'Is string:', typeof id === 'string');
    
    const user = users.find(u => u.id === id);
    console.log('[TaskService] 🔍 User found for ID', id, ':', user ? user.name : 'NOT FOUND');
    console.log('[TaskService] 🔍 Available user IDs:', users.map(u => u.id));
    
    const name = user ? user.name : `User ${id && typeof id === 'string' ? id.substring(0, 8) : 'unknown'}`;
    console.log('[TaskService] 📝 Mapped ID → Name:', id, '→', name);
    return name;
  });
  
  console.log('[TaskService] ✅ Final responsible names:', names);
  return names;
};

export const taskService = {
  // Buscar todas as tasks
  async getTasks(): Promise<Card[]> {
    try {
      console.log('[TaskService] 🚀 Starting getTasks()...');
      
      const response = await api.get('/tasks');
      console.log('[TaskService] ✅ Tasks fetched from backend:', response.data);
      console.log('[TaskService] 📊 Raw tasks data:', response.data);
      
      // Buscar usuários para mapear responsáveis
      const users = await fetchUsers();
      console.log('[TaskService] 👥 Users fetched for mapping:', users.length, 'users');
      
      // Mapear dados do backend para o formato do frontend
      try {
          const tasksWithNames = response.data.map((task: any) => {
            const responsible = task.responsible && Array.isArray(task.responsible) 
              ? task.responsible.map((r: any) => {
                  const id = r.id || (typeof r === 'string' ? r : 'unknown');
                  const name = r.name || (typeof r === 'string' ? r : 'Usuário');
                  return { id, name };
                })
              : [];
            
            return {
              id: task.id,
              title: task.title,
              description: task.description || '',
              responsible: responsible,
              status: reverseStatusMap[task.status] || 'Backlog',
              // support both camelCase and snake_case coming from backend
              deadline: task.dueDate
                  ? new Date(task.dueDate).toISOString().split('T')[0]
                  : task.due_date
                      ? new Date(task.due_date).toISOString().split('T')[0]
                      : '',
              priority: reversePriorityMap[task.priority] as 'Baixa' | 'Média' | 'Urgente' || 'Baixa',
              tags: task.tags || [],
              comments: task.comments || [],
              attachments: task.attachments || [],
            };
          });
        
        console.log('[TaskService] 🏁 Final tasksWithNames:', tasksWithNames);
        console.log('[TaskService] 📤 Returning', tasksWithNames.length, 'tasks');
        
        // Log final para debug
        if (tasksWithNames.length === 0) {
          console.warn('[TaskService] ⚠️ WARNING: No tasks returned!');
        } else {
          console.log('[TaskService] ✅ Tasks summary:', tasksWithNames.map(t => ({ id: t.id, title: t.title, responsible: t.responsible })));
        }
        
        return tasksWithNames;
      } catch (promiseError) {
        console.error('[TaskService] ❌ Promise.all error:', promiseError);
        throw promiseError;
      }
    } catch (error) {
      console.error('[TaskService] ❌ Error fetching tasks:', error);
      throw error;
    }
  },

  // Criar nova task
  async createTask(task: Omit<Card, 'id'>): Promise<Card> {
    try {
      console.log('[TaskService] Creating task:', task);
      
      // Mapear para o formato do backend
      const backendTask = {
        title: task.title,
        description: task.description,
        status: statusMap[task.status],
        priority: priorityMap[task.priority],
        // camelCase key to match API contract
        dueDate: task.deadline ? new Date(task.deadline).toISOString() : null,
        responsible: task.responsible.map(r => r.id),
        tags: task.tags,
        comments: task.comments,
        attachments: task.attachments,
      };

      const response = await api.post('/tasks', backendTask);
      console.log('[TaskService] ✅ Task created:', response.data);
      
      // Mapear resposta de volta para o formato do frontend
      const createdTask = response.data;
      return {
        id: createdTask.id,
        title: createdTask.title,
        description: createdTask.description || '',
        responsible: createdTask.responsible || [],
        status: reverseStatusMap[createdTask.status] || 'Backlog',
        // backend may send either dueDate or due_date depending on implementation
        deadline: createdTask.dueDate 
            ? new Date(createdTask.dueDate).toISOString().split('T')[0] 
            : createdTask.due_date 
                ? new Date(createdTask.due_date).toISOString().split('T')[0] 
                : '',
        priority: reversePriorityMap[createdTask.priority] as 'Baixa' | 'Média' | 'Urgente' || 'Baixa',
        tags: createdTask.tags || [],
        comments: createdTask.comments || [],
        attachments: createdTask.attachments || [],
      };
    } catch (error) {
      console.error('[TaskService] ❌ Error creating task:', error);
      throw error;
    }
  },

  // Atualizar task existente
  async updateTask(task: Card): Promise<Card> {
    try {
      console.log('[TaskService] Updating task:', task);
      
      // Mapear para o formato do backend
      const backendTask = {
        title: task.title,
        description: task.description,
        status: statusMap[task.status],
        priority: priorityMap[task.priority],
        // camelCase key to match API contract
        dueDate: task.deadline ? new Date(task.deadline).toISOString() : null,
        responsible: task.responsible.map(r => r.id),
        tags: task.tags,
        comments: task.comments,
        attachments: task.attachments,
      };

      const response = await api.patch(`/tasks/${task.id}`, backendTask);
      console.log('[TaskService] ✅ Task updated:', response.data);
      
      // Mapear resposta de volta para o formato do frontend
      const updatedTask = response.data;
      return {
        id: updatedTask.id,
        title: updatedTask.title,
        description: updatedTask.description || '',
        responsible: updatedTask.responsible || [],
        status: reverseStatusMap[updatedTask.status] || 'Backlog',
        deadline: updatedTask.dueDate 
            ? new Date(updatedTask.dueDate).toISOString().split('T')[0] 
            : updatedTask.due_date 
                ? new Date(updatedTask.due_date).toISOString().split('T')[0] 
                : '',
        priority: reversePriorityMap[updatedTask.priority] as 'Baixa' | 'Média' | 'Urgente' || 'Baixa',
        tags: updatedTask.tags || [],
        comments: updatedTask.comments || [],
        attachments: updatedTask.attachments || [],
      };
    } catch (error) {
      console.error('[TaskService] ❌ Error updating task:', error);
      throw error;
    }
  },

  // Deletar task
  async deleteTask(taskId: string): Promise<void> {
    try {
      console.log('[TaskService] Deleting task:', taskId);
      await api.delete(`/tasks/${taskId}`);
      console.log('[TaskService] ✅ Task deleted:', taskId);
    } catch (error) {
      console.error('[TaskService] ❌ Error deleting task:', error);
      throw error;
    }
  },

  // Mover task entre colunas (atualizar status)
  async moveTask(taskId: string, newStatus: CardStatus): Promise<void> {
    try {
      console.log('[TaskService] Moving task:', taskId, 'to', newStatus);
      
      const backendStatus = statusMap[newStatus];
      await api.patch(`/tasks/${taskId}`, {
        status: backendStatus,
      });
      
      console.log('[TaskService] ✅ Task moved:', taskId, 'to', newStatus);
    } catch (error) {
      console.error('[TaskService] ❌ Error moving task:', error);
      throw error;
    }
  },

  // Upload de anexo
  async uploadAttachment(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data; // Retorna { name, url, size, type }
  },

  // Remover anexo
  async removeAttachment(filename: string) {
    const response = await api.delete(`/uploads/${filename}`);
    return response.data;
  },
};

