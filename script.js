const taskList = document.getElementById("taskList");
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");

let tasksArray = [];

function loadTasks() {
  const saved = localStorage.getItem("tasksArray");
  tasksArray = saved ? JSON.parse(saved) : [];

  taskList.innerHTML = ""; // Clear current tasks
  tasksArray.map(taskObj => createTaskFromArray(taskObj));

  taskList.style.display = tasksArray.length === 0 ? "none" : "block";

  console.log("Tasks loaded from localStorage:", tasksArray);
}

// Create a task element from array object
function createTaskFromArray(taskObj) {
  const task = document.createElement("div");
  task.className = "task";

  task.innerHTML = `
    <div class="task-left">
      <div class="circle ${taskObj.completed ? "completed" : ""}" onclick="toggleComplete(this)">
        ${taskObj.completed ? "✔" : ""}
      </div>
      <span class="${taskObj.completed ? "completed-text" : ""}">${taskObj.text}</span>
    </div>
    <div class="task-actions">
      <button onclick="editTask(this)">✏️</button>
      <button onclick="deleteTask(this)">🗑️</button>
      <button onclick="starTask(this)">${taskObj.starred ? "⭐" : "☆"}</button>
    </div>
  `;

  if (taskObj.starred) {
    task.querySelector("button:nth-child(3)").style.color = "yellow";
  }

  taskList.append(task);
  taskList.style.display = "block";
}

// Add a new task
function addTask() {
  const text = taskInput.value.trim();
  if (text !== "") {
    const taskObj = { text: text, completed: false, starred: false };
    tasksArray.push(taskObj);
    createTaskFromArray(taskObj);
    saveTasks();
    taskInput.value = "";

    console.log("Task added:", taskObj);
    console.log("Current tasks array:", tasksArray);
  }
}
function saveTasks() {
  localStorage.setItem("tasksArray", JSON.stringify(tasksArray));
  console.log("Saved tasksArray to localStorage:", tasksArray);
}

function editTask(btn) {
  const span = btn.parentElement.previousElementSibling.querySelector("span");
  span.contentEditable = true;
  span.focus();
  span.classList.add("editing");

  span.addEventListener("keydown", function handler(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      span.contentEditable = false;
      span.classList.remove("editing");

      const taskDiv = btn.closest(".task");
      const index = Array.from(taskList.children).indexOf(taskDiv);
      tasksArray[index].text = span.textContent;

      saveTasks();
      span.removeEventListener("keydown", handler);
    }
  });
}

// Delete task
function deleteTask(btn) {
  const taskDiv = btn.closest(".task");
  const index = Array.from(taskList.children).indexOf(taskDiv);

  tasksArray.splice(index, 1); // Remove from array
  taskDiv.remove(); // Remove DOM element
  saveTasks();

  if (tasksArray.length === 0) taskList.style.display = "none";
}
function starTask(btn) {
  const taskDiv = btn.closest(".task");
  const index = Array.from(taskList.children).indexOf(taskDiv);

  if (btn.textContent === "☆") {
    btn.textContent = "⭐";
    btn.style.color = "yellow";
    tasksArray[index].starred = true;
  } else {
    btn.textContent = "☆";
    btn.style.color = "white";
    tasksArray[index].starred = false;
  }
  saveTasks();
}
function toggleComplete(circle) {
  const taskDiv = circle.closest(".task");
  const index = Array.from(taskList.children).indexOf(taskDiv);
  const text = circle.nextElementSibling;
  const isDone = circle.classList.contains("completed");

  if (isDone) {
    circle.classList.remove("completed");
    circle.textContent = "";
    text.classList.remove("completed-text");
    tasksArray[index].completed = false;
  } else {
    circle.classList.add("completed");
    circle.textContent = "✔";
    text.classList.add("completed-text");
    tasksArray[index].completed = true;
  }
  saveTasks();
}
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") addTask();
});
window.onload = loadTasks;
