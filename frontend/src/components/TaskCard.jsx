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

  const handleMove = (newStatus) => {
    onUpdate(task.id, { status: newStatus });
  };

  return (
    <div className="task-card">
      {isEditing ? (
        <form onSubmit={handleSave} className="task-edit-form">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrição..."
            rows={2}
          />
          <div className="card-actions">
            <button type="submit" className="btn-save">Salvar</button>
            <button type="button" onClick={() => setIsEditing(false)} className="btn-cancel">Cancelar</button>
          </div>
        </form>
      ) : (
        <>
          <div className="task-header">
            <h4>{task.title}</h4>
            <button onClick={() => onDelete(task.id)} className="btn-delete" title="Excluir">✕</button>
          </div>
          {task.description && <p className="task-desc">{task.description}</p>}

          <div className="task-footer">
            <button onClick={() => setIsEditing(true)} className="btn-edit">Editar</button>
            <select
              value={task.status}
              onChange={(e) => handleMove(e.target.value)}
              className="status-select"
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