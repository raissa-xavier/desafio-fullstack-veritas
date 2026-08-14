# Mini Kanban de Tarefas

Desafio técnico fullstack: Veritas Consultoria Empresarial.

Aplicação simples de Kanban com três colunas fixas (**A Fazer**, **Em Progresso**, **Concluídas**), permitindo criar, editar, mover e excluir tarefas. Backend em **Go** (API REST) e frontend em **React**.

## Como rodar

### Backend

```bash
cd backend
go run .
```

O servidor sobe em `http://localhost:8080`. As tarefas são mantidas em memória e também salvas em `backend/tasks.json` a cada alteração, então os dados sobrevivem a um restart.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

A aplicação abre em `http://localhost:5173` e já aponta para `http://localhost:8080` por padrão. Se precisar apontar para outra URL de API, copie `.env.example` para `.env` e ajuste `VITE_API_URL`.

## Endpoints da API

| Método | Rota          | Descrição                    |
|--------|---------------|-------------------------------|
| GET    | `/tasks`      | Lista todas as tarefas       |
| POST   | `/tasks`      | Cria uma nova tarefa         |
| PUT    | `/tasks/{id}` | Atualiza título, descrição ou status de uma tarefa |
| DELETE | `/tasks/{id}` | Remove uma tarefa            |

Corpo esperado em `POST`/`PUT`:

```json
{
  "title": "Estudar Go",
  "description": "Ler a documentação oficial",
  "status": "todo"
}
```

`status` aceita `todo`, `doing` ou `done`. Se omitido na criação, assume `todo`.

## Decisões técnicas

- **Backend com `net/http` puro**, sem framework (Gin, Echo, etc.). Para o escopo do desafio, a biblioteca padrão do Go já cobre bem roteamento (usando `ServeMux` com path params, disponível a partir do Go 1.22), CORS manual e JSON — evita dependências desnecessárias.
- **Armazenamento em memória com persistência opcional em JSON** (`tasks.json`): atende ao requisito mínimo e ao bônus ao mesmo tempo, sem precisar de um banco de dados para um projeto desse tamanho.
- **Separação em `models.go` (estrutura e validação), `handlers.go` (rotas e regras HTTP) e `storage.go` (persistência em arquivo)**, mantendo `main.go` só com a inicialização do servidor.
- **Frontend com Vite + React puro**, sem bibliotecas de UI. Componentização simples: `App` (estado e chamadas à API) → `Column` → `TaskCard`, com `TaskForm` como modal reutilizado tanto para criar quanto para editar.
- **Mover tarefas entre colunas via botões (← →)** em vez de drag-and-drop, priorizando robustez e simplicidade dentro do prazo — drag-and-drop está listado como bônus.
- **Tratamento de loading e erro**: mensagem de carregamento ao buscar tarefas e um banner de erro caso a API não responda, sem travar a interface.

## Limitações conhecidas

- Sem autenticação/usuários — qualquer pessoa com acesso à API pode alterar as tarefas.
- Persistência em arquivo JSON simples, sem controle de concorrência avançado (usa mutex em memória, mas não é um banco de dados real).
- Sem testes automatizados.
- Sem drag-and-drop (bônus não implementado).

## Melhorias futuras

- Adicionar testes (unitários no backend, componente no frontend).
- Migrar persistência para um banco de dados (ex: SQLite ou Postgres).
- Implementar drag-and-drop entre colunas.
- Adicionar Docker Compose para subir backend + frontend com um único comando.
- Ordenação/reordenação de tarefas dentro da mesma coluna.
