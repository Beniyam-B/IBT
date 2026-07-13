# Transaction log reader
# This script reads transaction.txt, groups spending by customer,
# prints a summary, and writes the result to report.txt.

# Step 1: Read the file line by line.
# Step 2: Build a dictionary of each customer and their total spending.
# Step 3: Sort the dictionary from highest total to lowest.
# Step 4: Print the summary and save it to report.txt.
# Step 5: Handle the missing-file case gracefully.

try:
    transactions = {}

    with open("transaction.txt", "r", encoding="utf-8") as file:
        for line in file:
            parts = line.strip().split()
            if len(parts) == 2:
                name, amount = parts[0], float(parts[1])
                transactions[name] = transactions.get(name, 0) + amount

    # Example: sort the dictionary items by total spending from highest to lowest.
    sorted_transactions = sorted(transactions.items(), key=lambda item: item[1], reverse=True)

    print("Customer Transaction Summary:")
    for customer, total in sorted_transactions:
        print(f"{customer}: {total} ETB")

    with open("report.txt", "w", encoding="utf-8") as report:
        report.write("Customer Transaction Summary\n")
        report.write("=" * 30 + "\n")
        for customer, total in sorted_transactions:
            report.write(f"{customer}: {total} ETB\n")

except FileNotFoundError:
    print("Error: transaction.txt file not found!")
