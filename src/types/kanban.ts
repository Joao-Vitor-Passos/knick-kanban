export interface Task {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export interface BoardState {
  tasks: { [key: string]: Task };
  columns: { [key: string]: Column };
  columnOrder: string[];
}

export interface Dashboard {
  id: string;
  name: string;
  board: BoardState;
}

export const initialBoardData = (): BoardState => ({
  tasks: {
    'task-1': { id: 'task-1', title: 'Baixar Windows', description: 'Baixar Windows 10 no PC', createdAt: new Date().toLocaleDateString('pt-BR') },
    'task-2': { id: 'task-2', title: 'Implementar persistência local', description: 'Salvar e recuperar estado do localStorage sem erros de hidratação.', createdAt: new Date().toLocaleDateString('pt-BR') },
  },
  columns: {
    'column-todo': { id: 'column-todo', title: 'A Fazer', taskIds: ['task-1'] },
    'column-in-progress': { id: 'column-in-progress', title: 'Em Andamento', taskIds: ['task-2'] },
    'column-done': { id: 'column-done', title: 'Concluído', taskIds: [] },
  },
  columnOrder: ['column-todo', 'column-in-progress', 'column-done'],
});