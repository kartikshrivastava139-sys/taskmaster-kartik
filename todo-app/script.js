let currentUser = localStorage.getItem("currentUser");
let currentFilter = "all";

function getTasks() {
  return JSON.parse(localStorage.getItem(currentUser + "_tasks")) || [];
}

function saveTasks(tasks) {
  localStorage.setItem(currentUser + "_tasks", JSON.stringify(tasks));
}

function addTask() {
  let input = document.getElementById("taskInput");
  let task = input.value.trim();

  if (task === "") return;

  let tasks = getTasks();
  tasks.push({ text: task, completed: false });

  saveTasks(tasks);
  input.value = "";
  renderTasks();
}

function renderTasks() {
  let list = document.getElementById("taskList");
  let tasks = getTasks();

  list.innerHTML = "";

  let filtered = tasks.filter(t => {
    if (currentFilter === "completed") return t.completed;
    if (currentFilter === "pending") return !t.completed;
    return true;
  });

  filtered.forEach((task, index) => {
    let li = document.createElement("li");

    li.innerHTML = `
      <span class="${task.completed ? 'completed' : ''}">
        ${task.text}
      </span>
      <div>
        <button onclick="toggleTask(${index})">✔</button>
        <button onclick="deleteTask(${index})">❌</button>
      </div>
    `;

    list.appendChild(li);
  });

  updateProgress(tasks);
  document.getElementById("counter").innerText = "Total Tasks: " + tasks.length;

  document.getElementById("emptyMsg").style.display =
    tasks.length === 0 ? "block" : "none";
}

function toggleTask(index) {
  let tasks = getTasks();
  tasks[index].completed = !tasks[index].completed;
  saveTasks(tasks);
  renderTasks();
}

function deleteTask(index) {
  let tasks = getTasks();
  tasks.splice(index, 1);
  saveTasks(tasks);
  renderTasks();
}

function filterTasks(type) {
  currentFilter = type;
  renderTasks();
}

function updateProgress(tasks) {
  let completed = tasks.filter(t => t.completed).length;
  let total = tasks.length;

  let percent = total === 0 ? 0 : (completed / total) * 100;

  document.getElementById("progressFill").style.width = percent + "%";
  document.getElementById("progressText").innerText =
    "Progress: " + Math.round(percent) + "%";
}

function logout() {
  localStorage.setItem("isLoggedIn", "false");
  window.location.href = "login.html";
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

renderTasks();