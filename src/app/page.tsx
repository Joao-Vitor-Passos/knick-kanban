'use client';

import { useState, useEffect, useCallback } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { BoardState, Dashboard, initialBoardData, Task } from '@/types/kanban';
import KanbanColumn from '@/components/KanbanColumn';
import Auth from '@/components/Auth';
import { supabase } from '@/lib/supabase';
import { LogOut, FolderKanban, Plus } from 'lucide-react';
import { Session } from '@supabase/supabase-js';

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [newTabName, setNewTabName] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setAuthChecked(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;

    const savedDashboards = localStorage.getItem(`knick-dashboards-${session.user.id}`);
    const initialDash = [{ id: 'dash-default', name: 'Geral', board: initialBoardData() }];

    let dataToSet = initialDash;
    let activeId = 'dash-default';

    if (savedDashboards) {
      try {
        const parsed = JSON.parse(savedDashboards) as Dashboard[];
        if (parsed.length > 0) {
          dataToSet = parsed;
          activeId = parsed[0].id;
        }
      } catch {
        dataToSet = initialDash;
      }
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setDashboards(dataToSet);
    setActiveTabId(activeId);
    setIsLoaded(true);
  }, [session]);

  useEffect(() => {
    if (isLoaded && session && dashboards.length > 0) {
      localStorage.setItem(`knick-dashboards-${session.user.id}`, JSON.stringify(dashboards));
    }
  }, [dashboards, isLoaded, session]);

  const updateActiveBoard = useCallback((updatedBoard: BoardState) => {
    setDashboards(prev => prev.map(d => d.id === activeTabId ? { ...d, board: updatedBoard } : d));
  }, [activeTabId]);

  const activeDashboard = dashboards.find(d => d.id === activeTabId);

  const handleCreateTab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTabName.trim()) return;

    const newId = `dash-${crypto.randomUUID()}`;
    const newDashboard: Dashboard = {
      id: newId,
      name: newTabName.trim(),
      board: { 
        tasks: {}, 
        columns: { 
            'column-todo': { id: 'column-todo', title: 'A Fazer', taskIds: [] }, 
            'column-in-progress': { id: 'column-in-progress', title: 'Em Andamento', taskIds: [] }, 
            'column-done': { id: 'column-done', title: 'Concluído', taskIds: [] } 
        }, 
        columnOrder: ['column-todo', 'column-in-progress', 'column-done'] 
      }
    };

    setDashboards(prev => [...prev, newDashboard]);
    setActiveTabId(newId);
    setNewTabName('');
  };

  const onDragEnd = (result: DropResult) => {
    if (!activeDashboard) return;
    const boardData = activeDashboard.board;
    const { destination, source, draggableId } = result;

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;

    const startColumn = boardData.columns[source.droppableId];
    const finishColumn = boardData.columns[destination.droppableId];

    if (startColumn === finishColumn) {
      const newTaskIds = Array.from(startColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      updateActiveBoard({ ...boardData, columns: { ...boardData.columns, [startColumn.id]: { ...startColumn, taskIds: newTaskIds } } });
      return;
    }

    const startTaskIds = Array.from(startColumn.taskIds);
    startTaskIds.splice(source.index, 1);
    const finishTaskIds = Array.from(finishColumn.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);

    updateActiveBoard({
      ...boardData,
      columns: {
        ...boardData.columns,
        [startColumn.id]: { ...startColumn, taskIds: startTaskIds },
        [finishColumn.id]: { ...finishColumn, taskIds: finishTaskIds }
      }
    });
  };

  const handleAddTask = (columnId: string, title: string, description: string) => {
    if (!activeDashboard) return;
    const boardData = activeDashboard.board;
    
    const newTask: Task = { 
      id: `task-${crypto.randomUUID()}`, 
      title, 
      description, 
      createdAt: new Date().toLocaleDateString('pt-BR') 
    };

    updateActiveBoard({
      ...boardData,
      tasks: { ...boardData.tasks, [newTask.id]: newTask },
      columns: { ...boardData.columns, [columnId]: { ...boardData.columns[columnId], taskIds: [...boardData.columns[columnId].taskIds, newTask.id] } }
    });
  };

  const handleDeleteTask = (taskId: string) => {
    if (!activeDashboard) return;
    const boardData = activeDashboard.board;
    const newTasks = { ...boardData.tasks };
    delete newTasks[taskId];

    const newColumns = { ...boardData.columns };
    Object.keys(newColumns).forEach(colId => {
      newColumns[colId].taskIds = newColumns[colId].taskIds.filter(id => id !== taskId);
    });

    updateActiveBoard({ ...boardData, tasks: newTasks, columns: newColumns });
  };

  if (!authChecked) return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-neutral-400">Carregando...</div>;
  if (!session) return <Auth />;
  if (!isLoaded || !activeDashboard) return null;

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border-b border-neutral-900 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/10 text-blue-500 rounded-xl border border-blue-500/20"><FolderKanban size={24} /></div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight"><span className="text-blue-500">Knick</span><span className="text-orange-500">.</span></h1>
            </div>
          </div>
          <button onClick={() => supabase.auth.signOut()} className="text-xs font-semibold px-4 py-2 bg-neutral-900 rounded-xl text-neutral-400 hover:text-red-400 transition-all flex items-center gap-2"><LogOut size={14} /> Sair</button>
        </header>

        <div className="mb-8 flex flex-wrap items-center gap-2 border-b border-neutral-900 pb-2">
            {dashboards.map((dash) => (
              <button key={dash.id} onClick={() => setActiveTabId(dash.id)} className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${dash.id === activeTabId ? 'bg-blue-600 border-blue-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400'}`}>
                {dash.name}
              </button>
            ))}
            <form onSubmit={handleCreateTab} className="flex items-center gap-2 ml-auto">
              <input type="text" placeholder="Nova aba..." value={newTabName} onChange={(e) => setNewTabName(e.target.value)} className="bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 px-3 py-2 rounded-xl focus:border-orange-500 w-32" />
              <button type="submit" className="p-2 bg-orange-500 text-white rounded-xl"><Plus size={14} /></button>
            </form>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex flex-col md:flex-row gap-6 items-start overflow-x-auto pb-4">
            {activeDashboard.board.columnOrder.map((columnId) => {
              const column = activeDashboard.board.columns[columnId];
              return column ? (
                <KanbanColumn key={column.id} column={column} tasks={column.taskIds.map(id => activeDashboard.board.tasks[id]).filter(Boolean)} onAddTask={handleAddTask} onDeleteTask={handleDeleteTask} />
              ) : null;
            })}
          </div>
        </DragDropContext>
      </div>
    </main>
  );
}