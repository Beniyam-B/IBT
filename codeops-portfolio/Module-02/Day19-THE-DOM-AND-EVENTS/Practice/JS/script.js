// WHAT IS THE DOM:  stands for Document Object Model. When your browser loads an HTML file, it does not just show the text - it builds a live copy of the page in memory, made of objects. Every tag (h1, ul, li, button, etc.) becomes an object called a "node". These nodes are connected like a family tree, with document at the very top as the entry point.

// Important idea: the DOM is the page IN MEMORY, not your .html file. If you change the DOM with JavaScript, the user sees the change instantly on screen, but the actual .html file on your computer is untouched.

// Example HTML:
// <body>
//   <h1>Addis Market</h1>
//   <ul id="list">
//     <li class="item">Teff</li>
//     <li class="item">Berbere</li>
//   </ul>
// </body>

// The tree this becomes:
// document
//  - body
//     - h1 "Addis Market"
//     - ul#list
//        - li.item "Teff"
//        - li.item "Berbere"
//SELECTING ELEMENTS (FINDING THINGS ON THE PAGE)
//Before you can change anything, you have to find it first. There are three main tools:

document.getElementById("list")
// finds ONE element by its id attribute
// fast, but only works with id

document.querySelector("h1")
// finds the FIRST element that matches a CSS selector
// works with anything: tag name, .class, #id, even things like "ul li:first-child"
// this is the one you will use most

document.querySelectorAll(".item")
// finds ALL elements that match, and gives you back a list of them (called a NodeList)

Example:
const list = document.getElementById("list");
const title = document.querySelector("h1");
const first = document.querySelector(".item");
const items = document.querySelectorAll(".item");
items.length; // 2, because there are 2 elements with class "item"

//Important: if nothing matches, querySelector gives you back null, not an error. But if you then try to use that null as if it were an element, THAT will cause an error. So it is good practice to check that your selection actually found something before using it.

// READING CONTENT AND VALUES :Once you have selected an element, you can read what is inside it.

el.textContent
// reads the plain text inside an element
// Example: h1.textContent gives you "Addis Market"

el.value
//  reads what the user typed into an input, select, or textarea
//  IMPORTANT: this always comes back as a STRING, even if it looks like a number
// Example: input.value might be "3" (a string, not the number 3)
// To turn it into a real number for math, wrap it: 
Number(input.value)
// If you forget to convert it, "10" + "5" becomes "105" instead of 15, because + just joins the two strings together.

el.getAttribute("class")
// reads any HTML attribute directly, for example getAttribute("class") returns "item"

el.dataset
//  a shortcut for reading custom data-* attributes
// Example: if your HTML has data-id="7", then in JavaScript you read it as el.dataset.id


//NODELIST IS NOT QUITE AN ARRAY

document.querySelectorAll(".item") //gives you a NodeList, which looks like an array but is not exactly one.

// What works directly on a NodeList:
items.forEach(li => console.log(li.textContent))
items.length

// What does NOT work directly (map, filter, reduce):
// You must first convert it into a real array, using the spread operator [...] or Array.from()
// Example:
const names = [...items].map(li => li.textContent);
// or
const names = Array.from(items).map(li => li.textContent);

// Ways to move around the tree from one element:
el.parentElement     //   the element that contains it
el.children          //   its direct children
el.firstElementChild   //  the first child
el.nextElementSibling   // the next element right after it
el.closest(".card")     // walks UP the tree until it finds a match
//CHANGING TEXT, HTML AND STYLES


// Setting text (the SAFE way):
h1.textContent = "Addis Market - Bole";

// Setting HTML (parses your string as actual HTML tags):
h1.innerHTML = "<em>Selam</em>";
//WARNING: never put raw user input into innerHTML. If a user types HTML or script code into a form and you insert it with innerHTML, it can actually run on your page. This is called an XSS attack (cross-site scripting). Always use textContent for anything that came from user input.

// Working with classes (the preferred way to change how something looks):
el.classList.add("active")       //adds a class
el.classList.remove("hidden")    // removes a class
el.classList.toggle("done")      // adds it if missing, removes it if present (great for on/off states)
el.classList.contains("done")    // true or false, checks if the class is there

//Why classes instead of direct styles: your CSS file stays in charge of what things look like, and your JavaScript just decides WHICH state an element is in (like "done" or "active"). You can still set a style directly if you really need to:
h1.style.color = "crimson";

//CREATING, INSERTING AND REMOVING ELEMENTS : building new content out of your data. There is a simple 3 step pattern you will use constantly.

