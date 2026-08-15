// Exercise 1
const select = document.querySelector("#lang");

const savedLang = localStorage.getItem("lang");
if (savedLang) select.value = savedLang;
// restore the saved choice the moment the page loads

select.addEventListener("change", () => {
    localStorage.setItem("lang", select.value);
    // save every time the user picks a different option
});

// Exercise 2

function save(key, arr) {
    localStorage.setItem(key, JSON.stringify(arr));
}

function load(key) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : [];
    } catch (err) {
        return []; // corrupt data - start fresh instead of crashing
    }
}