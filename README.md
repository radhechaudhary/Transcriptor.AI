# Transcriptor.AI

A Google Meet browser extension that provides an AI-powered chat overlay to interact with meeting recordings, manage captions, and query meeting content.

## Features
- Resizable, draggable chat overlay integrated with Google Meet dark theme.
- Authentication flow for users.
- Recording controls (start, pause, stop) with caption support.
- Backend AI workflow for processing queries.
- Dashboard with analytics and personalization.
- RAG Powered intelligent answering system.
- Realtime LLM responses.
- Meeting insights with transcription and summary

## Project Structure
```
meet_extension/
├─ backend/          # Express server handling AI workflows and routes
│   ├─ ai-workflows/   # Query processing logic
│   └─ controllers/    # Request handlers
│   └─ routes/        # API endpoints
├─ dashboard/        # React dashboard application
├─ extension/        # Browser extension source (React components, content script)
│   └─ src/content-page.jsx
├─ docker-compose.yaml # Docker Compose orchestrator
└─ README.md          # Project documentation (this file)
```

## Running the Project with Docker

Follow these steps to run the complete environment (backend, dashboard, postgres, redis, and chromadb) using Docker.

### 1. Prerequisites
Ensure you have the following installed on your machine:
- [Docker](https://docs.docker.com/get-docker/)

### 2. Configure Environment Variables
Create a `.env` file in the root directory of the project (if it doesn't already exist) and populate it with your LLM API keys:

```env
OPENROUTER_API_KEY="your-openrouter-api-key"
GROQ_API_KEY="your-groq-api-key"
```

### 3. Spin Up the Services
From the root directory of the project, start all services using Docker Compose:

```bash
docker compose up 
```

This command will:
- Build and launch the Express **backend** (accessible at `http://localhost:4000`).
- Build and launch the React **dashboard** (accessible at `http://localhost:5173`).
- Start the **PostgreSQL** database (port `5433` on host).
- Start the **Redis** cache (port `6379` on host).
- Start the **ChromaDB** vector database (port `8000` on host).
- Automatically run the database **migrations** to set up schemas.

### 4. Chrome Extension
The extension runs in the browser and must be built locally, then loaded into Chrome.

1. Go to Chrome Extension page.
2. Enable **Developer mode** (toggle in the top-right corner).
3. Click **Load unpacked** (top-left button).
4. Select the `extension/dist` folder.

---

## Service Ports Mapping

| Service | Host Port | Container Port | URL / DSN |
|---------|-----------|----------------|-----------|
| **Backend API** | `4000` | `3000` | `http://localhost:4000` |
| **Dashboard** | `5173` | `5173` | `http://localhost:5173` |
| **PostgreSQL** | `5433` | `5432` | `postgresql://postgres:Radhe@1234@localhost:5433/meet` |
| **Redis Cache** | `6379` | `6379` | `redis://localhost:6379` |
| **ChromaDB** | `8000` | `8000` | `http://localhost:8000` |

---

## Development & Troubleshooting

- **Logs**: To view logs for a specific service (e.g., the backend), run:
  ```bash
  docker compose logs -f backend
  ```
- **Stopping Services**: To stop and remove the containers, run:
  ```bash
  docker compose down
  ```
- **Rebuilding after changes**: If you modify configuration files or dependencies, rebuild and start:
  ```bash
  docker compose up --build
  ```
