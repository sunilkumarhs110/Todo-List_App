import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory data storage
let tasks = [
  { id: 1, title: 'Learn React', status: 'todo' },
  { id: 2, title: 'Build Todo App', status: 'ongoing' },
  { id: 3, title: 'Deploy App', status: 'completed' }
];

let taskId = 4;

// GET - Fetch all tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// GET - Fetch tasks by status
app.get('/api/tasks/:status', (req, res) => {
  const { status } = req.params;
  const filteredTasks = tasks.filter(task => task.status === status);
  res.json(filteredTasks);
});

// POST - Add new task
app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Task title is required' });
  }

  const newTask = {
    id: taskId++,
    title: title.trim(),
    status: 'todo'
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT - Update task status
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const task = tasks.find(t => t.id === parseInt(id));
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  if (!['todo', 'ongoing', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  task.status = status;
  res.json(task);
});

// DELETE - Remove a task
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const index = tasks.findIndex(t => t.id === parseInt(id));
  
  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const deletedTask = tasks.splice(index, 1);
  res.json({ message: 'Task deleted successfully', task: deletedTask[0] });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
