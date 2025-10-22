const tasksList = document.querySelector("#taskList");
const addTaskForm = document.querySelector("#taskForm");
const addTaskInput = document.querySelector("#taskInput");
const clearAllTasksBtn = document.querySelector("#cleartask");

let list = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(list));
}

function showTasksList() {
  tasksList.innerHTML = "";
  saveTasks();

  if (list.length === 0) {
    clearAllTasksBtn.disabled = true;

    const element = String.raw`
      <div class="ui icon warning message">
        <i class="inbox icon"></i>
        <div class="content">
          <div class="header">You have nothing task today!</div>
          <div>Enter your tasks today above.</div>
        </div>
      </div>
    `;

    tasksList.style.border = "none";
    return tasksList.insertAdjacentHTML("beforeend", element);
  }

  clearAllTasksBtn.disabled = false;
  tasksList.style.border = "1px solid rgba(34,36,38,.15)";

  list
    .slice()
    .reverse()
    .forEach((task) => {
      const element = String.raw`
        <li class="ui segment grid equal width">
          <div class="ui checkbox column">
            <input type="checkbox" ${
              task.completed ? "checked" : ""
            } data-id="${task.id}">
            <label>${task.text}</label>
          </div>
          <div class="column">
            <i data-id="${task.id}" style="position: absolute; left:83%;" class="edit outline icon"></i>
            <i data-id="${task.id}" style="position: absolute; left:90%;" class="trash alternate outline remove icon"></i>
          </div>
        </li>
      `;

      tasksList.insertAdjacentHTML("beforeend", element);
    });

  document.querySelectorAll("li i.edit").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      showEditModal(+e.target.dataset.id);
    });
  });

  document.querySelectorAll("li i.trash").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      showRemoveModal(+e.target.dataset.id);
    });
  });

  document.querySelectorAll("li input[type='checkbox']").forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
      completeTask(+e.target.dataset.id);
    });
  });
}

function addTask(event) {
  event.preventDefault();

  const taskText = addTaskInput.value.trim();
  if (taskText.length === 0) {
    addTaskInput.value = "";
    return;
  }

  list.push({
    id: Date.now(),
    text: taskText,
    completed: false,
  });

  saveTasks();
  addTaskInput.value = "";
  showNotification("success", "Task was successfully added");
  showTasksList();
}

function removeTask(id) {
  list = list.filter(t => t.id !== id)
  saveTasks();

  showNotification("error", "Task was successfully deleted")
  showTasksList()
}

function editTask(id) {
  const taskText = document.querySelector("#task-text").value

  if (taskText.trim().length === 0) return
  const taskIndex = list.findIndex(t => t.id == id)

  list[taskIndex].text = taskText
  saveTasks();

  showNotification("success", "Task was successfully updated")
  showTasksList()
}


function clearAllTasks() {
  if (list.length > 0) {
    if (confirm("Are you sure you want to delete all tasks?")) {
      list = [];
      saveTasks();
      showTasksList();
      showNotification("error", "All tasks have been cleared");
    }
  }
}

function showEditModal(id) {
  const task = list.find(t => t.id == id);
  if (!task) return;
  document.querySelector("#task-id").value = id;
  document.querySelector("#task-text").value = task.text.trim();

  const updateBtn = document.querySelector("#update-button");
  updateBtn.replaceWith(updateBtn.cloneNode(true));
  document.querySelector("#update-button").addEventListener("click", () => editTask(+id));

  $("#edit-modal.modal").modal("show");
}


function showRemoveModal(id) {
  
  const removeBtn = document.querySelector("#remove-button");
  removeBtn.replaceWith(removeBtn.cloneNode(true));
  document.querySelector("#remove-button").addEventListener("click", () => removeTask(+id));
  $("#remove-modal.modal").modal("show");
}



function showNotification(type, text) {
 let layout = "bottomLeft";
if (type === "success") {
  layout = "bottomRight";
}

new Noty({
  type,
  text: `<i class="check icon"></i> ${text}`,
  layout,
  timeout: 1000,
  closeWith: ["click"],
  progressBar: true,
  theme: "metroui",
}).show();

}

addTaskForm.addEventListener("submit", addTask);
clearAllTasksBtn.addEventListener("click", clearAllTasks);

showTasksList();
