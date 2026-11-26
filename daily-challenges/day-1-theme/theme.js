const STORAGE_KEY = 'app_theme';
const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';

const toggleButton = document.getElementById('theme-toggle');

function getSavedTheme() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved === DARK_THEME ? DARK_THEME : LIGHT_THEME;
    } catch {
        return LIGHT_THEME;
    }
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (toggleButton) {
        toggleButton.textContent =
            theme === DARK_THEME ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    }
}

function saveTheme(theme) {
    try {
        localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
        console.error('Failed to save theme:', error);
    }
}

let currentTheme = getSavedTheme();
applyTheme(currentTheme);

if (toggleButton) {
    toggleButton.addEventListener('click', () => {
        currentTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
        applyTheme(currentTheme);
        saveTheme(currentTheme);
    });
}
