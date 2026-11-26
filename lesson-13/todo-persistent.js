const TODOS_STORAGE_KEY = "todos";
const FILTER_STORAGE_KEY = "filter";

function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getFromStorage(key, defaultValue = null) {
    const raw = localStorage.getItem(key);
    if (raw === null) {
        return defaultValue;
    }

    try {
        return JSON.parse(raw);
    } catch {
        return defaultValue;
    }
}

// 1. Load ONCE at startup
let todos = getFromStorage(TODOS_STORAGE_KEY, []);
let currentFilter = getFromStorage(FILTER_STORAGE_KEY, "all");

const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const filterButtons = document.querySelectorAll("[data-filter]");

function getVisibleTodos() {
    if (currentFilter === "active") {
        return todos.filter((t) => !t.completed);
    }
    if (currentFilter === "completed") {
        return todos.filter((t) => t.completed);
    }
    return todos;
}

function render() {
    const visibleTodos = getVisibleTodos();
    todoList.innerHTML = "";

    visibleTodos.forEach((todo) => {
        const li = document.createElement("li");
        li.dataset.id = String(todo.id);

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;

        const label = document.createElement("span");
        label.textContent = todo.text;
        if (todo.completed) {
            label.style.textDecoration = "line-through";
        }

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.dataset.action = "delete";
        deleteBtn.textContent = "Delete";

        li.append(checkbox, label, deleteBtn);
        todoList.appendChild(li);
    });

    filterButtons.forEach((btn) => {
        btn.setAttribute("aria-pressed", String(btn.dataset.filter === currentFilter));
    });
}

// 2. Single place that persists and redraws
function commit() {
    saveToStorage(TODOS_STORAGE_KEY, todos);
    saveToStorage(FILTER_STORAGE_KEY, currentFilter);
    render();
}

// 3. Actions update state, then call commit()
function addTodo(text) {
    const trimmed = text.trim();
    if (!trimmed) {
        return;
    }

    todos = [
        ...todos,
        {
            id: Date.now(),
            text: trimmed,
            completed: false,
            createdAt: new Date().toISOString(),
        },
    ];
    commit();
}

function toggleTodo(id) {
    todos = todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    commit();
}

function deleteTodo(id) {
    todos = todos.filter((t) => t.id !== id);
    commit();
}

function setFilter(filter) {
    currentFilter = filter;
    commit();
}

todoForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addTodo(todoInput.value);
    todoInput.value = "";
});

todoList.addEventListener("change", (event) => {
    if (event.target.type !== "checkbox") {
        return;
    }
    const item = event.target.closest("li");
    if (item) {
        toggleTodo(Number(item.dataset.id));
    }
});

todoList.addEventListener("click", (event) => {
    if (event.target.dataset.action !== "delete") {
        return;
    }
    const item = event.target.closest("li");
    if (item) {
        deleteTodo(Number(item.dataset.id));
    }
});

filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        setFilter(btn.dataset.filter);
    });
});

render();