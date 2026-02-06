const taskFrom = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const serachInput = document.getElementById("search-input");
const deleteAllBtn = document.getElementById("delete-all-btn");
const tasksList = document.getElementById("tasks-list");
const tasksListWrapper = document.getElementById("tasks-list-wrapper");
const message = document.getElementById("message");

let tasksArray = JSON.parse(localStorage.getItem("tasks")) || [];

let currentMode = "create";
let editingTaskIndex = "";
let draftTaskInput = "";
let searchQuery = "";

taskInput.addEventListener("input", () => {
    if (currentMode == "create") {
        draftTaskInput = taskInput.value;
        sessionStorage.setItem("draftTaskInput", draftTaskInput);
    };
});

window.addEventListener("load", () => {
    draftTaskInput = sessionStorage.getItem("draftTaskInput") || "";
    taskInput.value = draftTaskInput;
});

renderTasks();

// create tasks

function createTask () {
    if (currentMode !== "create") return;
    if (taskInput.value.trim() == "") return;
    
    const task = {
        id: Date.now(),
        title: taskInput.value.trim(),
        done: false
    };
    
    tasksArray.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasksArray));
    renderTasks();
};

// render tasks

function renderTasks () {
    tasksList.innerHTML = "";
   
    const filteredTasksArray = tasksArray.filter(task => task.title.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!filteredTasksArray.length && searchQuery == "") {
        message.textContent = "No tasks available";
        serachInput.style.display = "none";
    } else if (!filteredTasksArray.length && searchQuery !== "") {
        message.textContent = "No tasks available";
    } else if (filteredTasksArray.length){
        message.textContent = "";
        serachInput.style.display = "block";
    };

    deleteAllBtn.textContent = `Delete All (${tasksArray.length})`;
    
    filteredTasksArray.forEach(task => { 
        const li = document.createElement("li");
        li.dataset.index = task.id;
        
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("checkbox");
        
        const p = document.createElement("p");
        p.textContent = task.title;
        
        const editBtn = document.createElement("button");
        editBtn.classList.add("edit-btn");
        editBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--clr-text-main)">
        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h261q20 0 30 12.5t10 27.5q0 15-10.5 27.5T460-760H200v560h560v-261q0-20 12.5-30t27.5-10q15 0 27.5 10t12.5 30v261q0 33-23.5 56.5T760-120H200Zm280-360Zm-120 80v-97q0-16 6-30.5t17-25.5l344-344q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L553-384q-11 11-25.5 17.5T497-360h-97q-17 0-28.5-11.5T360-400Zm481-384-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z"/>
        </svg>`;
        
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--clr-text-main)">
        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
        </svg>`;
        
        if (task.done) {
            li.classList.add("done");
            checkbox.checked = true;
        } else {
            li.classList.remove("done");
            checkbox.checked = false;
        };
        
        li.appendChild(checkbox);
        li.appendChild(p);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        
        tasksList.appendChild(li);
    });
}

// edit tasks

function switchToEditMode (editedTask) {
    if (!editedTask) return;
    if (currentMode == "create") {
        draftTaskInput = taskInput.value;
    };

    taskInput.placeholder = `Edit task: ${editedTask.title}`;
    taskInput.value = editedTask.title;
    taskInput.focus();
    taskFrom.querySelector("button[type=\"submit\"]").textContent = "Edit";
    
    currentMode = "edit";
    editingTaskIndex = editedTask.id;
}

function switchToCreateMode () {
    taskInput.placeholder = `Add a new task`;
    taskInput.value = draftTaskInput;
    taskFrom.querySelector("button[type=\"submit\"]").textContent = "Add";
    
    currentMode = "create";
    editingTaskIndex = "";
};

function startEditTask (index) {
    const editedTask = tasksArray.find(task => task.id == index);

    switchToEditMode(editedTask);
};

function editTask (index) {
    const editedTask = tasksArray.find(task => task.id == index);
    
    if (taskInput.value.trim() == "") return;

    editedTask.title = taskInput.value.trim();

    localStorage.setItem("tasks", JSON.stringify(tasksArray));
    renderTasks();
};


// delete tasks

function deleteTask (index) {
    tasksArray = tasksArray.filter(task => task.id !== index);
    localStorage.setItem("tasks", JSON.stringify(tasksArray));
    renderTasks();
    
    if (currentMode == "edit") switchToCreateMode();
};

// delete all tasks

function deleteAll () {
    tasksArray = [];
    localStorage.setItem("tasks", JSON.stringify(tasksArray));
    renderTasks();
};

// check tasks

function checkTask (index) {
    const checkedTask = tasksArray.find(task => task.id == index);
    checkedTask.done = !checkedTask.done;
    
    localStorage.setItem("tasks", JSON.stringify(tasksArray));
    renderTasks();
};


// search tasks

function searchTasks () {
    searchQuery = serachInput.value.trim();
    renderTasks();
};

taskFrom.addEventListener("submit", () => {
    if (currentMode == "create") {
        createTask();
        taskInput.value = "";
    } else if (currentMode == "edit") {
        editTask(editingTaskIndex);
        switchToCreateMode();
    };  
});

serachInput.addEventListener("keyup", searchTasks);

deleteAllBtn.addEventListener("click", deleteAll);

tasksList.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;
    
    const li = button.closest("li");
    if (!li) return;
    
    const index = Number(li.dataset.index);
    
    if (button.classList.contains("delete-btn")) deleteTask(index)
    else if (button.classList.contains("edit-btn")) startEditTask(index);
});

tasksList.addEventListener("change", event => {
    const checkbox = event.target.closest("input[type=\"checkbox\"]");
    if (!checkbox) return;

    const li = checkbox.closest("li");
    if (!li) return;

    const index = Number(li.dataset.index);

    if (checkbox.classList.contains("checkbox")) checkTask(index);
});