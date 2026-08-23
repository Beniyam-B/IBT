// Adiss Eats app: loads dishes, filters them, lets users add items to cart,
// validates checkout, then saves the cart in localStorage for the next visit.

// Cache DOM references so we can update the page without re-querying the DOM.
const menuEl = document.querySelector("#menu"); // dish card list
const cartEl = document.querySelector("#cart"); // cart sidebar
const searchEl = document.querySelector("#search"); // search field
const checkoutEl = document.querySelector("#checkout"); // checkout form
const nameEl = document.querySelector("#name"); // customer name
const phoneEl = document.querySelector("#phone"); // customer phone
const areaEl = document.querySelector("#area"); // delivery area
const errEl = document.querySelector("#form-error"); // validation message
const confirmEl = document.querySelector("#confirmation"); // success message

const STORAGE_KEY = "addiseats"; // localStorage key for saved cart
const PHONE = /^(?:\+251|0)9\d{8}$/; // valid Ethiopian mobile pattern

// App state holds the menu, current cart, and active search filter.
const state = {
    dishes: [],   // menu items from data/menu.json
    cart: [],     // items in the order: { id, name, price, qty }
    search: "",  // user text typed in the search box
};

// Re-render both sections whenever data changes.
function render() {
  renderMenu();
  renderCart();
}

// Filter the menu by name and print cards for matching dishes.
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
        <button class="add">Add to cart</button>
      </article>`).join("");
  }
}

// Render the cart sidebar and compute the running total.
function renderCart() {
    // Empty cart state: show a friendly message.
    if (state.cart.length === 0) {
        cartEl.innerHTML = `
    <h2>Your Order</h2>
    <p class="empty">Cart is empty.</p>`;
        return;
    }

    // Make one LI per cart item so the user can see item quantity and price.
    const items = state.cart.map(i => `
    <li data-id="${i.id}">
    <span>${i.name} x${i.qty}</span>
      <span>${i.price * i.qty} ETB</span>
    <button class="rm"><i class="fa-solid fa-trash"></i></button>
    </li>`).join("");

    // Insert the item list and the final total into the sidebar.
    cartEl.innerHTML = `
    <h2>Your Order</h2>
    <ul>${items}</ul>
    <p class="total">Total: ${cartTotal()} ETB</p>`;
}

// Sum all item prices to get the order total.
function cartTotal() {
    return state.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}

// Save the current cart to browser storage so it survives refreshes.
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cart));
}

// Restore any saved cart when the page opens.
function load() {
  const s = localStorage.getItem(STORAGE_KEY);
  if (s) state.cart = JSON.parse(s);
}

// Fetch menu.json and store the dishes in state before rendering them.
async function loadMenu() {
    menuEl.textContent = "Loading menu…";
    try {
        const res = await fetch("data/menu.json");
        if (!res.ok) throw new Error("HTTP " + res.status);
        state.dishes = await res.json();
        render();
    } catch (err) {
        menuEl.textContent = "Could not load the menu.";
    }
}

// Search field updates the filter text as the user types.
searchEl.addEventListener("input", (e) => {
    state.search = e.target.value;
    render();
});

// Add a dish when the user clicks its Add button.
menuEl.addEventListener("click", (e) => {
  if (!e.target.matches(".add")) return;
  const id = Number(e.target.closest(".dish").dataset.id);
  const dish = state.dishes.find(d => d.id === id);
  if (!dish) return;
  const line = state.cart.find(i => i.id === id);
  if (line) {
    line.qty++;
  } else {
    state.cart.push({ ...dish, qty: 1 });
  }
  save();
  render();
});

// Remove a cart item when the X button inside the cart is clicked.
cartEl.addEventListener("click", (e) => {
    if (!e.target.matches(".rm")) return;
    const id = Number(e.target.closest("li").dataset.id);
    state.cart = state.cart.filter(i => i.id !== id);
    save();
    render();
});

// Basic validation for the checkout form.
function validate({ name, phone }) {
  if (!name.trim()) return "Please enter your name.";
  if (!PHONE.test(phone)) return "Enter a valid Ethiopian phone.";
  if (state.cart.length === 0) return "Your cart is empty.";
  return "";
}

// Build a final order object, clear the cart, and show a confirmation message.
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

// Show a success message after placing the order.
function showConfirmation(order) {
  confirmEl.textContent =
    `Order placed — ${order.total} ETB, delivering to ${order.area}.`;
  confirmEl.hidden = false;
}

// Handle the form submit: validate, place order, then reset the inputs.
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

// Start the app by restoring saved data and loading the menu.
async function init() {
    load();
    await loadMenu();
}

init();
