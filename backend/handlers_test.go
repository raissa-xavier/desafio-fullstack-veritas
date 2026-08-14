package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestCreateAndGetTasks(t *testing.T) {
	store := NewTaskStore("test_tasks.json")
	handler := NewHandler(store)

	// 1. Testa criação de tarefa
	payload := []byte(`{"title":"Tarefa de Teste","description":"Descrição teste","status":"A Fazer"}`)
	req, _ := http.NewRequest(http.MethodPost, "/tasks", bytes.NewBuffer(payload))
	rr := httptest.NewRecorder()

	handler.TasksHandler(rr, req)

	if status := rr.Code; status != http.StatusCreated {
		t.Errorf("status esperado %v, recebido %v", http.StatusCreated, status)
	}

	// 2. Testa listagem de tarefas
	reqGet, _ := http.NewRequest(http.MethodGet, "/tasks", nil)
	rrGet := httptest.NewRecorder()

	handler.TasksHandler(rrGet, reqGet)

	if status := rrGet.Code; status != http.StatusOK {
		t.Errorf("status esperado %v, recebido %v", http.StatusOK, status)
	}

	var tasks []Task
	json.NewDecoder(rrGet.Body).Decode(&tasks)
	if len(tasks) == 0 {
		t.Errorf("esperava encontrar ao menos 1 tarefa cadastrada")
	}
}