
const tasksList = document.querySelector("#taskList");
const addTaskF = document.querySelector("#taskForm");
const addTaskInput = document.querySelector("#taskInput");
const clearAllBtn = document.querySelector("#cleartask");

let list = JSON.parse(localStorage.getItem("tasks")) || [];
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(list));
}

function showTasksList() {
  tasksList.innerHTML = "";
  saveTasks();
 
  if (list.length === 0) {
    tasksList.innerHTML = "<p>No tasks yet!</p>";
    clearAllBtn.disabled = true;
    return;
  }

  clearAllBtn.disabled = false;

  list.forEach(task => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${task.text}</span>
      <button class="delete">❌</button>
    `;
    li.querySelector(".delete").addEventListener("click", () => removeTask(task.id));
    tasksList.appendChild(li);
  });
}

function addTask(event) {
    saveTasks();
  event.preventDefault();
  const text = addTaskInput.value.trim();
  if (!text) return;
  const task = { id: Date.now(), text, completed: false };
  list.push(task);
  addTaskInput.value = "";
  showTasksList();
}

function removeTask(id) {
    saveTasks();
  list = list.filter(t => t.id !== id);
  showTasksList();
}

function clearAllTasks() {
  list = [];
  saveTasks();
  showTasksList();
}

addTaskF.addEventListener("submit", addTask);
clearAllBtn.addEventListener("click", clearAllTasks);

showTasksList();
