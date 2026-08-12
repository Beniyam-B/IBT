export const totalByType = (txns, type) =>
    txns.filter(t => t.type === type)
        .reduce((sum, { amount }) => sum + amount, 0);
// first keeps only transactions matching the given type (credit or debit)
// then adds up their amounts into one total
// notice { amount } destructures the amount straight out of each transaction inside reduce

export const receipts = (txns) =>
    txns.map(({ customer, amount, type }) =>
    `${customer}: ${amount} ETB (${type})`);
// map builds a new array of formatted text lines, one per transaction
// the callback destructures customer, amount and type directly from its parameter

export const updateAmount = (txn, newAmount) => ({ ...txn, amount: newAmount });
// takes one transaction and returns a brand NEW object
// same customer, id and type as before, but amount is replaced with newAmount
// the original txn object passed in is never changed

