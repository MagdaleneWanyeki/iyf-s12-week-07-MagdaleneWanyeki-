const APP_STATE_KEY = "appState";

const state = {
    todos: [],
    filter: "all",
    theme: "light",
};

function saveState() {
    localStorage.setItem(APP_STATE_KEY, JSON.stringify(state));
}

function loadState() {
    const saved = localStorage.getItem(APP_STATE_KEY);
    if (!saved) {
        return;
    }

    try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
            Object.assign(state, parsed);
        }
    } catch {
        // Ignore corrupted stored state and keep defaults
    }
}

function setState(updates, renderFn = () => {}) {
    Object.assign(state, updates);
    saveState();
    renderFn(state);
}

function setFilter(filter, renderFn) {
    setState({ filter }, renderFn);
}

function setTheme(theme, renderFn) {
    setState({ theme }, renderFn);
}

function addTodo(text, renderFn) {
    const trimmed = text.trim();
    if (!trimmed) {
        return;
    }

    const nextTodos = [
        ...state.todos,
        { id: Date.now(), text: trimmed, completed: false },
    ];
    setState({ todos: nextTodos }, renderFn);
}

function toggleTodo(id, renderFn) {
    const nextTodos = state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setState({ todos: nextTodos }, renderFn);
}

export { state, loadState, saveState, setState, setFilter, setTheme, addTodo, toggleTodo };