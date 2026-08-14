package main

import (
	"encoding/json"
	"net/http"
	"strings"
)

type Handler struct {
	store *TaskStore
}

func NewHandler(store *TaskStore) *Handler {
	return &Handler{store: store}
}

type TaskRequest struct {
	Title       string     `json:"title"`
	Description string     `json:"description"`
	Status      TaskStatus `json:"status"`
}

func (h *Handler) TasksHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	switch r.Method {
	case http.MethodGet:
		tasks := h.store.GetAll()
		json.NewEncoder(w).Encode(tasks)

	case http.MethodPost:
		var req TaskRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, `{"error":"payload inválido"}`, http.StatusBadRequest)
			return
		}
		if strings.TrimSpace(req.Title) == "" {
			http.Error(w, `{"error":"o título é obrigatório"}`, http.StatusBadRequest)
			return
		}
		task, err := h.store.Create(req.Title, req.Description, req.Status)
		if err != nil {
			http.Error(w, `{"error":"`+err.Error()+`"}`, http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(task)

	default:
		http.Error(w, `{"error":"método não permitido"}`, http.StatusMethodNotAllowed)
	}
}

func (h *Handler) TaskByIDHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	id := strings.TrimPrefix(r.URL.Path, "/tasks/")
	if id == "" {
		http.Error(w, `{"error":"id obrigatório"}`, http.StatusBadRequest)
		return
	}

	switch r.Method {
	case http.MethodPut:
		var req TaskRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, `{"error":"payload inválido"}`, http.StatusBadRequest)
			return
		}
		task, err := h.store.Update(id, req.Title, req.Description, req.Status)
		if err != nil {
			http.Error(w, `{"error":"`+err.Error()+`"}`, http.StatusNotFound)
			return
		}
		json.NewEncoder(w).Encode(task)

	case http.MethodDelete:
		if err := h.store.Delete(id); err != nil {
			http.Error(w, `{"error":"`+err.Error()+`"}`, http.StatusNotFound)
			return
		}
		w.WriteHeader(http.StatusNoContent)

	default:
		http.Error(w, `{"error":"método não permitido"}`, http.StatusMethodNotAllowed)
	}
}