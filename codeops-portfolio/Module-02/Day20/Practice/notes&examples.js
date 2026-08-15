// Synchronous: runs in order, now. Blocks until done. Used for math, string work. Result comes back immediately. Simple to reason about.

// Asynchronous: finishes later. Frees the thread to continue. Used for fetch, timers, files. Result comes back via callback or promise. Needs then/await.

// What counts as slow (async): network requests (fetch), timers (setTimeout), reading files, user-driven events. Everything else is synchronous.


Example:
console.log("1 - take order");
setTimeout(() => {
console.log("3 - food is ready");
}, 2000);
console.log("2 - serve next customer");
// prints: 1, 2, then 3             its order is obviously skewed if it was syncronious it would have gone 1, 3, 2


// Callbacks - the first approach: A callback is a function you hand to a slow task. When the work finishes, the task calls your function with the result.

function getOrder(id, callback) {
    setTimeout(() => {
    callback({ id, total: 240 });
}, 1000);
}
getOrder(7, (order) => {
    console.log(order.total);
});


// Callback hell: nesting callbacks inside callbacks inside callbacks quickly becomes unreadable. Promises were invented to fix exactly this. addEventListener also takes a callback - the pattern is foundational and still everywhere.

// The event loop, briefly:
// 1. Call stack - runs sync code now
// 2. Web APIs - timers and fetch run here
// 3. Queue - finished callbacks wait
// 4. Event loop - pushes them back in when the stack is free

// JavaScript has a single call stack, so it does one thing at a time. Slow tasks are handed to the browser, which runs them aside. When they finish and the stack is empty, the event loop puts their callbacks back in to run. That is how one thread stays responsive. You do not write the event loop yourself, but knowing it exists explains unexpected console.log ordering and why await never truly blocks the page.

// Why this matters for the UI:
// If JavaScript stopped to wait for every slow request, buttons would not click and scrolling would stutter while data loaded. Async keeps the page alive while it waits. The pattern: show a "Loading..." message, fetch in the background, then swap in the results - the page never locks up.


// Mental shift: with async you do not get the value right away, you get a promise of a value.

// A promise is an object that stands for a value you will have later. It starts pending, then either resolves with a result or rejects with an error - and you say what to do in each case.

// Three states:
//  Pending - work not finished yet
//  Resolved/fulfilled - succeeded, has a value
//  Rejected - failed, has an error

// Once a promise settles it never changes again.


const order = new Promise((resolve, reject) => {
    const ok = true;
    if (ok) resolve({ id: 7, total: 240 });
    else reject(new Error("kitchen closed"));
});

// then, catch & finally:
// You do not read a promise's value directly, you register callbacks.
//  .then() runs when the promise resolves and receives the value
//  .catch() runs if anything rejects
//  .finally() runs either way - good for hiding a loading spinner

getOrder(7)
    .then(order => {
    console.log(order.total);
})
    .catch(err => {
    console.log(err.message);
})
    .finally(() => {
    hideSpinner();
});


// Always handle catch.

// Chaining promises: Each .then can return a new promise (or plain value), and the next .then receives it. This flattens the old nested-callback pyramid into a readable top-to-bottom chain. A single .catch at the end of the chain catches a rejection from any step above it.

getUser(1)
    .then(user => getOrders(user.id))
    .then(orders => orders[0])
    .then(first => console.log(first.total))
    .catch(err => console.log("failed:", err));


// Promise.all - in parallel: Promise.all takes an array of promises and resolves once every one finishes, giving all the results together. Use it when requests do not depend on each other - they run side by side, so three independent fetches finish in the time of the slowest, not the sum of all three.

Promise.all([
    fetch("/api/menu"),
    fetch("/api/specials"),
    fetch("/api/hours"),
]).then(([menu, specials, hours]) => {
  // all three are ready here
});

// If any one promise rejects, Promise.all rejects. Use allSettled to tolerate individual failures.

// async/await is syntax built on promises that lets asynchronous code read like ordinary top-to-bottom code. It is the style used almost all the time - clear and easy to debug.

async function showOrder(id) {
    const order = await getOrder(id);
    console.log(order.total);
    return order;
}

// await unwraps a promise into its value, and the line after it waits for that value - but only inside the function, not the whole page. Two rules: await only works inside an async function, and an async function always hands back a promise, so callers can await it or use .then.

// Error handling with try/catch:
// With await there is no .catch - instead wrap the risky work in try/catch, exactly as for any sync error. A rejected promise throws into catch.

async function loadMenu() {
    try {
    const res = await fetch("/api/menu");
    const data = await res.json();
    render(data);
} catch (err) {
    showError("Could not load the menu");
} finally {
    hideSpinner();
}
}
// Networks fail, servers error. An unhandled rejection can break the page silently, so wrap awaits that can fail in try/catch every time.

// Sequencing vs parallel: Await one after another only when a step needs the previous result. When requests are independent, await a Promise.all so they run at once - a frequent performance bug is awaiting independent fetches one by one (three 1-second calls take 3s sequentially but around 1s in parallel).

// SEQUENTIAL - each waits for the last
const user = await getUser(1);
const orders = await getOrders(user.id);
// needed: orders depends on user

// PARALLEL - independent, so run together
const [menu, hours] = await Promise.all([
    fetch("/api/menu"),
    fetch("/api/hours"),
]);

// FETCH & APIS
// An API is a URL that returns data, usually JSON. fetch is the browser's built-in way to request it.
// A web API is an address you request to get data back - weather, exchange rates, a product list. Instead of HTML it usually returns JSON: the same key-value shape as a JS object, as text.A web API is an address you request to get data back - weather, exchange rates, a product list. Instead of HTML it usually returns JSON: the same key-value shape as a JS object, as text.

// GET /api/dishes returns JSON like:
[
    { "id": 1, "name": "Doro Wat", "price": 240 },
    { "id": 2, "name": "Tibs", "price": 200 },
    { "id": 3, "name": "Shiro", "price": 120 }
]

// JSON.parse(text) converts text into an object. JSON.stringify(obj) converts an object into text. res.json() does the parsing step for you.

// fetch with async/await:
// First await the response (the connection), then await res.json() to read and parse the body - both steps take time, so both are awaited.

async function getDishes() {
    const res = await fetch("/api/dishes");
  // fetch does NOT reject on 404 / 500
    if (!res.ok) {
    throw new Error("HTTP " + res.status);
}
    const dishes = await res.json();
    return dishes;
}

// Check res.ok: fetch only rejects on a network failure - not on a 404 or 500. The request "succeeded" in reaching the server. Always check res.ok (or res.status) and throw yourself, or you will parse an error page as if it were data.

// Fetch + render the page (full loop):
// Show "Loading...", fetch the data, then render it with the create-and-append DOM pattern from Day 19. On failure, show a friendly message instead of a blank page.

const list = document.querySelector("#dishes");

async function load() {
    list.innerHTML = "Loading...";
    try {
    const dishes = await getDishes();
    list.innerHTML = "";
    dishes.forEach(d => {
        const li = document.createElement("li");
        li.textContent = d.name + " - " + d.price + " ETB";
        list.append(li);
    });
} catch (err) {
    list.innerHTML = "Could not load dishes.";
}
}
load();
