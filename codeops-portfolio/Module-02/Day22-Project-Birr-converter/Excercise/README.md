# Birr Watch

A single-page app that shows live exchange rates for the Ethiopian Birr. Pick a
currency and an amount, see the converted value, and save currencies to a
watchlist that survives a page reload.

Day 22 project — CodeOps Module 2, Week 3.

## What it does

- Loads live ETB exchange rates on startup, with loading and error states
- Converts an amount from a chosen currency into ETB
- Validates the amount (rejects empty, zero, negative, or non-numeric input)
- Lets you add currencies to a watchlist (no duplicates) and remove them
- Saves the watchlist and last-used currency to `localStorage` so they
  survive a reload

## API used

[open.er-api.com](https://open.er-api.com) — a free, no-key exchange-rate API.

```
GET https://open.er-api.com/v6/latest/ETB
```

Base currency is ETB, so each rate returned is "how much 1 Birr is worth in
that currency."

## How to run

Open `index.html` in a browser. No build step, no dependencies.

## Files

| File         | Purpose                                             |
|--------------|------------------------------------------------------|
| `index.html` | Structure: status, convert form, result, watchlist  |
| `styles.css` | Layout plus loading / error / empty styles          |
| `app.js`     | State, `loadRates`, `render`, convert, watchlist, save/load |

## Architecture

One state object is the source of truth:

```js
const state = {
  base: "ETB",
  rates: {},
  watchlist: [],
  currency: "USD",
};
```

Every user action (convert, add, remove) follows the same loop: edit
`state`, persist it with `save()`, then call `render()` to redraw the page.
The DOM is never the source of truth — it's just a picture of `state`.
