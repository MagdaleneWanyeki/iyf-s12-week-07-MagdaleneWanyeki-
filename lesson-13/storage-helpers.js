export function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

export function getFromStorage(key, defaultValue = null) {
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

export function removeFromStorage(key) {
    localStorage.removeItem(key);
}