const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(__dirname));

// Connect to MongoDB
mongoose.connect('mongodb+srv://hayksargsyan2015:980501hayk980501@cluster0.rirafjc.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });

// Create a task schema
const taskSchema = new mongoose.Schema({
  content: String,
  completed: Boolean
});

// Create a Task model
const Task = mongoose.model('Task', taskSchema);

// Get all tasks
app.get('/tasks', (req, res) => {
  Task.find()
    .then(tasks => {
      res.json(tasks);
    })
    .catch(error => {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ error: 'Error fetching tasks' });
    });
});

// Create a new task
app.post('/tasks', (req, res) => {
  const { content } = req.body;
  const newTask = new Task({
    content,
    completed: false
  });
  newTask.save()
    .then(task => {
      res.status(201).json(task);
    })
    .catch(error => {
      console.error('Error creating task:', error);
      res.status(500).json({ error: 'Error creating task' });
    });
});

// Update a task
app.patch('/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const { completed, content } = req.body;

  Task.findByIdAndUpdate(taskId, { completed, content }, { new: true })
    .then(task => {
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json(task);
    })
    .catch(error => {
      console.error('Error updating task:', error);
      res.status(500).json({ error: 'Error updating task' });
    });
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  const taskId = req.params.id;

  Task.findByIdAndRemove(taskId)
    .then(task => {
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json(task);
    })
    .catch(error => {
      console.error('Error deleting task:', error);
      res.status(500).json({ error: 'Error deleting task' });
    });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

