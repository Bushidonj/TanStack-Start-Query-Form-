### Grupos do Kanban e suas Funções

1. **Backlog**
    - **Função:** Armazena todas as atividades e ideias que foram identificadas, mas ainda não foram priorizadas ou planejadas para serem executadas.
    - **Uso:** Revisado regularmente para decidir quais atividades devem ser movidas para o grupo "To Do".
2. **To Do**
    - **Função:** Lista as atividades que foram priorizadas e estão prontas para serem iniciadas.
    - **Uso:** Os responsáveis escolhem atividades deste grupo para começar a trabalhar.
3. **Doing**
    - **Função:** Contém as atividades que estão atualmente em andamento.
    - **Uso:** Os responsáveis movem as atividades para este grupo quando começam a trabalhar nelas.
4. **Awaiting Response**
    - **Função:** Atividades que estão aguardando uma resposta ou ação de terceiros.
    - **Uso:** Movem-se atividades para este grupo quando é necessário aguardar uma resposta para continuar o trabalho.
5. **Awaiting Review**
    - **Função:** Atividades que foram concluídas, mas estão aguardando revisão ou aprovação.
    - **Uso:** Quando uma atividade está pronta, mas precisa ser revisada por outro membro da equipe.
6. **Blocked**
    - **Função:** Atividades que estão impedidas de continuar por algum motivo.
    - **Uso:** Usado para identificar atividades que não podem progredir devido a bloqueios, como dependências ou problemas técnicos.
7. **HML Testing**
    - **Função:** Para o Q.A testar as novas funcionalidades.
    - **Uso:** Novas funcionalidades são movidas para este grupo para testes. Caso sejam aprovadas, são enviadas para HML. Caso sejam reprovadas, são enviadas de volta para o desenvolvedor corrigir.
8. **Bugs**
    - **Função:** Especificamente para atividades que envolvem a correção de bugs.
    - **Uso:** Bugs identificados são movidos para este grupo para priorização e correção.
9. **Complete**
    - **Função:** Atividades que foram concluídas e não precisam de mais ações.
    - **Uso:** Movem-se atividades para este grupo quando estão completamente finalizadas.
10. **Closed**
    - **Função:** Atividades que foram arquivadas ou fechadas, possivelmente porque não são mais relevantes ou foram canceladas.
    - **Uso:** Para manter o Kanban limpo, atividades que não serão mais trabalhadas são movidas para este grupo.

---

### Principais Tópicos de Cada Atividade

1. **Título da Atividade**
    - **Descrição:** Nome claro e conciso da atividade.
    - **Exemplo:** "Implementar Login com OAuth"
2. **Responsável ou Responsáveis**
    - **Descrição:** Pessoa(s) designada(s) para realizar a atividade.
    - **Exemplo:** João, Maria
3. **Prazo de Entrega da Atividade**
    - **Descrição:** Data em que a atividade deve ser concluída.
    - **Exemplo:** 15/06/2024
4. **Qual Feature a Atividade Está Atrelada**
    - **Descrição:** A funcionalidade ou módulo ao qual a atividade está relacionada.
    - **Exemplo:** Sistema de Autenticação
5. **Qual Prioridade Ela Possui**
    - **Descrição:** Grau de importância da atividade (ex: Alta, Média, Baixa).
    - **Exemplo:** Alta
6. **Tags**
    - **Descrição:** Palavras-chave que categorizam a atividade.
    - **Exemplo:** Estudos, Interno, Back-end, Front-end, Web3, Design, Infra, Outros, bugs, Teste em HML
7. **Etapa**
    - **Descrição:** Categoria da atividade no contexto do projeto.
    - **Exemplo:** Base, Grupo de Funcionalidade, Gerenciamento, Mais Features, Integrações, Outros
8. **Sub Tarefas**
    - **Descrição:** Divisão da atividade em tarefas menores e gerenciáveis.
    - **Uso:** Ajuda na visualização do tamanho da atividade e no acompanhamento do progresso.
    - **Exemplo:** "Configurar ambiente de desenvolvimento", "Implementar interface de login", "Testar integração OAuth"
9. **Comentários**
    - **Descrição:** Área para deixar informações importantes, tirar dúvidas, marcar outras pessoas, adicionar links e registrar observações.
    - **Uso:** Facilita a comunicação e o registro de informações relevantes durante a execução da atividade.
10. **Explicação da Atividade**
    - **Descrição:** Descrição detalhada sobre o que será feito na atividade para que qualquer pessoa que leia entenda o que está sendo desenvolvido.
    - **Exemplo:** "Nesta atividade, vamos implementar a funcionalidade de login usando OAuth 2.0. Isso envolve configurar a biblioteca XYZ, criar endpoints para autenticação e integrar com o serviço de identidade ABC."

---

### Template para Documentação de Atividades

1. **Link da Atividade no GitHub:**
    - [Link para a atividade no GitHub](https://www.notion.so/URL_DO_GITHUB)
    - **Descrição:** Inclua aqui o link direto para a atividade no GitHub para fácil acesso ao código e aos detalhes técnicos relacionados.
2. **Link do Figma (Caso Necessário):**
    - [Link para o design no Figma](https://www.notion.so/URL_DO_FIGMA)
    - **Descrição:** Adicione o link para o Figma se a atividade envolver design ou elementos visuais, permitindo que os desenvolvedores e designers acessem os recursos visuais necessários.
3. **Descrição da Atividade a Ser Desenvolvida:**
    - **Descrição:** Forneça uma descrição detalhada da atividade, incluindo o que precisa ser feito, objetivos e expectativas.
    - **Exemplo:** "Implementar a funcionalidade de login com OAuth 2.0. Isso inclui configurar a biblioteca XYZ, criar endpoints para autenticação e integrar com o serviço de identidade ABC."
4. **Critérios de Aceitação:**
    - **Descrição:** Liste os critérios que devem ser atendidos para que a atividade seja considerada completa e aceita.
    - **Exemplo:** "Usuário deve conseguir fazer login com OAuth sem erros; os dados do usuário devem ser salvos corretamente no banco de dados; deve haver feedback visual para erros de login."
5. **Links Externos para Desenvolver Atividades:**
    - **Descrição:** Inclua quaisquer links externos que possam ser úteis para o desenvolvimento da atividade, como documentação, tutoriais, APIs, etc.
    - **Exemplo:**
        - [Documentação da biblioteca XYZ](https://documentacao.xyz/)
        - [Tutorial de integração com OAuth](https://tutorial.oauth/)
6. **Dependências:**
    - **Descrição:** Liste quaisquer dependências que esta atividade tenha em relação a outras tarefas ou recursos.
    - **Exemplo:** "Esta tarefa depende da conclusão da implementação do backend para autenticação."
7. **Sub Tarefas:**
    - **Descrição:** Divida a atividade em tarefas menores e mais gerenciáveis, se necessário.
    - **Exemplo:**
        - "Configurar ambiente de desenvolvimento"
        - "Implementar interface de login"
        - "Testar integração OAuth"
8. **Comentários Adicionais:**
    - **Descrição:** Área para deixar informações importantes, tirar dúvidas, marcar outras pessoas, adicionar links e registrar observações.
    - **Exemplo:** "Verificar se a autenticação está compatível com o sistema atual."
