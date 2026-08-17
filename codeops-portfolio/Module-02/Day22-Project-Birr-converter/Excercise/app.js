const API = "https://open.er-api.com/v6/latest/ETB";
const KEY = "birrwatch";

const state = {
    base : "ETB",
    rates:{},
    watchlist:[],
    currency:"USD",

};

const status = document.querySelector("#status");
const form = document.querySelector("#converter-form");
const amount = document.querySelector("#amount");
const select = document.querySelector("#currency");
const result = document.querySelector("#result");
const addBtn = document.querySelector("#watch");
const watchul = document.querySelector("#watchlist");

function render(){
    const codes = Object.keys(state.rates);
    select.innerHTML = codes.map(c => `<option value="${c}">${c}</option>`).join("");
    select.value = state.currency;

    renderWatchlist();
}

function renderWatchlist(){
    if (state.watchlist.length === 0){
        watchul.innerHTML = `<li class="empty">No currencies yet</li>`;
        return;

    }
    watchul.innerHTML = state.watchlist.map(c => {
        const r = state.rates[c];
        const display = (r || r === 0) ? Number(r).toFixed(4) : 'N/A';
        return `<li data-c="${c}">1 ETB = ${display} ${c} <button class="rm">X</button></li>`;

    }).join("");

}
async function loadRates() {
    status.textContent = "Loading rates...";
    status.classList.remove("error");
    try{
        const res =await fetch(API);
        if(!res.ok)throw new Error("HTTP" + res.status);
        const data =await res.json();
        state.rates = data.rates;
        status.textContent = "";
        render();

    }catch (err){
        status.textContent = "couldn't load rates.";
        status.classList.add("error");
    }
    
}

form.addEventListener("submit",(e) => {
    e.preventDefault();

    const amt = Number(amount.value);
    if (isNaN(amt) || amt <= 0) {
        result.textContent = "Enter a correct amount.";
        return;
    }
    state.currency =select.value;
    const rate = state.rates[state.currency];
    if (!rate || isNaN(rate) || rate === 0) {
        result.textContent = "Rate unavailable for selected currency.";
        return;
    }
    const out = (amt / rate).toFixed(2);
    result.textContent = `${amt} ${state.currency} = ${out} ETB`;
});

addBtn.addEventListener("click" , () =>{
    const c = select.value;
    if (!c) return;

    if(state.watchlist.includes(c))
        return;

    state.watchlist.push(c);
    save();
    renderWatchlist();

});

watchul.addEventListener("click" ,(e) =>{
    if (!e.target.matches(".rm"))
        return;
    const c = e.target.closest("li").dataset.c;
    state.watchlist = state.watchlist.filter(x => x !== c);
    save();
    renderWatchlist();

});

function save(){
    localStorage.setItem( KEY , JSON.stringify({
        watchlist:state.watchlist,
        currency:state.currency,
    }));
    }

    function load() {
        const saved = localStorage.getItem(KEY);
        if (!saved) return;

        try {
            Object.assign(state, JSON.parse(saved));

        } catch(err) {
            console.warn("could not read saved watchlist");
        }
    }

async function init() {
    load();
    await loadRates();
    render();
    
}
init();



