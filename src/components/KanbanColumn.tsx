"use client";

import { useState, useRef, useCallback } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { Plus, X, Check } from "lucide-react";
import { Column, Task } from "@/types/kanban";
import TaskCard from "./TaskCard";

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onAddTask: (columnId: string, title: string, description: string) => void;
  onDeleteTask: (columnId: string, taskId: string) => void;
}

const COLUMN_ACCENT: { [key: string]: string } = {
  "column-todo": "bg-neutral-600 text-neutral-300",
  "column-doing": "bg-amber-500/20 text-amber-400",
  "column-done": "bg-emerald-500/20 text-emerald-400",
};

const DEFAULT_ACCENT = "bg-neutral-600 text-neutral-300";

export default function KanbanColumn({
  column,
  tasks,
  onAddTask,
  onDeleteTask,
}: KanbanColumnProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [titleError, setTitleError] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const handleOpenForm = useCallback(() => {
    setIsAdding(true);
    setTimeout(() => titleInputRef.current?.focus(), 0);
  }, []);

  const handleCancelForm = useCallback(() => {
    setIsAdding(false);
    setNewTitle("");
    setNewDescription("");
    setTitleError(false);
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmedTitle = newTitle.trim();
    if (!trimmedTitle) {
      setTitleError(true);
      titleInputRef.current?.focus();
      return;
    }
    onAddTask(column.id, trimmedTitle, newDescription.trim());
    handleCancelForm();
  }, [newTitle, newDescription, column.id, onAddTask, handleCancelForm]);

  const handleTitleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") handleSubmit();
      if (e.key === "Escape") handleCancelForm();
    },
    [handleSubmit, handleCancelForm]
  );

  const accentClass = COLUMN_ACCENT[column.id] ?? DEFAULT_ACCENT;

  return (
    <div className="flex w-72 flex-shrink-0 flex-col rounded-xl border border-neutral-800 bg-neutral-900">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-neutral-200">
            {column.title}
          </h2>
          <span className={`rounded-full px-2 py-0.5 text-xs font-bold tabular-nums ${accentClass}`}>
            {tasks.length}
          </span>
        </div>

        {!isAdding && (
          <button
            onClick={handleOpenForm}
            aria-label={`Adicionar tarefa em ${column.title}`}
            className="rounded p-1 text-neutral-500 transition-colors duration-100 hover:bg-neutral-800 hover:text-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <Plus size={16} />
          </button>
        )}
      </div>

      {/* Drop Zone */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={[
              "flex min-h-[2rem] flex-col gap-2 overflow-y-auto px-3 transition-colors duration-150",
              snapshot.isDraggingOver ? "rounded-lg bg-amber-500/5" : "",
            ].join(" ")}
            style={{ maxHeight: "calc(100vh - 260px)" }}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onDelete={(taskId) => onDeleteTask(column.id, taskId)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Formulário inline */}
      <div className="px-3 pb-3 pt-2">
        {isAdding ? (
          <div className="rounded-lg border border-neutral-700 bg-neutral-800 p-3">
            <input
              ref={titleInputRef}
              type="text"
              value={newTitle}
              onChange={(e) => {
                setNewTitle(e.target.value);
                if (e.target.value.trim()) setTitleError(false);
              }}
              onKeyDown={handleTitleKeyDown}
              placeholder="Título da tarefa..."
              maxLength={100}
              className={[
                "w-full rounded bg-neutral-900 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-600",
                "border outline-none transition-colors duration-100",
                titleError
                  ? "border-red-500 focus:border-red-400"
                  : "border-neutral-700 focus:border-amber-500",
              ].join(" ")}
            />
            {titleError && (
              <p className="mt-1 text-xs text-red-400">O título é obrigatório.</p>
            )}

            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Escape") handleCancelForm(); }}
              placeholder="Descrição (opcional)..."
              rows={2}
              maxLength={300}
              className="mt-2 w-full resize-none rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-600 outline-none focus:border-amber-500 transition-colors duration-100"
            />

            <div className="mt-2 flex gap-2">
              <button
                onClick={handleSubmit}
                className="flex items-center gap-1.5 rounded bg-amber-500 px-3 py-1.5 text-xs font-semibold text-neutral-950 transition-colors duration-100 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 focus:ring-offset-neutral-800"
              >
                <Check size={12} />
                Adicionar
              </button>
              <button
                onClick={handleCancelForm}
                className="flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium text-neutral-400 transition-colors duration-100 hover:bg-neutral-700 hover:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-600"
              >
                <X size={12} />
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleOpenForm}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-neutral-500 transition-colors duration-100 hover:bg-neutral-800 hover:text-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-700"
          >
            <Plus size={13} />
            Nova tarefa
          </button>
        )}
      </div>
    </div>
  );
}