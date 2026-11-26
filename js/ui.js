export function createTodoUI({ onAddTodo, onToggleTodo, onDeleteTodo, onFilterChange }) {
    const formEl = document.getElementById("todo-form");
    const inputEl = document.getElementById("todo-input");
    const listEl = document.getElementById("todo-list");
    const countEl = document.getElementById("todo-count");
    const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));

    function render(currentState) {
        const { visibleTodos, filter, counts } = currentState;

        countEl.textContent = `${counts.active} ${counts.active === 1 ? "item" : "items"} left`;

        filterButtons.forEach((button) => {
            const isSelected = button.dataset.filter === filter;
            button.setAttribute("aria-pressed", String(isSelected));
        });

        listEl.innerHTML = "";

        visibleTodos.forEach((todo) => {
            const li = document.createElement("li");
            li.className = "todo-item";
            li.dataset.id = String(todo.id);

            const mainGroup = document.createElement("div");
            mainGroup.className = "todo-item-main";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "todo-toggle";
            checkbox.checked = Boolean(todo.completed);
            checkbox.setAttribute("aria-label", `Mark "${todo.text}" as completed`);

            const span = document.createElement("span");
            span.textContent = todo.text;
            if (todo.completed) {
                span.classList.add("todo-text--completed");
            }

            const deleteBtn = document.createElement("button");
            deleteBtn.type = "button";
            deleteBtn.className = "todo-delete-btn";
            deleteBtn.dataset.action = "delete";
            deleteBtn.textContent = "Delete";

            mainGroup.append(checkbox, span);
            li.append(mainGroup, deleteBtn);
            listEl.appendChild(li);
        });
    }

    function bindEvents() {
        formEl.addEventListener("submit", (event) => {
            event.preventDefault();
            const text = inputEl.value;
            onAddTodo(text);
            inputEl.value = "";
            inputEl.focus();
        });

        listEl.addEventListener("change", (event) => {
            if (!event.target.classList.contains("todo-toggle")) {
                return;
            }
            const itemEl = event.target.closest("[data-id]");
            if (!itemEl) {
                return;
            }
            onToggleTodo(Number(itemEl.dataset.id));
        });

        listEl.addEventListener("click", (event) => {
            const deleteBtn = event.target.closest("[data-action='delete']");
            if (!deleteBtn) {
                return;
            }
            const itemEl = deleteBtn.closest("[data-id]");
            if (!itemEl) {
                return;
            }
            onDeleteTodo(Number(itemEl.dataset.id));
        });

        filterButtons.forEach((button) => {
            button.addEventListener("click", () => {
                onFilterChange(button.dataset.filter);
            });
        });
    }

    return {
        render,
        bindEvents,
    };
}