package main

import (
	"log"
	"net/http"
	"strings"
)

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	store := NewTaskStore("tasks.json")
	handler := NewHandler(store)

	mux := http.NewServeMux()

	mux.HandleFunc("/tasks", handler.TasksHandler)
	mux.HandleFunc("/tasks/", func(w http.ResponseWriter, r *http.Request) {
		if strings.TrimPrefix(r.URL.Path, "/tasks/") == "" {
			handler.TasksHandler(w, r)
			return
		}
		handler.TaskByIDHandler(w, r)
	})

	port := ":8080"
	log.Printf("Servidor rodando em http://localhost%s\n", port)
	if err := http.ListenAndServe(port, enableCORS(mux)); err != nil {
		log.Fatalf("Erro ao iniciar servidor: %v", err)
	}
}