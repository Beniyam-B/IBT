const PHONE = /^(?:\+251|0)9\d{8}$/;
// accepts either 0 or +251 as the prefix, then 9 and eight more digits -
// exactly the shape of an Ethiopian mobile number

const form = document.querySelector("#signup");
const nameInput = document.querySelector("#name");
const phoneInput = document.querySelector("#phone");
const errorEl = document.querySelector("#error");
const countEl = document.querySelector("#count");

function loadSignups() {
    try {
        const raw = localStorage.getItem("signups");
        return raw ? JSON.parse(raw) : [];
    } catch (err) {
        return []; // corrupt data - start fresh instead of crashing
    }
}

function saveSignups(signups) {
    localStorage.setItem("signups", JSON.stringify(signups));
}

function updateCount(signups) {
    countEl.textContent = signups.length + " people signed up";
}

function validate(name, phone) {
    if (name.length < 2) return "Enter your full name.";
    if (!PHONE.test(phone)) return "Enter a valid Ethiopian phone number.";
    return ""; // "" means all good
}

let signups = loadSignups();
updateCount(signups);
// restore the saved count as soon as the page loads, before any submit happens

form.addEventListener("submit", (e) => {
    e.preventDefault(); // stop the reload so the array in memory survives
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();

    const error = validate(name, phone);
    if (error) {
        errorEl.textContent = error; // textContent, never innerHTML
        return;
    }

    errorEl.textContent = "";
    signups.push({ name, phone });
    saveSignups(signups);
    updateCount(signups);
    form.reset();
});