const form = document.querySelector("#add-form");
const name = document.querySelector("#name");
const price = document.querySelector("#price");
const list = document.querySelector("#list");
const totalEl = document.querySelector("#total");

function updateTotal() {
    let total = 0;
    document.querySelectorAll("#list li").forEach(li => {
    total += Number(li.dataset.price);
    });
    totalEl.textContent = "Total: " + total + " ETB";
}

function addRow(itemName, itemPrice) {
    const li = document.createElement("li");
    li.textContent = itemName + " - " + itemPrice + " ETB ";
    li.dataset.price = itemPrice;

    const delBtn = document.createElement("button");
    delBtn.textContent = "x";
    delBtn.className = "del";
    li.append(delBtn);

    list.append(li);
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const n = name.value.trim();
    const p = Number(price.value);
    if (!n || !p) return;
    addRow(n, p);
    form.reset();
    updateTotal();
});

list.addEventListener("click", (e) => {
    if (e.target.matches(".del")) {
    e.target.closest("li").remove();
    updateTotal();
    } else if (e.target.matches("li")) {
    e.target.classList.toggle("bought");
    }
});
