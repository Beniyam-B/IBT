# Pharmacy Inventory Tracker
# This is a simple inventory program that reads stock data from a file.

# This creates an empty dictionary to store item names and their quantities.
stock = {}

# This starts a block of code that might fail if the file is missing.
try:
    # This opens the file named stock.txt for reading.
    with open("stock.txt", "r") as s:
        # This loops through every line in the file.
        for line in s:
            # This removes the newline and splits the line into two parts: item and quantity.
            item, quantity = line.strip().split()
            # This saves the item and its quantity in the dictionary.
            stock[item] = int(quantity)

    # This prints the dictionary after all data has been read.
    print(stock)

# This handles the case where the file does not exist.
except FileNotFoundError:
    # This shows a helpful error message to the user.
    print("stock.txt file does not exist")

# This defines a function that updates the stock for a given item.
def adjust(item, amount):
    # This adds or subtracts the amount from the item quantity.
    stock[item] = stock.get(item, 0) + amount

# This creates a list of items whose quantity is less than 10.
less_quantity = [item for item, quantity in stock.items() if quantity < 10]

# This prints the items that are running low.
print(f"Low quantity items: {less_quantity}")