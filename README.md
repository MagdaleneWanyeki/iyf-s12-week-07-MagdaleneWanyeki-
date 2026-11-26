# Week 7: JavaScript Best Practices — Modular To-Do List & Shopping Cart

## Author
- **Name:** Magdalene Wanyeki
- **GitHub:** [@MagdaleneWanyeki](https://github.com/MagdaleneWanyeki)
- **Date:** November 26, 2026

## Project Description
A modular JavaScript To-Do List and Shopping Cart application refactored into single-responsibility ES Modules (`js/app.js`, `js/state.js`, `js/storage.js`, `js/todo-logic.js`, `js/ui.js`, and `js/utils.js`). The project applies clean-code principles by separating pure business logic from DOM manipulation and `localStorage` persistence, enforcing code quality with ESLint 9 and Prettier, verifying behavior with Vitest unit tests, and practicing real-world peer code review on GitHub.

## Technologies Used
- HTML5
- CSS3
- JavaScript (ES6+ Modules)
- Web Storage API (`localStorage` & `sessionStorage`)
- Node.js & npm
- Vitest (Unit Testing)
- ESLint 9 (Flat Config)
- Prettier (Code Formatting)
- Git & GitHub (Branching, Pull Requests, and Peer Code Review)

## Features
- **Modular ES6 Architecture:** Separated application entry (`app.js`), centralized state (`state.js`), defensive storage (`storage.js`), DOM rendering with event delegation (`ui.js`), and pure business/utility functions (`todo-logic.js`, `utils.js`).
- **Persistent To-Do List & Shopping Cart:** Automatically saves and restores tasks and cart items across page reloads with `try/catch` error guards against corrupted JSON or storage quota limits.
- **Pure & Immutable Logic:** All task creation, toggling, deletion, filtering, date formatting, ID generation, and debouncing functions avoid mutating input arrays and have zero DOM dependencies.
- **Automated Testing & Code Quality:** Includes Vitest unit tests (`npm test`), ESLint static analysis (`npm run lint`), and Prettier formatting (`npm run format`).

## Project Structure

```text
├── index.html
├── styles.css
├── js/
│   ├── app.js
│   ├── state.js
│   ├── storage.js
│   ├── todo-logic.js
│   ├── ui.js
│   └── utils.js
├── cart/
│   ├── index.html
│   └── cart.js
├── lesson-13/
│   ├── notes.html
│   ├── notes.js
│   ├── storage-helpers.js
│   ├── todo-persistent.js
│   └── into js/
│       ├── centralized-state.js
│       ├── session-form.html
│       ├── session-form.js
│       └── store.js
├── daily-challenges/
├── tests/
│   └── todo-logic.test.js
├── eslint.config.js
├── .prettierrc
├── package.json
└── README.md
```

## How to Run
1. Clone this repository.
2. Open `index.html` in your browser.

   OR

   Run `npm install` then `npm start`.
   `npm test`
   `npm run lint`
   
## Lessons Learned
- Splitting the To-Do app into `todo-logic.js`, `storage.js`, `state.js`, and `ui.js` made it much easier to test functions in Vitest without needing a browser DOM or mocking `localStorage`.
- Setting up ESLint 9 and Prettier caught small issues like unused variables and inconsistent formatting before committing.
- Reviewing a classmate's PR on GitHub taught me how to give specific line-by-line feedback using the review checklist and how to respond to review comments with clean follow-up commits.

## Challenges Faced
- **Accidental formatting diff on my PR branch:** When I ran `npm run format` on `refactor/modules`, Prettier modified almost every file in the repo, which hid my actual changes in `js/utils.js`. I fixed this by discarding the unintended changes with `git checkout -- .` so only `js/utils.js` showed up in the diff.
- **Typo and edge cases in `js/utils.js`:** I initially misnamed the file `js/utilis.js` and didn't check for invalid dates in `formatDate`. I renamed the file to `js/utils.js`, added a `Number.isNaN(parsed.getTime())` check so invalid dates return an empty string instead of `"Invalid Date"`, and wrapped `localStorage` calls in `try/catch` blocks inside `js/storage.js`.
  
## Collaboration

- **Team / partner:** [@gakuruclaire39-cmd](https://github.com/gakuruclaire39-cmd) — found on the Classroom board.
- **PR I opened:** https://github.com/MagdaleneWanyeki/iyf-s12-week-07-MagdaleneWanyeki-/pull/1
- **PR I reviewed:**  https://github.com/MagdaleneWanyeki/iyf-s12-week-07-MagdaleneWanyeki-/pull/1
- **Review I wrote**https://github.com/MagdaleneWanyeki/iyf-s12-week-07-MagdaleneWanyeki-/pull/1/changes#r4712490043
- 
## Live Demo (if deployed)
[View Live Demo](https://magdalenewanyeki.github.io/iyf-s12-week-07-MagdaleneWanyeki-/)
