const taskList = document.getElementById("taskList");
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");

function saveTasks() {
  localStorage.setItem("tasks", taskList.innerHTML);
}

function loadTasks() {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    taskList.innerHTML = saved;
  }
  // Hide the task list if it's empty
  if (taskList.children.length === 0) {
    taskList.style.display = "none";
  } else {
    taskList.style.display = "block";
  }
}
function createTask(text) {
  const task = document.createElement("div");
  task.className = "task";

  task.innerHTML = `
    <div class="task-left">
      <div class="circle" onclick="toggleComplete(this)"></div>
      <span>${text}</span>
    </div>
    <div class="task-actions">
      <button onclick="editTask(this)">✏️</button>
      <button onclick="deleteTask(this)">🗑️</button>
      <button onclick="starTask(this)">☆</button>
    </div>
  `;
  taskList.append(task);
  taskList.style.display = "block";

  saveTasks();
}
function addTask() {
  let text = taskInput.value;
  if (text !== "") {
    createTask(text);
    taskInput.value = "";
  }
}
// Event listeners
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    addTask();
  }
});
function editTask(btn) {
  const span = btn.parentElement.previousElementSibling.querySelector("span");
  span.contentEditable = true;
  span.focus();
  // Add editing class instead of inline styles
  span.classList.add("editing");
  span.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      span.contentEditable = false;
      // Remove editing class after finishing
      span.classList.remove("editing");
      saveTasks();
    }
  });
}

function deleteTask(btn) {
  const task = btn.closest(".task");
  if (task) {
    task.remove();
    saveTasks();
  }
  // Hide task list if empty
  if (taskList.children.length === 0) {
    taskList.style.display = "none";
  }
}
function starTask(btn) {
  if (btn.textContent === "☆") {
    btn.textContent = "⭐";
    btn.style.color = "yellow";
  } else {
    btn.textContent = "☆";
    btn.style.color = "white";
  }
  saveTasks();
}
function toggleComplete(circle) {
  const text = circle.nextElementSibling;
  const isDone = circle.classList.contains("completed");

  if (isDone) {
    circle.classList.remove("completed");
    circle.textContent = "";
    text.classList.remove("completed-text");
  } else {
    circle.classList.add("completed");
    circle.textContent = "✔";
    text.classList.add("completed-text");
  }
  saveTasks();
}
// Load tasks on page load
window.onload = loadTasks;
