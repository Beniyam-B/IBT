// ARRAYS
// An array is just a list of things, in order, inside square brackets.
const names = [ "ababe" , "kebede"]
// we can use .length after the array name to detrmine name so that we can use names.length-1 to find the last possible array element
// all of them use indexes starting from zero foing to last item number-1 ; we saw this before in lists of python

// Adding and removing items:
// push(x) adds an item to the end. pop() removes the last item. Both CHANGE the original array.
// unshift(x) adds to the start, shift() removes from the start. These also change the original.
// includes("abebe") checks if a value is in the array and gives true or false.
// indexOf("kebede") tells you the position of a value.

names.push("almaz") // this will add almaz to the list of names

// THE BIG THREE ARRAY METHODS: map, filter, reduce

// These are the most important tools in this whole lesson. None of them change the original array - they always give you a brand new one.

//Map - transforms in one out
const newNames = names.map(name => name.toUpperCase())//this will transform all the names to uppercase
//or 
const newNames = names.map(names => names.append("!"))//this will add a ! to the end of all the names

const prices = [100,200,300]
const withvat = prices.map(p => p * 1.25);
//Filter - filters out the ones you don't want by testing each one
const dishes =[ 
{name: "Dorowot",price: 1200, veg: false},
{name:"shiro", price:200, veg:true},
]
const veg = dishes.filter(d => d.veg)//this will give you the veg dishes which are true to vegiterians

// Reduce - from whole array it reduces to a single value
const total = prices.reduce((a,b) => a + b, 0)//this will give you the total price of all the items in the array

// You can chain these together to tell a story:
dishes.filter(d => d.veg).map(d => d.price).reduce((s, p) => s + p, 0);
// This reads as: keep the veg dishes, get just their prices, add them up.

//OBJECTS
// An object groups related data under named labels (keys), instead of positions like an array.

const customer = {
name: "Almaz Bekele",
phone: "+251911234567",
city: "Addis Ababa",
member: true
};

// Read a value with a dot: 
customer.name
// Or with brackets (useful when the key name is stored in a variable): 
customer["phone"]
// Change a value:
customer.member = false;
// Add a brand new key just by assigning to it:
customer.email = "a@x.et";
// Delete a key:
delete customer.city;

// METHODS AND "this" : A method is just a function that lives inside an object.

const account = {
    owner: "Abebe",
    balance: 100,
    deposit(amount) {
        this.balance += amount;
    },

};
account.deposit(50);//this will add 50 to the balance

// Inside a method, the word "this" means "the object this method was called on". Important beginner rule: do NOT write object methods as arrow functions, because arrow functions do not understand "this" the same way. Use the shorthand shown above instead.

// NESTED DATA (objects inside arrays inside objects)
// Real data usually looks like this:
const order = {
    id: 1042,
    customer: "Tigist Mengistu",
    items: [
    { name: "Tibs", qty: 2, price: 200 },
    { name: "Shiro", qty: 1, price: 120 }
]
};
// order.items[0].name gives "Tibs". Read it left to right, one step at a time: the order, then its items list, then the first item, then that item's name.


// DESTRUCTURING - unpacking values in one line
// Instead of writing user.name and user.city on separate lines, you can pull them out at once.

// Object destructuring (matches by NAME):
const user = { name: "Hanna", city: "Bole" };
const { name, city } = user;

// Renaming while destructuring:
const { name: who } = user;

// Giving a default value if the key is missing:
const { member = false } = user;

// Array destructuring (matches by POSITION, not name):
const [first, second] = ["Tibs", "Shiro"];

// Destructuring works directly in function parameters too:
function card({ name, price }) { }


// SPREAD (...) - copy or combine
// The three dots ... used on the right side of something EXPANDS it out.

// Copy an array (a real copy, not just pointing to the same one):
const copy = [...menu];

// Combine two arrays:
const full = [...menu, "Firfir", "Buna"];

// Copy an object and change one field:
const updated = { ...user, city: "Kazanchis" };
// This is very important: it does NOT change the original user object. It builds a brand new object. This matters a lot later in React, where you are never allowed to change data directly.


// REST (...) - gather leftovers
// Same three dots, but used on the LEFT side while destructuring. Instead of expanding, it collects everything that is left over into one array or object.

const [winner, ...others] = ["Almaz", "Dawit", "Hanna"];
// winner is "Almaz", others is ["Dawit", "Hanna"]

const { id, ...rest } = order;
// id is pulled out on its own, rest is an object with everything else.

// Simple rule to remember: spread EXPANDS things out. Rest GATHERS things in. Same symbol, opposite job, depends on where you use it.


// SAFE ACCESS: ?. and ??
// These protect your code from crashing when data might be missing (very common with real API data).

// Optional chaining (?.) - stops safely instead of crashing if something along the path does not exist:
order.customer?.name;      // works fine
order.payment?.method;     // gives undefined instead of an error, even though payment does not exist

// Nullish coalescing (??) - gives a fallback value, but ONLY if the original is null or undefined:
const fee = order.fee ?? 60;
// Important: this is different from using ||. If fee was actually 0, fee || 60 would wrongly replace it with 60. fee ?? 60 correctly keeps the 0.


// EXERCISE 1


const price = [250, 600, 180, 900];

const withVat = price.map(p => p * 1.15);
console.log(withVat);
// map runs on every price and returns a new array with VAT added to each one

const under1000 = withVat.filter(p => p < 1000);
console.log(under1000);
// filter keeps only the prices that are still under 1000 after VAT

const tot = under1000.reduce((sum, p) => sum + p, 0);
console.log(tot);
// reduce adds every remaining price together into one single number


// EXERCISE 2


const customer1 = {
    name: "Almaz Bekele",
    city: "Addis Ababa",
    balance: 1500
};

for (const [key, value] of Object.entries(customer1)) {
    console.log(key, value);
}
// Object.entries turns the object into a list of [key, value] pairs
// the for...of loop walks through that list, and the [key, value] part
// destructures each pair straight into two separate variables


// EXERCISE 3


const { name, city } = customer;
console.log(name, city);
// pulls the name and city values straight out of the customer object

function greet({ name }) {
    return `Selam ${name}`;
}
console.log(greet(customer));
// the function expects an object and immediately unpacks just the name field from it


// EXERCISE 4


const updatedCustomer = { ...customer, city: "Bahir Dar", phone: "0911223344" };

console.log(customer);
// still has the original city, and no phone field - it was never touched

console.log(updatedCustomer);
// a brand new object: same name and balance as before, but new city and a phone field added


// EXERCISE 5

FILE: money.js
export const VAT = 0.15;
export const addVat = n => n * (1 + VAT);

FILE: app.js
import { VAT, addVat } from "./money.js";
console.log(addVat(1000));
// money.js owns the pricing logic and shares it
// app.js pulls in only what it needs and uses it

