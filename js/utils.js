const DEFAULT_DEBOUNCE_MS = 300;

export function formatDate(date) {
    if (!date) {
        return "";
    }

    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) {
        return "";
    }

    return parsed.toLocaleDateString();
}

export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function debounce(func, wait = DEFAULT_DEBOUNCE_MS) {
    let timeout;
    return function debounced(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, wait);
    };
}
