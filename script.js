const API_BASE = 'http://localhost:3000/api';

const loginDiv = document.getElementById('login');
const signupDiv = document.getElementById('signup');
const mainDiv = document.getElementById('main');
const projectList = document.getElementById('projects');

let selectedProjectId = null;
let currentProjects = [];

function login() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        showMain();
      } else {
        alert(data.message || 'Login failed');
      }
    })
    .catch(() => alert('Login failed'));
}

function signup() {
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value.trim();

  fetch(`${API_BASE}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.message === 'User created') {
        alert('Signup successful! Please login.');
        showLogin();
      } else {
        alert(data.message || 'Signup failed');
      }
    })
    .catch(() => alert('Signup failed'));
}

function showMain() {
  loginDiv.style.display = 'none';
  signupDiv.style.display = 'none';
  mainDiv.style.display = 'block';
  document.getElementById('task-section').style.display = 'none';
  loadProjects();
}

function loadProjects() {
  projectList.innerHTML = 'Loading projects...';

  fetch(`${API_BASE}/projects`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })
    .then(res => {
      if (res.status === 401) throw new Error('Unauthorized');
      return res.json();
    })
    .then(data => {
      currentProjects = data;
      displayProjects(data);
    })
    .catch(() => {
      alert('Failed to load projects or session expired.');
      logout();
    });
}

function displayProjects(projects) {
  projectList.innerHTML = '';
  if (projects.length === 0) {
    projectList.textContent = 'No projects found.';
    return;
  }

  projects.forEach(p => {
    const projectDiv = document.createElement('div');
    projectDiv.textContent = `${p.project_name} - ${p.description}`;

    const viewTasksBtn = document.createElement('button');
    viewTasksBtn.textContent = 'View Tasks';
    viewTasksBtn.onclick = () => loadTasks(p.project_id);

    projectDiv.appendChild(viewTasksBtn);
    projectList.appendChild(projectDiv);
  });
}

function loadTasks(projectId) {
  selectedProjectId = projectId;
  const project = currentProjects.find(p => p.project_id === projectId);
  document.getElementById('task-section').style.display = 'block';
  document.getElementById('current-project-name').textContent = project?.project_name || 'Project';

  fetch(`${API_BASE}/projects/${projectId}/tasks`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })
    .then(res => res.json())
    .then(data => {
      const taskList = document.getElementById('task-list');
      taskList.innerHTML = '';

      if (data.length === 0) {
        taskList.innerHTML = '<p>No tasks found.</p>';
        return;
      }

      data.forEach(task => {
        const div = document.createElement('div');
        div.innerHTML = `
          <strong>${task.task_name}</strong> (${task.status})
          <button onclick="editTaskPrompt(${task.task_id}, '${task.task_name}', '${task.status}')">Edit</button>
          <button onclick="deleteTask(${task.task_id})">Delete</button>
        `;
        taskList.appendChild(div);
      });
    });
}

function addTask() {
  const task_name = document.getElementById('new-task-name').value.trim();
  const status = document.getElementById('new-task-status').value.trim();

  if (!task_name || !status) {
    alert('Please enter task name and status.');
    return;
  }

  fetch(`${API_BASE}/projects/${selectedProjectId}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ task_name, status }),
  })
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(() => {
      document.getElementById('new-task-name').value = '';
      document.getElementById('new-task-status').value = '';
      loadTasks(selectedProjectId);
    })
    .catch(() => alert('Failed to add task.'));
}

function editTaskPrompt(taskId, currentName, currentStatus) {
  const newName = prompt('Edit Task Name:', currentName);
  if (newName === null) return;
  const newStatus = prompt('Edit Task Status:', currentStatus);
  if (newStatus === null) return;

  fetch(`${API_BASE}/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ task_name: newName, status: newStatus }),
  })
    .then(res => {
      if (!res.ok) throw new Error();
      loadTasks(selectedProjectId);
    })
    .catch(() => alert('Failed to edit task.'));
}

function deleteTask(taskId) {
  if (!confirm('Delete this task?')) return;

  fetch(`${API_BASE}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })
    .then(res => {
      if (!res.ok) throw new Error();
      loadTasks(selectedProjectId);
    })
    .catch(() => alert('Failed to delete task.'));
}

function createProject() {
  const project_name = document.getElementById('pname').value.trim();
  const description = document.getElementById('pdesc').value.trim();
  const start_date = document.getElementById('pstart').value;
  const end_date = document.getElementById('pend').value;

  if (!project_name || !description || !start_date || !end_date) {
    alert('Please fill all project fields');
    return;
  }

  fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ project_name, description, start_date, end_date }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.project_id) {
        alert('Project created!');
        loadProjects();
        document.getElementById('pname').value = '';
        document.getElementById('pdesc').value = '';
        document.getElementById('pstart').value = '';
        document.getElementById('pend').value = '';
      } else {
        alert(data.message || 'Failed to create project');
      }
    });
}

function logout() {
  localStorage.removeItem('token');
  mainDiv.style.display = 'none';
  loginDiv.style.display = 'block';
}

// Auto-login if token is present
window.onload = () => {
  if (localStorage.getItem('token')) {
    showMain();
  }
};
