const STORAGE_KEY = 'recent_searches';
const MAX_HISTORY = 5;

const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const dropdown = document.getElementById('history-dropdown');
const statusText = document.getElementById('search-status');

function loadHistory() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveHistory(history) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
        console.error('Failed to save search history:', error);
    }
}

function addSearchTerm(term) {
    const trimmed = term.trim();
    if (!trimmed) {
        return;
    }

    const filtered = loadHistory().filter(
        (item) => item.toLowerCase() !== trimmed.toLowerCase()
    );
    const updated = [trimmed, ...filtered].slice(0, MAX_HISTORY);
    saveHistory(updated);
}

function renderDropdown() {
    const history = loadHistory();
    dropdown.innerHTML = '';

    if (history.length === 0) {
        dropdown.classList.remove('visible');
        return;
    }

    history.forEach((term) => {
        const li = document.createElement('li');
        li.textContent = term;
        li.dataset.term = term;
        dropdown.appendChild(li);
    });

    dropdown.classList.add('visible');
}

function executeSearch(term) {
    const trimmed = term.trim();
    if (!trimmed) {
        return;
    }

    input.value = trimmed;
    addSearchTerm(trimmed);
    statusText.textContent = `Showing results for: "${trimmed}"`;
    dropdown.classList.remove('visible');
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    executeSearch(input.value);
});

input.addEventListener('focus', renderDropdown);

dropdown.addEventListener('click', (event) => {
    const item = event.target.closest('li');
    if (item && item.dataset.term) {
        executeSearch(item.dataset.term);
    }
});

document.addEventListener('click', (event) => {
    if (!event.target.closest('.search-wrapper')) {
        dropdown.classList.remove('visible');
    }
});