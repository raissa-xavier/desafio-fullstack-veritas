import React, { useEffect, useState } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask } from './services/api';
import Column from './components/Column';
import TaskForm from './components/TaskForm';
import './App.css';

const COLUMNS = ['A Fazer', 'Em Progresso', 'Concluídas'];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setAppliedSearch(inputValue.trim());
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    if (val === '') {
      setAppliedSearch('');
    }
  };

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(appliedSearch.toLowerCase()) ||
    (t.description && t.description.toLowerCase().includes(appliedSearch.toLowerCase()))
  );

  return (
    <div className="app-container">
      {/* Header com Título e Barra de Busca */}
      <header className="app-header">
        <h2>Mini Kanban</h2>
        <form onSubmit={handleSearchSubmit} className="search-bar-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar tarefas e tecle Enter..."
            value={inputValue}
            onChange={handleInputChange}
            className="search-input"
          />
        </form>
      </header>

      <main className="app-main">
        {/* Formulário de Adicionar Tarefa */}
        <TaskForm onAddTask={handleAddTask} />

        {/* Feedbacks Visuais */}
        {loading && <p className="status-msg loading">⏳ Carregando tarefas...</p>}
        {error && <p className="status-msg error-msg">⚠️ {error}</p>}

        {/* Quadro Kanban */}
        {!loading && !error && (
          <div className="kanban-board">
            {COLUMNS.map((col) => (
              <Column
                key={col}
                title={col}
                tasks={filteredTasks.filter((t) => t.status === col)}
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