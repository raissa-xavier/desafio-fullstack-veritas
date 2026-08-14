package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"sync"
	"time"
)

type TaskStore struct {
	mu       sync.RWMutex
	filePath string
	tasks    []Task
	nextID   int
}

func NewTaskStore(filePath string) *TaskStore {
	store := &TaskStore{
		filePath: filePath,
		tasks:    make([]Task, 0),
		nextID:   1,
	}
	store.loadFromFile()
	return store
}

func (s *TaskStore) loadFromFile() {
	if _, err := os.Stat(s.filePath); os.IsNotExist(err) {
		return
	}

	data, err := os.ReadFile(s.filePath)
	if err != nil {
		return
	}

	var tasks []Task
	if err := json.Unmarshal(data, &tasks); err == nil {
		s.tasks = tasks
		maxID := 0
		for _, t := range tasks {
			var idNum int
			fmt.Sscanf(t.ID, "%d", &idNum)
			if idNum > maxID {
				maxID = idNum
			}
		}
		s.nextID = maxID + 1
	}
}

func (s *TaskStore) saveToFile() error {
	data, err := json.MarshalIndent(s.tasks, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(s.filePath, data, 0644)
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
	s.saveToFile()
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
			s.saveToFile()
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
			s.saveToFile()
			return nil
		}
	}
	return errors.New("tarefa não encontrada")
}