// Step 1 - create the element (it only exists in memory so far, nothing on screen yet):
const li = document.createElement("li");

// Step 2 - fill it with content:
li.textContent = "Shiro";
li.classList.add("item");
li.dataset.id = "12";

// Step 3 - place it into the actual page:
list.append(li);     // adds it to the END of the parent
list.prepend(li);     // adds it to the START of the parent

// Removing elements:
li.remove();                  // removes just this one element
list.innerHTML = "";          // wipes out everything inside (empties the whole container)


//EVENTS - MAKING THE PAGE RESPOND : An event is something that happens on the page: a click, a key press, a form being submitted. To react to it, you use addEventListener.

const btn = document.querySelector("#add");
btn.addEventListener("click", function (e) {
    console.log("clicked!");
});

// Or with an arrow function (very common style):
btn.addEventListener("click", (e) => {
  handleAdd();
});

// Breaking this down :
// - "#add" is the CSS selector for the button (an element with id="add")
// - "click" is the name of the event you are listening for, as plain text
// - the function you pass in is your "handler" - the code that runs WHEN the click happens
// - the browser automatically hands your handler an object usually called "e" (short for event) describing what just happened

// Useful things on that event object (e):
// e.target -the exact element that was clicked/typed into
// e.type  - the name of the event, like "click" or "input"
// e.key  - which key was pressed (for keyboard events)
// e.preventDefault() - stops the browser's normal default behaviour

// Common events you will use:
// click - user clicks something
// input - fires on every single keystroke, good for live search
// change - fires when a field loses focus after being changed, good for dropdowns/checkboxes
// submit - a form is submitted (always listen on the form itself, not the button - this also catches the user pressing Enter)
// keydown - a key is pressed down
// mouseover- the mouse pointer enters an element



//FORMS - PREVENTDEFAULT AND READING INPUTS : By default, submitting an HTML form reloads the whole page and throws away any JavaScript state you had. Since we want the page to update instantly without reloading, we always stop that default behaviour first.

// The standard recipe you will use again and again:

const form = document.querySelector("#add-form");
const nameIn = document.querySelector("#name");

form.addEventListener("submit", (e) => {
  e.preventDefault();                 // 1. stop the page reload
  const name = nameIn.value.trim();   // 2. read the value, trim removes extra spaces
  if (!name) return;                  // 3. basic validation, ignore empty input
  cart.push({ name, qty: 1 });        // 4. update the data
  render();                           // 5. redraw the page from the data
  form.reset();                       // 6. clear the input field
});

// Memorise this order: preventDefault, then read and validate, then update the data, then render, then reset the form.



// EXERCISE 1
// Task: select an h1 and change its text with textContent, then add a CSS class to it with classList.toggle.

const h1 = document.querySelector("h1");
h1.textContent = "Selam, Addis Market!";
h1.classList.toggle("active");

// EXERCISE 2
// Task: given an array of three Ethiopian city names, create an li for each one with createElement, and append them to a ul.

const cities = ["Addis Ababa", "Arba Minch", "Bahir Dar"];
const cityList = document.querySelector("#cities");

cities.forEach(city => {
    const li = document.createElement("li");
    li.textContent = city;
    cityList.append(li);
});

// EXERCISE 3
// Task: add a click listener to a button that logs event.target, then wrap the button in a div that has its own click listener, and observe bubbling (clicking the button should also trigger the div's listener).

const btn = document.querySelector("#myBtn");
const wrapper = document.querySelector("#wrapper");

btn.addEventListener("click", (e) => {
    console.log("button says target is:", e.target);
});

wrapper.addEventListener("click", (e) => {
    console.log("wrapper heard a click too, because it bubbled up");
});

// EXERCISE 4
// Task: build a list of items, each with a delete button, and remove any item using a single delegated listener on the parent.


const taskList = document.querySelector("#taskList");

taskList.addEventListener("click", (e) => {
    if (e.target.matches(".del")) {
    e.target.closest("li").remove();
    }
});

// EXERCISE 5
// Task: add a form with one text input; on submit, preventDefault, read input.value, append it to a list, and clear the field.


const quickForm = document.querySelector("#quickForm");
const quickInput = document.querySelector("#quickInput");
const quickList = document.querySelector("#quickList");

quickForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = quickInput.value.trim();
    if (!text) return;
    const li = document.createElement("li");
    li.textContent = text;
    quickList.append(li);
    quickInput.value = "";
});
