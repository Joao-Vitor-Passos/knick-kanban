"use client";

import { Draggable } from "@hello-pangea/dnd";
import { Trash2, GripVertical } from "lucide-react";
import { Task } from "@/types/kanban";

interface TaskCardProps {
  task: Task;
  index: number;
  onDelete: (taskId: string) => void;
}

function formatDate(isoString: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(isoString));
}

export default function TaskCard({ task, index, onDelete }: TaskCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={[
            "group relative rounded-lg border p-3 transition-all duration-150",
            snapshot.isDragging
              ? "border-amber-500 bg-neutral-700 shadow-2xl shadow-amber-500/20 rotate-1"
              : "border-neutral-700 bg-neutral-800 hover:border-neutral-600",
          ].join(" ")}
        >
          <div
            {...provided.dragHandleProps}
            className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab opacity-0 transition-opacity duration-150 group-hover:opacity-40 active:cursor-grabbing"
            aria-label="Arrastar card"
          >
            <GripVertical size={14} className="text-neutral-400" />
          </div>

          <div className="pl-4">
            <p className="text-sm font-medium leading-snug text-neutral-100">
              {task.title}
            </p>

            {task.description && (
              <p className="mt-1 text-xs leading-relaxed text-neutral-400 line-clamp-2">
                {task.description}
              </p>
            )}

            <p className="mt-2 text-[10px] font-mono text-neutral-600">
              {formatDate(task.createdAt)}
            </p>
          </div>

          <button
            onClick={() => onDelete(task.id)}
            aria-label={`Excluir tarefa: ${task.title}`}
            className="absolute right-2 top-2 rounded p-1 opacity-0 transition-all duration-150 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 text-neutral-500 focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            <Trash2 size={13} />
          </button>
        </div>
      )}
    </Draggable>
  );
}