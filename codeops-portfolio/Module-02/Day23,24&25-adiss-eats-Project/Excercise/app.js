// Cache DOM element references for later updates
const menuEl = document.querySelector("#menu"); // container for dish cards
const cartEl = document.querySelector("#cart"); // sidebar cart element
const searchEl = document.querySelector("#search"); // search input

// Application state object that holds menu data, cart items and UI filter
const state = {
    dishes: [],   // populated from `data/menu.json` by `loadMenu()`
    cart: [],     // array of cart lines: { id, name, price, qty }
    search: "",  // current search/filter text (lowercased when used)
};

// Render the visible menu based on `state.dishes` and `state.search`
function render() {
    // Prepare the search term for case-insensitive matching
    const term = state.search.toLowerCase();

    // Filter dishes whose name includes the search term
    const shown = state.dishes.filter(d =>
        d.name.toLowerCase().includes(term)
    );

    // If no results, show an empty state message
    if (shown.length === 0) {
        menuEl.innerHTML = `<p class="empty">No dishes found.</p>`;
    } else {
        // Map each dish to its HTML card. `join("")` concatenates the array
        // into a single string to assign to innerHTML efficiently.
        menuEl.innerHTML = shown.map(d => `
    <article class="dish" data-id="${d.id}">
        ${d.spicy ? '<span class="badge">Spicy</span>' : ''}
        <img src="${d.image}" alt="${d.name}">
        <h3>${d.name}</h3>
        <p class="category">${d.category}</p>
        <p class="desc">${d.desc}</p>
        <p class="price">${d.price} ETB</p>
        <button class="add">Order</button>
    </article>`).join("");
    }

    // Re-render the cart area after updating the menu (keeps totals in sync)
    renderCart();
}

// Render the cart sidebar: list items and total price
function renderCart() {
    // Empty cart state: show a friendly message
    if (state.cart.length === 0) {
        cartEl.innerHTML = `
    <h2>Your Order</h2>
    <p class="empty">Cart is empty.</p>`;
        return;
    }

    // For each cart line create an <li> showing name, qty and line total
    const items = state.cart.map(i => `
    <li data-id="${i.id}">
    <span>${i.name} x${i.qty}</span>
      <span>${i.price * i.qty} ETB</span>
    <button class="rm">X</button>
    </li>`).join("");

    // Render the cart with items and computed total
    cartEl.innerHTML = `
    <h2>Your Order</h2>
    <ul>${items}</ul>
    <p class="total">Total: ${cartTotal()} ETB</p>`;
}

// Compute the cart total by summing line price * qty
function cartTotal() {
    return state.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}

// Persist only the cart lines to localStorage so the user's order survives reloads
function save() {
    localStorage.setItem("addiseats", JSON.stringify(state.cart));
}

// Load persisted cart from localStorage (if present)
function load() {
    const s = localStorage.getItem("addiseats");
    if (s) state.cart = JSON.parse(s);
}

// Fetch menu JSON and populate `state.dishes`. Shows basic loading/error UI.
async function loadMenu() {
    menuEl.textContent = "Loading menu…";
    try {
        const res = await fetch("data/menu.json");
        // If HTTP status not OK, throw to be caught below
        if (!res.ok) throw new Error("HTTP " + res.status);
        // Parse JSON body into state.dishes
        state.dishes = await res.json();
        // render the UI with the loaded menu
        render();
    } catch (err) {
        // Minimal error handling: show a failure message in the menu area
        menuEl.textContent = "Could not load the menu.";
    }
}

// Wire up search input: update filter text and re-render on each keystroke
searchEl.addEventListener("input", (e) => {
    state.search = e.target.value;
    render();
});

// Event delegation on the menu: handle clicks on any "order" button
menuEl.addEventListener("click", (e) => {
    // Only proceed if the clicked element matches the `.add` selector
    if (!e.target.matches(".add")) return;

    // Find the dish id from the closest ancestor `.dish` element
    const id = Number(e.target.closest(".dish").dataset.id);
    // Lookup the dish data and any existing cart line
    const dish = state.dishes.find(d => d.id === id);
    const line = state.cart.find(i => i.id === id);

    if (line) {
        // If already in cart, increment quantity
        line.qty++;
    } else {
        // Otherwise clone dish properties into a new cart line with qty:1
        state.cart.push({ ...dish, qty: 1 });
    }

    // Persist and refresh UI
    save();
    render();
});

// Event delegation in the cart: handle remove button clicks
cartEl.addEventListener("click", (e) => {
    if (!e.target.matches(".rm")) return;
    // Remove the matching cart line by id
    const id = Number(e.target.closest("li").dataset.id);
    state.cart = state.cart.filter(i => i.id !== id);
    save();
    render();
});

// Initialize the app: restore cart from storage, then load menu data
async function init() {
    load();
    await loadMenu();
}

init();
