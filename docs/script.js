const apiUrl = 'http://localhost:5000/api/tasks';

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const loadingDiv = document.getElementById('loading');

// Função genérica para ações com carregamento
async function withLoading(actionCallback) {
  try {
    loadingDiv.style.display = 'flex';
    await actionCallback(); // executa a ação
    await loadTasks(); // atualiza tarefas depois
  } catch (err) {
    console.error('Erro na ação:', err);
    loadingDiv.innerHTML = '<span>⚠️ Erro na operação.</span>';
  } finally {
    setTimeout(() => {
      loadingDiv.style.display = 'none';
    }, 300);
  }
}

// Carrega as tarefas da API
async function loadTasks(retry = 0) {
  try {
    taskList.innerHTML = '';
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
    const tasks = await res.json();
    tasks.forEach(addTaskToDOM);
  } catch (err) {
    console.warn(`Tentativa ${retry + 1}:`, err.message);

    if (retry < 3) {
      // Espera e tenta novamente após 3 segundos
      setTimeout(() => {
        loadTasks(retry + 1);
      }, 1000);
    } else {
      taskList.innerHTML = '<li>❌ Erro ao carregar tarefas. Tente atualizar.</li>';
    }
  }
}

// Insere uma tarefa no DOM
function addTaskToDOM(task) {
  const li = document.createElement('li');
  if (task.completed) li.classList.add('completed');

  const taskText = document.createElement('span');
  taskText.textContent = task.title;
  taskText.className = 'task-text';

  const buttonsDiv = document.createElement('div');
  buttonsDiv.className = 'task-buttons';

  // Botão de concluir/desmarcar
  const toggleBtn = document.createElement('button');
  toggleBtn.innerHTML = task.completed
    ? '<i class="fas fa-rotate-left"></i>'
    : '<i class="fas fa-check"></i>';
  toggleBtn.title = task.completed ? 'Desmarcar' : 'Concluir';
  toggleBtn.onclick = () =>
    withLoading(() =>
      fetch(`${apiUrl}/${task.id}`, { method: 'PUT' })
    );

  // Botão de excluir
  const delBtn = document.createElement('button');
  delBtn.innerHTML = '<i class="fas fa-trash"></i>';
  delBtn.title = 'Excluir';
  delBtn.onclick = (e) => {
    e.stopPropagation();
    withLoading(() =>
      fetch(`${apiUrl}/${task.id}`, { method: 'DELETE' })
    );
  };

  buttonsDiv.append(toggleBtn, delBtn);
  li.append(taskText, buttonsDiv);
  taskList.appendChild(li);
}

// Submeter nova tarefa
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;

  withLoading(async () => {
    await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    taskInput.value = '';
  });
});

// Carregar ao iniciar
loadTasks();
