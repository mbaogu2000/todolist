
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskInfo = document.getElementById("taskInfo");
const emptyMessage = document.getElementById("emptyMessage");
const filterButtons = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("taskflow-tasks")) || [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("taskflow-tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = `task ${task.completed ? "done" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", "Mark task as completed");

    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", () => {
      tasks = tasks.filter(item => item.id !== task.id);
      saveTasks();
      renderTasks();
    });

    li.append(checkbox, text, deleteButton);
    taskList.appendChild(li);
  });

  const remaining = tasks.filter(task => !task.completed).length;

  taskInfo.textContent =
    `You have ${remaining} task${remaining !== 1 ? "s" : ""} remaining.`;

  emptyMessage.hidden = filteredTasks.length > 0;
}

taskForm.addEventListener("submit", event => {
  event.preventDefault();

  const text = taskInput.value.trim();

  if (!text) return;

  tasks.push({
    id: Date.now() + Math.random(),
    text,
    completed: false
  });

  saveTasks();
  taskInput.value = "";
  currentFilter = "all";

  filterButtons.forEach(button => {
    button.classList.toggle("active", button.dataset.filter === "all");
  });

  renderTasks();
  taskInput.focus();
});

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;

    filterButtons.forEach(item => {
      item.classList.toggle("active", item === button);
    });

    renderTasks();
  });
});

renderTasks();
