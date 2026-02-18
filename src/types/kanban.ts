export type Priority = 'Baixa' | 'Média' | 'Urgente';

export type CardStatus = 
  | 'Backlog'
  | 'To Do'
  | 'Doing'
  | 'Waiting Response'
  | 'Waiting Review'
  | 'Waiting Test'
  | 'Blocked'
  | 'Bug'
  | 'Complete'
  | 'Closed';

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface ResponsibleUser {
  id: string;
  name: string;
}

export interface Card {
  id: string;
  title: string;
  description?: string;
  responsible: ResponsibleUser[];
  status: CardStatus;
  deadline: string;
  priority: Priority;
  tags: Tag[];
  comments: Comment[];
  attachments?: string[];
  newComment?: string;
}

export interface Column {
  id: CardStatus;
  title: string;
}
