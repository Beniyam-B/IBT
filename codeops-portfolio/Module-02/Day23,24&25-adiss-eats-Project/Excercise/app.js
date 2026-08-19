// Cache DOM element references for later updates
const menuEl = document.querySelector("#menu"); // container for dish cards
const cartEl = document.querySelector("#cart"); // sidebar cart element
const searchEl = document.querySelector("#search"); // search input
const checkoutEl = document.querySelector("#checkout");
const nameEl = document.querySelector("#name");
const phoneEl = document.querySelector("#phone");
const areaEl = document.querySelector("#area");
const errEl = document.querySelector("#form-error");
const confirmEl = document.querySelector("#confirmation");

const STORAGE_KEY = "addiseats";
const PHONE = /^(?:\+251|0)9\d{8}$/;

// Application state object that holds menu data, cart items and UI filter
const state = {
    dishes: [],   // populated from `data/menu.json` by `loadMenu()`
    cart: [],     // array of cart lines: { id, name, price, qty }
    search: "",  // current search/filter text (lowercased when used)
};

// Render the visible menu based on `state.dishes` and `state.search`

function render() {
  renderMenu();
  renderCart();
}

function renderMenu() {
  const term = state.search.toLowerCase();
  const shown = state.dishes.filter(d =>
    d.name.toLowerCase().includes(term));

  if (shown.length === 0) {
    menuEl.innerHTML = `<p class="empty">No dishes found.</p>`;
  } else {
    menuEl.innerHTML = shown.map(d => `
      <article class="dish" data-id="${d.id}">
        ${d.spicy ? '<span class="badge">Spicy</span>' : ''}
        <img src="${d.image}" alt="${d.name}">
        <h3>${d.name}</h3>
        <p class="category">${d.category}</p>
        <p class="desc">${d.desc}</p>
        <p class="price">${d.price} ETB</p>
        <button class="add">Add</button>
      </article>`).join("");
  }
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cart));
}

function load() {
  const s = localStorage.getItem(STORAGE_KEY);
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

menuEl.addEventListener("click", (e) => {
  if (!e.target.matches(".add")) return;
  const id = Number(e.target.closest(".dish").dataset.id);
  const dish = state.dishes.find(d => d.id === id);
  if (!dish) return;               // guard: dish not found, do nothing
  const line = state.cart.find(i => i.id === id);
  if (line) {
    line.qty++;
  } else {
    state.cart.push({ ...dish, qty: 1 });
  }
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
function validate({ name, phone }) {
  if (!name.trim()) return "Please enter your name.";
  if (!PHONE.test(phone)) return "Enter a valid Ethiopian phone.";
  if (state.cart.length === 0) return "Your cart is empty.";
  return "";
}

function placeOrder(data) {
  const order = {
    ...data,
    items: state.cart,
    total: cartTotal(),
    placedAt: new Date().toISOString(),
  };
  console.log("Order placed:", order);
  state.cart = [];
  save();
  render();
  showConfirmation(order);
}

function showConfirmation(order) {
  confirmEl.textContent =
    `Order placed — ${order.total} ETB, delivering to ${order.area}.`;
  confirmEl.hidden = false;
}

checkoutEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = { name: nameEl.value, phone: phoneEl.value, area: areaEl.value };
  const msg = validate(data);
  errEl.textContent = msg;
  confirmEl.hidden = true;
  if (msg) return;
  placeOrder(data);
  checkoutEl.reset();
});

// Initialize the app: restore cart from storage, then load menu data
async function init() {
    load();
    await loadMenu();
}

init();
