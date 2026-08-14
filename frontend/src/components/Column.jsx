import React from 'react';
import TaskCard from './TaskCard';

export default function Column({ title, tasks, onUpdateTask, onDeleteTask }) {
  return (
    <div className="kanban-column">
      <div className="column-header">
        <h3>{title}</h3>
        <span className="task-count">{tasks.length}</span>
      </div>
      <div className="column-tasks">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onUpdate={onUpdateTask}
            onDelete={onDeleteTask}
          />
        ))}
        {tasks.length === 0 && (
          <p className="empty-column">Nenhuma tarefa</p>
        )}
      </div>
    </div>
  );
}