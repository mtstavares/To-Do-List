// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;


const FILE_PATH = path.join(__dirname, 'tasks.json');

app.use(cors({
  origin: 'https://mtstavares.github.io'
}));

app.use(express.json());

// Função para ler tarefas do arquivo
function readTasks() {
  try {
    const data = fs.readFileSync(FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Função para salvar tarefas no arquivo
function writeTasks(tasks) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2), 'utf-8');
}

//Listar tarefas
app.get('/api/tasks', (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
});

// Criar nova tarefa
app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Título obrigatório' });

  const tasks = readTasks();
  const newTask = {
    id: Date.now(), 
    title,
    completed: false
  };

  tasks.push(newTask);
  writeTasks(tasks);

  res.status(201).json(newTask);
});

//Alternar status de tarefa
app.put('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const tasks = readTasks();

  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });

  task.completed = !task.completed;
  writeTasks(tasks);

  res.json(task);
});

//Excluir tarefa
app.delete('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let tasks = readTasks();

  const taskExists = tasks.some(t => t.id === id);
  if (!taskExists) return res.status(404).json({ error: 'Tarefa não encontrada' });

  tasks = tasks.filter(t => t.id !== id);
  writeTasks(tasks);

  res.status(204).end();
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
