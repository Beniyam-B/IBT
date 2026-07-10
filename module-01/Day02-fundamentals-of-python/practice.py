#comments are put to describe the code you have written for other people or you to understand it later. It is not executed by the computer.

#varable : tese are value holders that we can use later to excurte or call those values.
#eg
name = "Beniyam" #this is a string variable you know its string because it is in double quotes
num = 9 #this is a number variable you know its a number because it is not in double quotes
is_done = True #this is a boolean variable you know its boolean because it is either true or false

#you also can create a variable without a value if you intend to use it later and change its value

verified = None #this is a variable without a value, it is set to None which means it has no value yet

#converting one type of value into another type of value is called type casting. for example if you want to convert a string to a number or a number to a string you can do that using the following methods
#eg
num_str = "10"
num = int(num_str)
#this is very important because all input taken from user is always received as a string
#eg
user_input = input("Enter a number: ")
user_num = int(user_input)  

#operations
#there are different types of operations you can perform on variables. for example you can add, subtract, multiply, divide, and many more. here are some examples
a = 10  
b = 2
addition = a + b #this is addition
subtraction = a - b #this is subtraction    
division = a / b #this is division
multiplication = a * b #this is multiplication
modulo = a % b #this is modulo, it gives the remainder of the division
exponent = a ** b #this is exponentiation, it gives the result of a raised to the power of b


#comparision and logical operators
#comparision operators are used to compare two values and return a boolean value (True or False). here are some examples
x = 10
y = 5
is_equal = x == y #this is equality comparison
is_not_equal = x != y #this is inequality comparison
is_greater = x > y #this is greater than comparison
is_less = x < y #this is less than comparison
is_greater_equal = x >= y #this is greater than or equal to comparison
is_less_equal = x <= y #this is less than or equal to comparison

#logical operators are used to combine multiple boolean values and return a boolean value. here are some examples
is_true = True
is_false = False
and_result = is_true and is_false #this is the AND operator
or_result = is_true or is_false #this is the OR operator
not_result = not is_true #this is the NOT operator

#control flow
#control flow is the order in which the computer executes the code. there are different types of control flow statements you can use to control the flow of your code. here are some examples
#conditional statements
age = 18
if age >= 18:
    print("You are an adult.") 
elif age < 13:
    print("you are a child")
elif 18 < age < 35:
    print ("enjoy your youth!")
else:
    print("UNC")

#loops
#loops are used for a certain block of code to be executed multiple times. there are different types of loops you can use to repeat a block of code. here are some examples
#while loop
count =1
while (count < 5):
    print(count)
    count += 1 #this is the same as count = count + 1

#for loop with range

for i in range(5):
    print(i)   #this will print numbers from 0 to 4
for i in range(1, 6):
    print(i)   #this will print numbers from 1 to 5 
for i in range(1, 10, 2):
    print(i)   #this will print odd numbers from 1 to 9 


    #break and continue 
    #these are used to control the flow of a loop. break is used to exit a loop and continue is used to skip the current iteration and move to the next iteration. here are some examples
for i in range(10):
    if i == 5:
        break #this will exit the loop when i is equal to 5
    print(i) #this will print numbers from 0 to 4       
#continue example
for i in range(10):
    if i == 5:
        continue #this will skip the current iteration when i is equal to 5
    print(i) #this will print numbers from 0 to 9 except 5
#function and scope

#functions are used to group a block of code together and give it a name so that you can call it later. here is an example
def greet(name):
    print(f"Hello, {name}!") #this is a function that takes a name as an argument and prints a greeting message

#you can also use this with input to ask user and respond 
user_name = input("Enter your name: ")
greet(user_name) #this will call the greet function and pass the user_name variable as an argument
 #you can also have more than one argument in a function. here is an example
def add_numbers(a, b):
    print (f"The sum is {a + b}") #this is a function that takes two numbers as arguments and prints their sum
num1 = input("input number 1")
num2 = input("input number 2")
add_numbers(int(num1), int(num2)) #this will call the add_numbers function and pass the num1 and num2 variables as arguments after converting them to integers

#scope is the area of the code where a variable is defined and can be accessed. there are two types of scope in python: global scope and local scope. here is an example
global_var = "I am a global variable" #this is a global variable because it is placed outside of any defined function

def print_variables():
    local_var = "I am a local variable" #this is a local variable because it is placed inside the function
    print(global_var) #this will print the global variable
    print(local_var) #this will print the local variable

print_variables() 

#excercise 1 temprature label
temp_in_celcius = input("input tempreture in celcius")
temp = int(temp_in_celcius)

if temp >= 15 :
 print ("Cold")
 elif 15 < temp <28:
 print ("Warm")
 else  :
 print ("Hot")

#excercise 2 recipt loop on each line from 1 to 10 using for loop with range

for i in range(1, 11):
    print(f"recipt #{i}")
#excercise 3 every even number from 0 to 20 using loop with modulo
for i in range (1,21)
    if i%2 == 0 ;
    print(i)
#excercise 4 Discount function. Write apply_discount(price, percent=10) that returns the price after the discount. Test it with and without the default.
price = input("insert the price of item")
price = int(price)
def apply_discount(price, percent=0.10):
    discount = price - (price*percent)
    price = discount
    return price
#excercise 5 Countdown. Use a while loop to count down from 5 to 1, printing each number, then print "Liftoff!"
i = 5
while (i > 0):
    print(i)
    i -= 1
print("liftoff")
