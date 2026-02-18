Projeto Frontend – Kanban SaaS (Mockado)

Objetivo

Criar um frontend moderno inspirado no Notion (modo escuro), utilizando obrigatoriamente:

- TanStack Start
- React
- TypeScript
- TanStack Router
- TanStack Query
- TanStack Form

Este projeto NÃO terá backend neste momento.
Todos os dados devem ser mockados em memória.

### Autenticação (Implementação Atual)
- Implementar autenticação real conectada ao backend NestJS.
- Utilizar `accessToken` e `refreshToken` para gestão de sessão.
- **Importante**: Por simplicidade inicial, os tokens serão armazenados no `localStorage`. Em uma etapa futura, a implementação deve ser movida para Cookies `httpOnly` visando maior segurança.

O foco é criar uma UI/UX estruturada, moderna e organizada, preparada para futura integração com API.

___________________________________________

Stack Obrigatória

- Framework: TanStack Start
- Linguagem: TypeScript
- Estado assíncrono: TanStack Query
- Formulários: TanStack Form
- Roteamento: TanStack Router
- Estilização: CSS modular ou Tailwind (preferência Tailwind)
- Drag and Drop: implementar funcionalidade moderna (ex: @dnd-kit)

___________________________________________
Estrutura Geral do App

No primeiro momento não deve existir tela de login.

Ao iniciar o projeto, o usuário deve visualizar diretamente a aplicação principal com:

- Menu lateral esquerdo (estilo Notion Dark Mode)
- Área principal dinâmica baseada em rotas

___________________________________________

Layout Principal
Estilo
Inspirar visualmente no Notion Dark Mode:

- Fundo principal: cinza escuro (#191919 ou similar)
- Sidebar: cinza levemente mais claro
- Tipografia limpa
- Espaçamento consistente
- Interface minimalista
- Bordas suaves
- Hover states suaves

___________________________________________

Sidebar (Menu Lateral)
- Logo ou nome do sistema no topo
- Menu expansível chamado “Geral”
- Dentro de “Geral”:
  - Docs
  - Kanban (ou Backlog de Produto)

___________________________________________

Página Docs
Ao clicar em Docs:

- Abrir uma página em branco
- Apenas um título "Documentação"
- Sem funcionalidades por enquanto

___________________________________________

Página Kanban
Página Kanban / Backlog de Produto
Essa é a página principal do desafio.
Criar um board Kanban com as seguintes colunas:

- Backlog
- To Do
- Doing
- Waiting Response
- Waiting Review
- Waiting Test
- Blocked
- Bug
- Complete
- Closed

As colunas devem ser renderizadas horizontalmente com scroll lateral.

___________________________________________

Cards
Criar pelo menos 1 card mockado inicialmente na coluna Backlog.
Estrutura do Card:
- Título
- Responsável
- Status
- Prazo (data)
- Prioridade (Baixa, Média, Urgente)
  - Prioridade – Cores
    - Baixa → Verde
    - Média → Amarelo
    - Urgente → Vermelho
- Tags
  - Permitir criar nova tag
  - Tags devem aparecer como pequenos badges
  - Armazenamento mockado em memória
- Número de comentários

___________________________________________

Drag and Drop
Implementar funcionalidade de drag and drop para mover cards entre colunas.

Regras:

- Ao mover o card para outra coluna:
  - Atualizar o status interno do card
  - Manter posição correta

- Dados continuam em memória (mock)
- Ao atualizar página, estado reinicia

Usar arquitetura preparada para persistência futura.

___________________________________________

Modal de Detalhes do Card

Ao clicar no card, abrir modal central contendo:
Campos:

- Título editável
- Responsável (input simples por enquanto)
- Status (select com as colunas)
- Prazo (date picker)
- Prioridade (select)
- Features (select múltiplo vazio por enquanto)
- Tags (criar novas se não existirem)
- parte para comentarios (Seção de comentários dentro do card)
   - Adicionar comentário
   - Comentário suporta:
     - Texto normal
     - Título maior (simulação simples, não precisa editor complexo)
     - Renderizar lista de comentários abaixo (Dados apenas mockados.)

___________________________________________

Estrutura de Código Esperada
Organizar projeto de forma escalável:

src/
routes/
components/
 - sidebar/
 - kanban/
 - card/
 - modal/
hooks/
mock/
types/

Criar tipos TypeScript bem definidos para:
 - Card
 - Column
 - Tag
 - Comment

___________________________________________

Arquitetura Importante
- Usar TanStack Query mesmo com mock (simular fetch)
- Separar lógica de UI
- Preparar estrutura para futura integração com API
- Código limpo e organizado
- Componentização adequada

___________________________________________
Objetivo Final
Criar um frontend profissional, organizado e escalável, simulando um SaaS real, preparado para futura integração com:

- NestJS
- PostgreSQL
- Drizzle ORM
- Better-Auth
- BullMQ

Neste momento, apenas UI + UX + estado local mockado.

___________________________________________
Requisitos de Qualidade
- Código TypeScript bem tipado
- Estrutura limpa
- Sem arquivos desnecessários
- Interface moderna
- Responsivo básico
- Fácil manutenção

___________________________________________

# 📋 Análise: Situação Atual vs Requisitos da Tarefa

| Componente | Requisito | Status Atual | Status |
| :--- | :--- | :--- | :--- |
| **Backend** | NestJS | NestJS | ✅ OK |
| **Banco** | PostgreSQL + Drizzle | PostgreSQL + Drizzle | ✅ OK |
| **Auth** | Better-Auth Real | JWT manual (simulado) | ❌ Pendente |
| **Async** | BullMQ + Redis + Zod | Não implementado | ❌ Pendente |
| **Frontend** | TanStack Start | Implementação Inicial | [/] Em Progresso |

## 🎯 Roadmap de Evolução

### Fase 1 - Better-Auth Real (Prioridade Alta)
- [ ] Integrar login com fluxo real do Better-Auth no Backend.
- [ ] Atualizar frontend para lidar com sessions do Better-Auth.

### Fase 2 - BullMQ + Redis (Prioridade Média)
- [ ] Implementar processamento assíncrono no backend.

### Fase 3 - Frontend TanStack Start
- [ ] Migrar listagem de Kanban para usar TanStack Query real (sem mocks).
- [ ] Implementar formulários com TanStack Form + Zod.