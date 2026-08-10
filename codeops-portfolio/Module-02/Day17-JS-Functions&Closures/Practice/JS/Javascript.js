//function is written as 
function funName(param1,param2){ // parameter could be zero could be the amount as much as you need
    //task
}


//declaration - is hoisted 
function tax(amount){
    return amount * 0.25;
}

//expresstion - is not hoisted when being called whixh means we cannot call this function before the function code the const could be let too but var is hoisted

const aftertax = function(amount){return amount * 0.25};

//we use the above functions diffrently base don the circumstances 

//Arrow Function
const arrfuntotal = (qty , birr) => { return qty*birr} 

//if the function only has one parameter and one return we dont follow the rules

param => param;
// anonymous arrow function
(param) => {val  }
//this function is not needeed elsware an is not called back so we do not give it a m=name variable


//closure : how variables,parameters become private and how changes in scope changes acess to them
//anything inside a function is out of scope for everything else outside of it.

const outer = (fname) =>{

    console.log(fname)
    return () => {
        let fullname = `${fname} Abebe`;
        return fullname;
    };
};

const inner1 = outer("daniel");

const inner2 = outer("Almaz");

console.log(inner1());
inner2();


//Higher - Order -Function

// A higher-order function is simply one that takes a function as input, returns one as output, or both. 
const greet = name => `Selam, ${name}`; 
const fn = greet;          // store in another variable 
const list = [greet];      // put it in an array 

//Passign functions
//when we pass functions as an arguments the reciving function does not care what they are as long as they meet the parameters we can interchang e on function with another without changing the reciver and the output may vary depending on what we want

function applyToPrice(price, transform) { return transform(price); } 
const addVat  = p => p * 1.15; 
const halfOff = p => p * 0.5; 
applyToPrice(1000, addVat);    // 1150 
applyToPrice(1000, halfOff);   // 500

//returning the function
// a higher order function can also build and return a brand new function 

function multiplier(factor) { return n => n * factor; } 
const double = multiplier(2); 
const triple = multiplier(3); 
double(50);   // 100 
triple(50);   // 150 

//class example 
const total = (amount , method, provider) => {
    const tot = amount + (amount * method(provider))
    const change = method(provider)
    return change , tot 
}

function type(meth){
    if(meth === "TeleBirr"){
        return 0.025;
    }
    else if(meth === "CBE"){
        return 0.05;
    }
    else{
        return 0.01;
    }
}

const telepay = total(300,type,"TeleBirr")
console.log(telepay)