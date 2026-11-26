# Day 5: Weather Dashboard Code Review

## 1. Error Handling Audit
- **Missing HTTP status checks:** `fetch()` only rejects on network failure, not on `404` (city not found) or `429` (rate limit). Every API call should check `if (!response.ok)` and throw a descriptive error before calling `response.json()`.
- **Empty or whitespace input:** Submitting an empty search bar triggers a wasted API request. Guard with `const city = input.value.trim(); if (!city) return;`.
- **Missing loading & error UI states:** If the request hangs or fails, the user sees stale data with no feedback. Add a loading indicator during `fetch` and clear, user-friendly error messages in a dedicated status container.
- **Unprotected `localStorage` access:** Reading cached cities or units with `JSON.parse` without `try/catch` crashes initialization if storage data is corrupted.

## 2. Code Organization & Readability
- **Single-responsibility split:** Separate the dashboard into `weather-api.js` (network calls and response normalization), `weather-ui.js` (DOM updates), and `app.js` (event listeners and state).
- **Magic numbers & strings:** Extract API base URLs, default units (`metric`), and cache TTL durations into named constants at the top of the module.
- **Repeated DOM queries:** Cache frequently accessed elements (`searchForm`, `cityInput`, `forecastContainer`) once on load instead of calling `document.querySelector` inside render functions.

## 3. Prioritized Improvements List
1. Wrap all `fetch` calls in `try/catch` with `response.ok` validation and user-facing error banners.
2. Disable the search button and display a loading state while awaiting weather data.
3. Extract API fetching and data formatting into pure, testable functions separate from DOM rendering.
4. Persist the last searched city in `localStorage` with safe JSON helpers so the dashboard loads useful data immediately.