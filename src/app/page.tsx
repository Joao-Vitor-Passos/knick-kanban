"use client";

import { useState, useEffect, useCallback } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { LayoutDashboard } from "lucide-react";
import { BoardState, Task, initialData } from "@/types/kanban";
import KanbanColumn from "@/components/KanbanColumn";

const STORAGE_KEY = "kanban-board-state";

function loadBoard(): BoardState {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return initialData;
    return JSON.parse(serialized) as BoardState;
  } catch {
    return initialData;
  }
}

function saveBoard(board: BoardState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
  } catch {
    console.warn("[Kanban] Não foi possível salvar no localStorage.");
  }
}

export default function Home() {
  const [board, setBoard] = useState<BoardState | null>(null);

  // Carrega do localStorage apenas no cliente (evita hydration error)
  useEffect(() => {
    setBoard(loadBoard());
  }, []);

  // Persiste toda vez que o board muda
  useEffect(() => {
    if (board !== null) saveBoard(board);
  }, [board]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!board) return;
      const { destination, source, draggableId } = result;

      if (!destination) return;
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) return;

      const sourceColumn = board.columns[source.droppableId];
      const destColumn = board.columns[destination.droppableId];

      // Mesma coluna
      if (sourceColumn.id === destColumn.id) {
        const newTaskIds = Array.from(sourceColumn.taskIds);
        newTaskIds.splice(source.index, 1);
        newTaskIds.splice(destination.index, 0, draggableId);
        setBoard({
          ...board,
          columns: {
            ...board.columns,
            [sourceColumn.id]: { ...sourceColumn, taskIds: newTaskIds },
          },
        });
        return;
      }

      // Entre colunas diferentes
      const sourceTaskIds = Array.from(sourceColumn.taskIds);
      sourceTaskIds.splice(source.index, 1);
      const destTaskIds = Array.from(destColumn.taskIds);
      destTaskIds.splice(destination.index, 0, draggableId);

      setBoard({
        ...board,
        columns: {
          ...board.columns,
          [sourceColumn.id]: { ...sourceColumn, taskIds: sourceTaskIds },
          [destColumn.id]: { ...destColumn, taskIds: destTaskIds },
        },
      });
    },
    [board]
  );

  const addTask = useCallback(
    (columnId: string, title: string, description: string) => {
      if (!board) return;
      const newTask: Task = {
        id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title,
        description,
        createdAt: new Date().toISOString(),
      };
      const targetColumn = board.columns[columnId];
      setBoard({
        ...board,
        tasks: { ...board.tasks, [newTask.id]: newTask },
        columns: {
          ...board.columns,
          [columnId]: {
            ...targetColumn,
            taskIds: [newTask.id, ...targetColumn.taskIds],
          },
        },
      });
    },
    [board]
  );

  const deleteTask = useCallback(
    (columnId: string, taskId: string) => {
      if (!board) return;
      const { [taskId]: _removed, ...remainingTasks } = board.tasks;
      const targetColumn = board.columns[columnId];
      setBoard({
        ...board,
        tasks: remainingTasks,
        columns: {
          ...board.columns,
          [columnId]: {
            ...targetColumn,
            taskIds: targetColumn.taskIds.filter((id) => id !== taskId),
          },
        },
      });
    },
    [board]
  );

  // Skeleton enquanto hidrata
  if (board === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <div className="flex items-center gap-3 text-neutral-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-700 border-t-amber-500" />
          <span className="text-sm font-medium">Carregando tabuleiro...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral-950">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500">
              <LayoutDashboard size={16} className="text-neutral-950" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-neutral-100">
                KanbanLocal
              </h1>
              <p className="text-xs text-neutral-500">
                Dados salvos localmente no navegador
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-xs text-neutral-500">
            <span>
              <span className="font-bold text-neutral-300">
                {Object.keys(board.tasks).length}
              </span>{" "}
              tarefas
            </span>
            <span>
              <span className="font-bold text-neutral-300">
                {board.columnOrder.length}
              </span>{" "}
              colunas
            </span>
          </div>
        </div>
      </header>

      {/* Board */}
      <main className="flex-1 overflow-x-auto px-6 py-6">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 items-start">
            {board.columnOrder.map((columnId) => {
              const column = board.columns[columnId];
              const tasks = column.taskIds
                .map((id) => board.tasks[id])
                .filter((t): t is Task => t !== undefined);
              return (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  tasks={tasks}
                  onAddTask={addTask}
                  onDeleteTask={deleteTask}
                />
              );
            })}
          </div>
        </DragDropContext>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800 px-6 py-3">
        <p className="text-center text-xs text-neutral-700">
          Arraste os cards entre colunas · Hover para excluir · Dados persistidos no localStorage
        </p>
      </footer>
    </div>
  );
}