const apiUrl = 'https://to-do-list-6766.onrender.com/api/tasks';

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const loadingDiv = document.getElementById('loading');

// Função principal para listar tarefas
async function loadTasks() {
  try {
    // Mostra "carregando"
    loadingDiv.style.display = 'block';
    taskList.innerHTML = '';

    const res = await fetch(apiUrl);
    const tasks = await res.json();

    tasks.forEach(addTaskToDOM);
  } catch (err) {
    console.error("Erro ao carregar tarefas:", err);
    loadingDiv.textContent = "⚠️ Erro ao carregar tarefas.";
  } finally {
    // Esconde o carregando
    setTimeout(() => {
      loadingDiv.style.display = 'none';
    }, 300); // tempo pequeno para UX suave
  }
}

// Cria e insere tarefas no DOM
function addTaskToDOM(task) {
  const li = document.createElement('li');
  if (task.completed) li.classList.add('completed');

  const taskText = document.createElement('span');
  taskText.textContent = task.title;
  taskText.className = 'task-text';

  const buttonsDiv = document.createElement('div');
  buttonsDiv.className = 'task-buttons';

  const toggleBtn = document.createElement('button');
  toggleBtn.innerHTML = task.completed
    ? '<i class="fas fa-rotate-left"></i>'
    : '<i class="fas fa-check"></i>';
  toggleBtn.title = task.completed ? 'Desmarcar' : 'Concluir';
  toggleBtn.onclick = async () => {
    await fetch(`${apiUrl}/${task.id}`, { method: 'PUT' });
    await loadTasks(); // garante recarregamento APÓS resposta
  };

  const delBtn = document.createElement('button');
  delBtn.innerHTML = '<i class="fas fa-trash"></i>';
  delBtn.title = 'Excluir';
  delBtn.onclick = async (e) => {
    e.stopPropagation();
    await fetch(`${apiUrl}/${task.id}`, { method: 'DELETE' });
    await loadTasks();
  };

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
  await loadTasks(); // garante atualização APÓS criação
});

// Início
loadTasks();
