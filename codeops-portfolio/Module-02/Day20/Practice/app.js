// 1. USD→ETB rate

async function getEtbRate() {
    const res = await fetch("https://api.exchangerate.host/latest?base=USD");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    return data.rates.ETB;
}

// 2. .then chain rewritten as async/await

async function loadMenu() {
try {
    const res = await fetch("/api/menu");
    const data = await res.json();
    render(data);
} catch (err) {
    console.error(err);
}
}

// 3. Wrong URL vs a real 404

async function testWrongUrl() {
try {
    const res = await fetch("https://this-domain-does-not-exist-xyz.fake");
    console.log(res.status);
} catch (err) {
    console.log("catch ran - network error:", err.message);
}
}

async function test404() {
    const res = await fetch("https://restcountries.com/v3.1/name/notarealcountry123");
  console.log(res.ok, res.status); // false, 404 - no throw happened
}

// 4. Promise.all for first two items in parallel

async function getFirstTwoDetails() {
    const listRes = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2");
    const list = await listRes.json();

    const [first, second] = await Promise.all([
    fetch(`https://restcountries.com/v3.1/alpha/${list[0].cca2}`),
    fetch(`https://restcountries.com/v3.1/alpha/${list[1].cca2}`),
]);

return [await first.json(), await second.json()];
}

// 5. Tiny page showing all three states

const list = document.querySelector("#list");

async function load() {
list.innerHTML = "Loading...";
try {
    const res = await fetch("https://restcountries.com/v3.1/name/ethiopia");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const [data] = await res.json();
    list.innerHTML = "";
    const li = document.createElement("li");
    li.textContent = data.capital[0];
    list.append(li);
} catch (err) {
    list.innerHTML = "Could not load data.";
}
}
load();