export const VALID_FILTERS = ["all", "active", "completed"];

export function createTodoItem(text, id = Date.now(), createdAt = new Date().toISOString()) {
    const trimmedText = typeof text === "string" ? text.trim() : "";
    if (!trimmedText) {
        return null;
    }

    return {
        id,
        text: trimmedText,
        completed: false,
        createdAt,
    };
}

export function addTodo(todos, text, id = Date.now(), createdAt = new Date().toISOString()) {
    const newTodo = createTodoItem(text, id, createdAt);
    if (!newTodo) {
        return [...todos];
    }

    return [...todos, newTodo];
}

export function toggleTodo(todos, id) {
    return todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : { ...todo }
    );
}

export function deleteTodo(todos, id) {
    return todos.filter((todo) => todo.id !== id);
}

export function filterTodos(todos, filter = "all") {
    if (filter === "active") {
        return todos.filter((todo) => !todo.completed);
    }

    if (filter === "completed") {
        return todos.filter((todo) => todo.completed);
    }

    return [...todos];
}

export function countTodos(todos) {
    const total = todos.length;
    const completed = todos.filter((todo) => todo.completed).length;
    const active = total - completed;

    return {
        total,
        active,
        completed,
    };
}
