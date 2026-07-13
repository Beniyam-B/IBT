# Day 03 - Collections, Files, and Errors
# This file explains the main Python concepts from the lesson with short examples.

# 1. Lists
# A list stores many values in order and can be changed after creation.
names = ["Abebe", "Almaz", "Bereket", "Chaltu"]
print(names[0])          # Example: access the first item
print(names[-1])         # Example: access the last item
print(names[1:3])        # Example: slice a part of the list
print(len(names))        # Example: count the number of items

# Example: add a new value to the end of the list.
names.append("Dawit")
print(names)

# Example: remove an item by value.
names.remove("Almaz")
print(names)

# Example: loop through a list.
for name in names:
    print(name)

# 2. Tuples
# A tuple is like a list, but it cannot be changed after creation.
location = (9.0385, 0.4987)
latitude, longitude = location
print(latitude)          # Example: first value in the tuple
print(longitude)         # Example: second value in the tuple

# 3. Dictionaries
# A dictionary stores data as key-value pairs.
student = {
    "name": "Ben",
    "grade": 3.0,
    "department": "Computer Science"
}
print(student["name"])  # Example: get a value using its key
student["grade"] = 2.75 # Example: update a value
print(student.get("phone", "No phone number"))  # Example: safe lookup with a default value

# 4. Sets
# A set stores unique values and is useful for removing duplicates.
nums = [1, 2, 2, 6, 4, 4]
unique_numbers = set(nums)
print(unique_numbers)   # Example: duplicates are removed

# Example: set operations.
a = {"abebe", "kebede"}
b = {"samuel", "kebede"}
print(a | b)  # Union: all unique values from both sets
print(a & b)  # Intersection: values found in both sets
print(a - b)  # Difference: values in a but not in b

# 5. Comprehensions
# A comprehension creates a list or dictionary in a short, readable way.
prices = [100, 250, 400, 80]
with_tax = [price + (price * 0.15) for price in prices]  # Example: add 15% tax to each price
cheap_items = [price for price in prices if price < 200]  # Example: keep only prices below 200
print(with_tax)
print(cheap_items)

# Example: dictionary comprehension.
minimized = {num: num - 5 for num in prices}
print(minimized)

# 6. Modules and imports
# A module is reusable code that we can import into our program.
import math
import datetime as dt
print(math.sqrt(81))       # Example: use math to calculate a square root
print(dt.date.today())     # Example: use datetime to get today's date

# 7. Files
# Files are used to save and read data from disk.
with open("names.txt", "w") as file:
    file.write("Abebe Kebede\n")
    file.write("Chala Gemechu\n")
    file.write("Samuel Girum\n")

with open("names.txt", "r") as file:
    for line in file:
        print(line.strip())  # Example: read one line at a time

# Example: write to a file using append mode.
with open("report.txt", "a") as file:
    file.write("This line was added with append mode.\n")

# 8. Error handling
# Exception handling helps the program continue even when an error happens.
try:
    result = 10 / 0
except ZeroDivisionError:
    print("You cannot divide by zero!")

# Example: catch more than one kind of error.
try:
    number = float(input("Enter a number to divide 1000 by: "))
    print(1000 / number)
except ZeroDivisionError:
    print("Cannot divide by zero.")
except ValueError:
    print("Please enter a valid number.")
finally:
    print("Division attempt finished.")

# 9. Exercises
# Exercise 1: Use a set to store unique city names and count them.
cities = ["Addis Ababa", "Kombolcha", "Arba Minch", "Addis Ababa", "Kombolcha"]
unique_cities = set(cities)
print(unique_cities)
print(len(unique_cities))

# Exercise 2: Make a dictionary of grocery items and print each item with its price.
grocery_items = {
    "Cabbage": 50,
    "Onion": 30,
    "Tomato": 40,
    "Lettuce": 25,
    "Potato": 35
}
for item, price in grocery_items.items():
    print(f"{item}: {price} ETB")

# Exercise 3: Use a comprehension to add 15% tax to each price.
prices = [100, 250, 400, 80]
with_tax = [price + (price * 0.15) for price in prices]
print(with_tax)

# Exercise 4: Use a comprehension to keep only prices below 200.
cheap_items = [price for price in prices if price < 200]
print(cheap_items)

# Exercise 5: Write three names to names.txt and read them back.
with open("names.txt", "w") as file:
    file.write("Abebe Kebede\n")
    file.write("Chala Gemechu\n")
    file.write("Samuel Girum\n")

with open("names.txt", "r") as file:
    for line in file:
        print(line.strip())

# Exercise 6: Safe division with error handling.
try:
    user_number = float(input("Insert the number that divides 1000: "))
    division_result = 1000 / user_number
    print(division_result)
except ZeroDivisionError:
    print("Cannot divide by zero.")
except ValueError:
    print("Please enter a valid number.")
finally:
    print("Done.")
