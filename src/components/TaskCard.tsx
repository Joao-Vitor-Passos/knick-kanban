'use client';

import { Draggable } from '@hello-pangea/dnd';
import { Task } from '@/types/kanban';
import { Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  index: number;
  onDeleteTask: (taskId: string) => void;
}

export default function TaskCard({ task, index, onDeleteTask }: TaskCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-4 mb-3 bg-neutral-800 rounded-xl border border-neutral-700 hover:border-blue-600 transition-all shadow-md group ${
            snapshot.isDragging ? 'bg-neutral-700 shadow-2xl border-orange-500 scale-[1.02]' : ''
          }`}
        >
          <div className="flex justify-between items-start gap-2">
            <h4 className="text-sm font-semibold text-neutral-100 break-words max-w-[85%]">
              {task.title}
            </h4>
            <button
              onClick={() => onDeleteTask(task.id)}
              className="text-neutral-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-neutral-700"
              title="Excluir tarefa"
            >
              <Trash2 size={14} />
            </button>
          </div>
          
          {task.description && (
            <p className="text-xs text-neutral-400 mt-1.5 line-clamp-2">
              {task.description}
            </p>
          )}
          
          <div className="text-[10px] text-neutral-500 mt-3 text-right">
            {task.createdAt}
          </div>
        </div>
      )}
    </Draggable>
  );
}