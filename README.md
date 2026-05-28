# Meet Extension

A Google Meet browser extension that provides an AI-powered chat overlay to interact with meeting recordings, manage captions, and query meeting content.

## Features
- Resizable, draggable chat overlay integrated with Google Meet dark theme.
- Authentication flow for users.
- Recording controls (start, pause, stop) with caption support.
- Backend AI workflow for processing queries.
- Dashboard with analytics and personalization.

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
└─ README.md          # Project description (this file)
```

## Getting Started
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/meet_extension.git
   cd meet_extension
   ```
2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```
3. **Run the backend server**
   ```bash
   npm run dev   # starts the Express server
   ```
4. **Install dashboard dependencies**
   ```bash
   cd ../dashboard
   npm install
   npm start   # launches the React dev server
   ```
5. **Load the extension**
   - Open Chrome extensions (`chrome://extensions`).
   - Enable *Developer mode*.
   - Click *Load unpacked* and select `extension/dist` directory.

## Development
- **Backend**: Edit files under `backend/`. The API is documented in `backend/routes/`.
- **Dashboard**: React components live in `dashboard/src/`. Use `npm start` for hot‑reloading.
- **Extension UI**: The main UI is `extension/src/content-page.jsx`. Styles use Tailwind CSS.

## Scripts
| Script | Description |
|--------|-------------|
| `npm run dev` (backend) | Starts the Express server with nodemon |
| `npx chroma run --path ./chroma-knowledge-base` | Starts the ChromaDB server |
| `npm run start` (dashboard) | Runs the React development server |
| `npm run build` (dashboard) | Builds the production dashboard |
| `npm run lint` | Lints JavaScript/JSX files |

## Contributing
1. Fork the repository.
2. Create a feature branch.
3. Ensure linting passes (`npm run lint`).
4. Open a Pull Request describing your changes.
