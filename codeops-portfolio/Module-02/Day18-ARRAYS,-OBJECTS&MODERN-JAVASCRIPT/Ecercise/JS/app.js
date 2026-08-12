import { transactions } from "./transactions.js";
import { totalByType, receipts, updateAmount } from "./report.js";

console.log(`Debits: ${totalByType(transactions, "debit")} ETB`);
console.log(`Credits: ${totalByType(transactions, "credit")} ETB`);

console.log("Receipts:");
receipts(transactions).forEach(line => console.log(line));

const corrected = updateAmount(transactions[0], 300);
console.log("Original:", transactions[0]);
console.log("Corrected copy:", corrected);
// this proves the original transaction was never touched -
// only a new, separate corrected object was created