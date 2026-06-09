export interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export interface BoardState {
  tasks: { [taskId: string]: Task };
  columns: { [columnId: string]: Column };
  columnOrder: string[];
}

export const initialData: BoardState = {
  tasks: {
    "task-1": {
      id: "task-1",
      title: "Configurar ambiente de desenvolvimento",
      description: "Instalar Node.js, VS Code, extensões ESLint e Prettier.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
    "task-2": {
      id: "task-2",
      title: "Definir arquitetura do projeto",
      description: "Escolher stack, estrutura de pastas e padrões de código.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    },
    "task-3": {
      id: "task-3",
      title: "Implementar drag and drop",
      description: "Integrar @hello-pangea/dnd com estado normalizado.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    },
    "task-4": {
      id: "task-4",
      title: "Criar componentes base",
      description: "TaskCard, KanbanColumn e layout responsivo.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    },
    "task-5": {
      id: "task-5",
      title: "Implementar persistência local",
      description: "Salvar e recuperar estado do localStorage sem erros de hidratação.",
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    "task-6": {
      id: "task-6",
      title: "Design system e dark theme",
      description: "Paleta neutral-950/amber-500, tipografia e espaçamentos.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    "task-7": {
      id: "task-7",
      title: "Deploy na Vercel",
      description: "Configurar variáveis de ambiente e publicar em produção.",
      createdAt: new Date().toISOString(),
    },
  },
  columns: {
    "column-todo": {
      id: "column-todo",
      title: "A Fazer",
      taskIds: ["task-1", "task-2"],
    },
    "column-doing": {
      id: "column-doing",
      title: "Em Andamento",
      taskIds: ["task-3", "task-4", "task-5"],
    },
    "column-done": {
      id: "column-done",
      title: "Concluído",
      taskIds: ["task-6", "task-7"],
    },
  },
  columnOrder: ["column-todo", "column-doing", "column-done"],
};