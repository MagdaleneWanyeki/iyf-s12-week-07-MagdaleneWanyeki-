const STORAGE_KEY = 'autosave_form_draft';
const AUTOSAVE_INTERVAL_MS = 5000;

const form = document.getElementById('autosave-form');
const indicator = document.getElementById('save-indicator');

function readFormValues() {
    const formData = new FormData(form);
    return Object.fromEntries(formData.entries());
}

function saveDraft() {
    try {
        const values = readFormValues();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
        indicator.textContent = `Draft saved at ${new Date().toLocaleTimeString()}`;
    } catch (error) {
        console.error('Failed to auto-save draft:', error);
    }
}

function restoreDraft() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return;
        }

        const saved = JSON.parse(raw);
        Object.entries(saved).forEach(([name, value]) => {
            const field = form.elements.namedItem(name);
            if (field) {
                field.value = value;
            }
        });
        indicator.textContent = 'Restored saved draft';
    } catch {
        localStorage.removeItem(STORAGE_KEY);
    }
}

function clearDraft() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Failed to clear draft:', error);
    }
}

restoreDraft();

const intervalId = setInterval(saveDraft, AUTOSAVE_INTERVAL_MS);

form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearDraft();
    form.reset();
    indicator.textContent = 'Submitted and draft cleared';
});

window.addEventListener('beforeunload', () => {
    clearInterval(intervalId);
});