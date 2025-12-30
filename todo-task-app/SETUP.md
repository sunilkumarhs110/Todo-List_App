# Todo List Application (React + Vite + Express)

A full-stack todo list application built with React, Vite frontend, and Express.js backend.

## Features

✅ **Add Tasks** - Create new tasks with a simple form
🗑️ **Delete Tasks** - Remove tasks from any status
➡️ **Move Tasks** - Progress tasks through Todo → Ongoing → Completed workflow
📊 **Task Organization** - Tasks organized by status (Todo, Ongoing, Completed)

## Project Structure

```
todo-task-app/
├── src/
│   ├── App.jsx           # Main React component
│   ├── App.css           # Styling
│   ├── pages/
│   │   └── Home.jsx      # Home page with task management
│   └── main.jsx          # React entry point
├── server.js             # Express.js backend server
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
└── index.html            # HTML entry point
```

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

**In one terminal - Start the backend server (port 5000):**
```bash
npm run server
```

**In another terminal - Start the frontend (port 5173):**
```bash
npm run dev
```

Then open your browser and navigate to `http://localhost:5173`

## Backend API Endpoints

### GET /api/tasks
Fetch all tasks
```
Response: [{ id, title, status }, ...]
```

### GET /api/tasks/:status
Fetch tasks by status (todo, ongoing, completed)
```
Response: [{ id, title, status }, ...]
```

### POST /api/tasks
Create a new task
```json
Body: { "title": "Task title" }
Response: { "id": 4, "title": "Task title", "status": "todo" }
```

### PUT /api/tasks/:id
Update task status
```json
Body: { "status": "ongoing" | "completed" | "todo" }
Response: { "id": 1, "title": "Task title", "status": "ongoing" }
```

### DELETE /api/tasks/:id
Delete a task
```
Response: { "message": "Task deleted successfully", "task": {...} }
```

## Task Workflow

1. **Create Task** - Enter task name and click "ADD TASK" → Task appears in "Todo Tasks"
2. **Progress Task** - Click "Next →" button to move task to next status
3. **Undo Progress** - Click "← Back" button to move task to previous status
4. **Delete Task** - Click "🗑️ Delete" button to remove task permanently

## Technologies Used

- **Frontend**: React 19, Vite
- **Backend**: Express.js
- **Styling**: CSS3
- **API Communication**: Fetch API
- **Data Storage**: In-memory (server restarts will reset data)

## Status Codes

- ✅ 200/201 - Success
- ❌ 400 - Bad Request (missing required fields)
- ❌ 404 - Task not found
- ❌ 500 - Server error

## Future Enhancements

- Database integration (MongoDB, PostgreSQL)
- User authentication
- Task editing capability
- Task due dates and priorities
- Local storage persistence
- Dark mode theme

## Notes

- Tasks are stored in memory, so they will be reset when the server restarts
- The frontend automatically fetches all tasks on load
- Error messages are displayed in the UI if any operation fails
