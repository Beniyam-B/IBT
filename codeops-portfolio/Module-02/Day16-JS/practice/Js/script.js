

console.log("Hello World")

let x=12

console.log(x)
let y=typeof x
console.log(y)

let name="Abebe"
console.log(`Hello ${name}`)

// in class excercise

const billinput = "700"
let partysize = 3

const bill = number(billinput)

let tip = bill > 300 ? 0.1 * bill :  bill * 0.05 ;

const total = tip + bill 

const totalperperson = total / partysize

console.log(
    `Total =  ${total} ETB` +
    `Per-person =  ${totalperperson} ETB each`
)

switch(method) {
    case 'TeleBirr':
        fee = total * 0.005;
        break;
    case 'CbeBirr':
        fee = total * 0.1;
        break;
    default:
        fee = total *0.02;
}