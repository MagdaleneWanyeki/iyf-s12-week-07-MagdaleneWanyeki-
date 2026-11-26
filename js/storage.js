const STORAGE_PREFIX = "week7_todo_";

export function saveToStorage(key, value) {
    try {
        localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch {
        // Ignore storage quota or private-mode errors
    }
}

export function loadFromStorage(key, defaultValue = null) {
    try {
        const raw = localStorage.getItem(STORAGE_PREFIX + key);
        if (raw === null) {
            return defaultValue;
        }
        return JSON.parse(raw);
    } catch {
        return defaultValue;
    }
}

export function removeFromStorage(key) {
    try {
        localStorage.removeItem(STORAGE_PREFIX + key);
    } catch {
        // Ignore storage access errors
    }
}

export function loadTodos() {
    const saved = loadFromStorage("todos", []);
    return Array.isArray(saved) ? saved : [];
}

export function saveTodos(todos) {
    saveToStorage("todos", todos);
}

export function loadFilter() {
    const saved = loadFromStorage("filter", "all");
    if (saved === "active" || saved === "completed" || saved === "all") {
        return saved;
    }
    return "all";
}

export function saveFilter(filter) {
    saveToStorage("filter", filter);
}
