const NOTES_KEY = "lesson13_notes";

function saveNotes(notes) {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

function loadNotes() {
    const raw = localStorage.getItem(NOTES_KEY);
    if (!raw) {
        return [];
    }

    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

let notes = loadNotes();

const form = document.getElementById("note-form");
const input = document.getElementById("note-input");
const list = document.getElementById("notes-list");

function renderNotes() {
    list.innerHTML = "";

    notes.forEach((note) => {
        const li = document.createElement("li");
        li.dataset.id = String(note.id);

        const textSpan = document.createElement("span");
        textSpan.textContent = note.text;

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.textContent = "Delete";

        li.append(textSpan, " ", deleteBtn);
        list.appendChild(li);
    });
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) {
        return;
    }

    notes = [
        ...notes,
        {
            id: Date.now(),
            text,
            updatedAt: new Date().toISOString(),
        },
    ];
    saveNotes(notes);
    renderNotes();
    input.value = "";
    input.focus();
});

list.addEventListener("click", (event) => {
    if (event.target.tagName !== "BUTTON") {
        return;
    }

    const item = event.target.closest("li");
    if (!item) {
        return;
    }

    const id = Number(item.dataset.id);
    notes = notes.filter((note) => note.id !== id);
    saveNotes(notes);
    renderNotes();
});

renderNotes();