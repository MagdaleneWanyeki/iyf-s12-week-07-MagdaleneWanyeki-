import { loadFilter, loadTodos, saveFilter, saveTodos } from "./storage.js";
import {
    addTodo as addTodoPure,
    countTodos,
    deleteTodo as deleteTodoPure,
    filterTodos,
    toggleTodo as toggleTodoPure,
    VALID_FILTERS,
} from "./todo-logic.js";

const state = {
    todos: [],
    filter: "all",
};

const listeners = new Set();

function notify() {
    const snapshot = getState();
    listeners.forEach((listener) => listener(snapshot));
}

export function getState() {
    const visibleTodos = filterTodos(state.todos, state.filter);
    const counts = countTodos(state.todos);

    return {
        todos: [...state.todos],
        visibleTodos,
        filter: state.filter,
        counts,
    };
}

export function subscribe(listener) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

export function initState() {
    state.todos = loadTodos();
    state.filter = loadFilter();
    notify();
}

export function addTodoAction(text) {
    const nextTodos = addTodoPure(state.todos, text);
    if (nextTodos.length === state.todos.length) {
        return;
    }
    state.todos = nextTodos;
    saveTodos(state.todos);
    notify();
}

export function toggleTodoAction(id) {
    state.todos = toggleTodoPure(state.todos, id);
    saveTodos(state.todos);
    notify();
}

export function deleteTodoAction(id) {
    state.todos = deleteTodoPure(state.todos, id);
    saveTodos(state.todos);
    notify();
}

export function setFilterAction(filter) {
    if (!VALID_FILTERS.includes(filter)) {
        return;
    }
    state.filter = filter;
    saveFilter(state.filter);
    notify();
}
