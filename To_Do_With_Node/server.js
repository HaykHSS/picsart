const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(__dirname));
let tasks = [];

// Get all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// Create a new task
app.post('/tasks', (req, res) => {
  const { content } = req.body;
  const newTask = {
    id: tasks.length + 1,
    content,
    completed: false
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Update a task
app.patch('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const { completed } = req.body;

  const task = tasks.find(task => task.id === taskId);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  task.completed = completed;
  res.json(task);
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);

  const taskIndex = tasks.findIndex(task => task.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];
  res.json(deletedTask);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

