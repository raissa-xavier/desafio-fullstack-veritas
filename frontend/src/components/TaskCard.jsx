import React, { useState } from 'react';

const COLUMNS = ['A Fazer', 'Em Progresso', 'Concluídas'];

export default function TaskCard({ task, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');

  const handleSave = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onUpdate(task.id, { title, description, status: task.status });
    setIsEditing(false);
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', task.id);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'A Fazer':
        return 'card-todo';
      case 'Em Progresso':
        return 'card-in-progress';
      case 'Concluídas':
        return 'card-done';
      default:
        return '';
    }
  };

  return (
    <div
      className={`task-card ${getStatusClass(task.status)}`}
      draggable={!isEditing}
      onDragStart={handleDragStart}
    >
      {isEditing ? (
        <form onSubmit={handleSave} className="task-edit-form">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrição da tarefa..."
            rows={3}
          />
          <div className="card-actions">
            <button type="submit" className="btn-save">Salvar</button>
            <button type="button" onClick={() => setIsEditing(false)} className="btn-cancel">Cancelar</button>
          </div>
        </form>
      ) : (
        <>
          <div className="task-badge-wrapper">
            <span className={`status-badge ${getStatusClass(task.status)}`}>
              {task.status}
            </span>
            <button onClick={() => onDelete(task.id)} className="btn-delete" title="Excluir tarefa">✕</button>
          </div>

          <div className="task-header">
            <h4>{task.title}</h4>
          </div>

          {task.description && <p className="task-desc">{task.description}</p>}

          <div className="task-footer">
            <button onClick={() => setIsEditing(true)} className="btn-edit">
              ✏️ Editar
            </button>
            <select
              value={task.status}
              onChange={(e) => onUpdate(task.id, { status: e.target.value })}
              className="status-select"
              title="Mover tarefa"
            >
              {COLUMNS.map((col) => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>
        </>
      )}
    </div>
  );
}