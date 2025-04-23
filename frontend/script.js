const apiUrl = 'https://to-do-list-6766.onrender.com/api/tasks';


const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

// Buscar e exibir tarefas
async function loadTasks() {
  const res = await fetch(apiUrl);
  const tasks = await res.json();

  taskList.innerHTML = '';
  tasks.forEach(addTaskToDOM);
}

// Adicionar tarefa na interface
function addTaskToDOM(task) {
    const li = document.createElement('li');
    if (task.completed) li.classList.add('completed');
  
    // Elemento de texto
    const taskText = document.createElement('span');
    taskText.textContent = task.title;
    taskText.className = 'task-text';
  
    // Div dos botões
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'task-buttons';
  
    // Botão de concluir/desmarcar
    const toggleBtn = document.createElement('button');
    toggleBtn.innerHTML = task.completed
      ? '<i class="fas fa-rotate-left"></i>'   
      : '<i class="fas fa-check"></i>';         
    toggleBtn.title = task.completed ? 'Desmarcar' : 'Concluir';
    toggleBtn.onclick = async () => {
      await fetch(`${apiUrl}/${task.id}`, { method: 'PUT' });
      loadTasks();
    };
  
    // Botão de deletar
    const delBtn = document.createElement('button');
    delBtn.innerHTML = '<i class="fas fa-trash"></i>'; // ícone de lixeira
    delBtn.title = 'Excluir';
    delBtn.onclick = async (e) => {
      e.stopPropagation();
      await fetch(`${apiUrl}/${task.id}`, { method: 'DELETE' });
      loadTasks();
    };
  
    // Montar item da lista
    buttonsDiv.append(toggleBtn, delBtn);
    li.append(taskText, buttonsDiv);
    taskList.appendChild(li);
  }
  
  

// Submeter nova tarefa
taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;

  await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });

  taskInput.value = '';
  loadTasks();
});

loadTasks();
