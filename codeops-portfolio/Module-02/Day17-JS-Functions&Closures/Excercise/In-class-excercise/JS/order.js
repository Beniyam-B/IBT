"use strict";

/**
 * TODO: Write subtotal(...prices) using a reduce callback.
 * Use rest parameters to accept any number of prices [2, 3].
 */
const subtotal = (...prices) => {
  return prices.reduce((sum, price) => sum + price, 0);
};

/**
 * TODO: Write discountBy(rate) as a factory returning an arrow function.
 * This is a Higher-Order Function (HOF) that creates a closure over the rate [2, 3].
 */
const discountBy = (rate) => {
  return (amount) => amount * (1 - rate);
};

/**
 * TODO: Add withVat as a small pure helper.
 * It should add 15% VAT to a given amount [2, 3].
 */
const withVat = (n) => {
  return n * 1.15;
};

/**
 * TODO: Add toETB as a small pure helper.
 * It should format a number to 2 decimal places followed by " ETB" [2, 3].
 */
const toETB = (n) => {
  return `${n.toFixed(2)} ETB`;
};

/**
 * TODO: Build makeReceiptMaker() with a private order number.
 * This function uses a closure to maintain the state of orderNo across calls [4, 5].
 * Inside, it should pre-build a 10% member discount function using discountBy(0.10) [5].
 */
function makeReceiptMaker() {
  let orderNo = 0; // Private state [4]
  const memberOff = discountBy(0.1);

  return function (...items) {
    orderNo += 1;
    const total = subtotal(...items);
    const discounted = memberOff(total);
    const afterVat = withVat(discounted);
    return `#${orderNo}: ${toETB(afterVat)}`;
  };
}

// Export for run.js
if (typeof module !== "undefined") {
  module.exports = { subtotal, discountBy, withVat, toETB, makeReceiptMaker };
}
