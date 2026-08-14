package main

import (
	"errors"
	"fmt"
	"sync"
	"time"
)

type TaskStore struct {
	mu    sync.RWMutex
	tasks []Task
	nextID int
}

func NewTaskStore() *TaskStore {
	return &TaskStore{
		tasks:  make([]Task, 0),
		nextID: 1,
	}
}

func (s *TaskStore) GetAll() []Task {
	s.mu.RLock()
	defer s.mu.RUnlock()
	
	result := make([]Task, len(s.tasks))
	copy(result, s.tasks)
	return result
}

func (s *TaskStore) Create(title, description string, status TaskStatus) (Task, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	if title == "" {
		return Task{}, errors.New("o título é obrigatório")
	}
	if status == "" {
		status = StatusTodo
	}

	task := Task{
		ID:          fmt.Sprintf("%d", s.nextID),
		Title:       title,
		Description: description,
		Status:      status,
		CreatedAt:   time.Now(),
	}
	s.nextID++
	s.tasks = append(s.tasks, task)
	return task, nil
}

func (s *TaskStore) Update(id, title, description string, status TaskStatus) (Task, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	for i, t := range s.tasks {
		if t.ID == id {
			if title != "" {
				s.tasks[i].Title = title
			}
			s.tasks[i].Description = description
			if status != "" {
				s.tasks[i].Status = status
			}
			return s.tasks[i], nil
		}
	}
	return Task{}, errors.New("tarefa não encontrada")
}

func (s *TaskStore) Delete(id string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	for i, t := range s.tasks {
		if t.ID == id {
			s.tasks = append(s.tasks[:i], s.tasks[i+1:]...)
			return nil
		}
	}
	return errors.New("tarefa não encontrada")
}