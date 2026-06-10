'use client';

import { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Column, Task } from '@/types/kanban';
import TaskCard from '@/components/TaskCard';
import { Plus, X } from 'lucide-react';

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onAddTask: (columnId: string, title: string, description: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function KanbanColumn({ column, tasks, onAddTask, onDeleteTask }: KanbanColumnProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask(column.id, title, description);
    setTitle('');
    setDescription('');
    setIsAdding(false);
  };

  return (
    <div className="w-full md:w-80 bg-neutral-900 rounded-2xl p-4 flex flex-col max-h-[70vh] border border-neutral-800 shadow-md">
      <div className="flex justify-between items-center mb-4 px-1">
        <h3 className="font-bold text-neutral-200 flex items-center gap-2">
          {column.title}
          <span className="text-xs bg-orange-600 text-white font-bold px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </h3>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto pr-1 min-h-[150px] transition-colors rounded-xl ${
              snapshot.isDraggingOver ? 'bg-neutral-800/50' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                index={index} 
                onDeleteTask={onDeleteTask}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="mt-2">
        {isAdding ? (
          <form onSubmit={handleSubmit} className="bg-neutral-800 p-3 rounded-xl border border-neutral-700 space-y-2">
            <input
              type="text"
              placeholder="Título da tarefa..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-neutral-900 text-sm text-neutral-100 p-2 rounded-lg border border-neutral-700 focus:outline-none focus:border-orange-500"
              autoFocus
            />
            <textarea
              placeholder="Descrição (opcional)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-neutral-900 text-xs text-neutral-300 p-2 rounded-lg border border-neutral-700 focus:outline-none focus:border-orange-500 resize-none h-16"
            />
            <div className="flex justify-end gap-2 text-xs pt-1">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md text-neutral-400 hover:bg-neutral-700 transition-colors"
              >
                <X size={14} /> Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors"
              >
                <Plus size={14} /> Adicionar
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full py-2 flex items-center justify-center gap-2 rounded-xl text-sm text-blue-400 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-600/20 transition-all font-medium"
          >
            <Plus size={16} />
            Nova tarefa
          </button>
        )}
      </div>
    </div>
  );
}