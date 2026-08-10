'use strict';

function createLoyalty(earnRule = (etb) => Math.floor(etb / 10)) {
let points = 0;

return {
    earn(etb) {
    points += earnRule(etb);
    return points;
    },

    redeem(amount) {
    points = Math.max(0, points - amount);
    return points;
    },

    balance() {
    return points;
    },
};
}

//Example usage:
const card = createLoyalty();
card.earn(250);          // +25 points
card.redeem(10);         // -10 points
console.log(card.balance()); // 15
const holiday = createLoyalty((etb) => Math.floor(etb / 10) * 2);

if (typeof module !== 'undefined') {
module.exports = { createLoyalty };
}
