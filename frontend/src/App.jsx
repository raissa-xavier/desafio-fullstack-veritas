import React, { useEffect, useState } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask } from './services/api';
import Column from './components/Column';
import TaskForm from './components/TaskForm';
import './App.css';

const COLUMNS = ['A Fazer', 'Em Progresso', 'Concluídas'];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTasks();
      setTasks(data || []);
    } catch (err) {
      setError('Não foi possível conectar ao servidor backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAddTask = async (newTask) => {
    try {
      const created = await createTask(newTask);
      setTasks((prev) => [...prev, created]);
    } catch (err) {
      alert('Erro ao criar tarefa. Verifique o backend.');
    }
  };

  const handleUpdateTask = async (id, updates) => {
    try {
      const updated = await updateTask(id, updates);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      alert('Erro ao atualizar tarefa.');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert('Erro ao excluir tarefa.');
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h2>Mini Kanban</h2>
      </header>

      <main className="app-main">
        <TaskForm onAddTask={handleAddTask} />

        {loading && <p className="status-msg">⏳ Carregando tarefas...</p>}
        {error && <p className="status-msg error-msg">⚠️ {error}</p>}

        {!loading && !error && (
          <div className="kanban-board">
            {COLUMNS.map((col) => (
              <Column
                key={col}
                title={col}
                tasks={tasks.filter((t) => t.status === col)}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
