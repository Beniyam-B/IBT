const out = document.querySelector("#facts");
const form = document.querySelector("#search-form");
const input = document.querySelector("#search-input");

function render(container, label, value) {
    const p = document.createElement("p");
    p.className = "fact";
    const strong = document.createElement("strong");
    strong.textContent = label + ":";
    p.append(strong, " " + value);
    container.append(p);
}

async function showCountry(name) {
out.innerHTML = "";
const loading = document.createElement("p");
loading.className = "loading";
loading.textContent = "Loading...";
out.append(loading);

try {
    const res = await 
    fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(name)}`);
    if (!res.ok) throw new Error("Country not found");
    const [c] = await res.json();

    out.innerHTML = "";
    render(out, "Capital", c.capital ? c.capital[0] : "N/A");
    render(out, "Population", c.population.toLocaleString());
    render(out, "Region", c.region);

    let currencyNames = "N/A";
    if (c.currencies) {
    const names = [];
    for (const key in c.currencies) {
        names.push(c.currencies[key].name);
    }
    currencyNames = names.join(", ");
    }
    render(out, "Currencies", currencyNames);

    const flag = document.createElement("img");
    flag.className = "flag";
    flag.src = c.flags.png;
    flag.alt = "Flag of " + c.name.common;
    out.append(flag);

} catch (err) {
    out.innerHTML = "";
    const errMsg = document.createElement("p");
    errMsg.className = "error";
    errMsg.textContent = err.message;
    out.append(errMsg);
}
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (value) showCountry(value);
});

showCountry("ethiopia"); // default on load