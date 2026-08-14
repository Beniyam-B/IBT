const PHONE = /^(?:\+251|0)9\d{8}$/;
const EMAIL =/^[^\s@]+@[^\s@]+\.[^\s@]+$/;


const form = document.querySelector("#signup");
const nameInput = document.querySelector("#name");
const phoneInput = document.querySelector("#phone");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const errorEl = document.querySelector("#error");
const countEl = document.querySelector("#count");

function loadSignups() {
    try {
        const raw = localStorage.getItem("signups");
        return raw ? JSON.parse(raw) : [];
    } catch (err) {
        return [];
    }
}

function saveSignups(signups) {
    localStorage.setItem("signups", JSON.stringify(signups));
}

function updateCount(signups) {
    countEl.textContent = `${signups.length} People Signed Up`;
}

function validate(name, phone ,email , password) {
    if (name.length < 2) return "Enter your full name.";

    if (!PHONE.test(phone)) return "Enter a valid Ethiopian phone number.";

    if (!EMAIL.test(email)) return "Enter a valid email address.";

    if (password.length < 8) return "Enter a password with at least 8 characters.";

    return "";
}

let signups = loadSignups();
updateCount(signups);

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const error = validate(name, phone, email, password);

    if (error) {
        errorEl.textContent = error;
        return;
    }

    errorEl.textContent = "";
    signups.push({ name, phone, email, password });
    saveSignups(signups);
    updateCount(signups);
    form.reset();
});
