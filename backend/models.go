package main

import "time"

type TaskStatus string

const (
	StatusTodo       TaskStatus = "A Fazer"
	StatusInProgress TaskStatus = "Em Progresso"
	StatusDone       TaskStatus = "Concluídas"
)

type Task struct {
	ID          string     `json:"id"`
	Title       string     `json:"title"`
	Description string     `json:"description,omitempty"`
	Status      TaskStatus `json:"status"`
	CreatedAt   time.Time  `json:"created_at"`
}