const form = document.getElementById("contact-form");
const statusEl = document.getElementById("form-status");
const inputs = form.querySelectorAll("input, textarea");

function getFieldKey(name) {
    return `form_${name}`;
}

inputs.forEach((input) => {
    if (!input.name) {
        return;
    }

    const storageKey = getFieldKey(input.name);
    const saved = sessionStorage.getItem(storageKey);
    if (saved !== null) {
        input.value = saved;
    }

    input.addEventListener("input", () => {
        sessionStorage.setItem(storageKey, input.value);
        statusEl.textContent = "Draft saved for this tab session.";
    });
});

form.addEventListener("submit", (event) => {
    event.preventDefault();

    inputs.forEach((input) => {
        if (input.name) {
            sessionStorage.removeItem(getFieldKey(input.name));
        }
    });

    form.reset();
    statusEl.textContent = "Submitted and cleared session draft.";
});