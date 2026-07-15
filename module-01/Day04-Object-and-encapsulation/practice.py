# Object-oriented programming
# It groups data and actions in one place.

account_data = {"owner": "Almaz", "balance": 2000}


def deposit(acc, amount):
    acc["balance"] += amount


class Account:
    def __init__(self, owner, balance):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount


acc = Account("Almaz", 2000)
acc.deposit(1000)


class Student:
    def __init__(self, name, student_id, gpa):
        self.name = name
        self.id = student_id
        self.gpa = gpa

    def enroll(self, name=None, student_id=None, gpa=None):
        if name is not None:
            self.name = name
        if student_id is not None:
            self.id = student_id
        if gpa is not None:
            self.gpa = gpa
        if self.gpa <= 2.0:
            return "You are not eligible for the course"
        return "You are eligible for the course"

    def get_grades(self):
        return self.gpa


s1 = Student("Beniyam", 1, 3.2)
print(s1.enroll("Beniyam", 1, 3.2))
print(s1.get_grades())


# Protected attributes use one underscore.
class StudentWithProtected:
    def __init__(self, name, student_id, gpa):
        self._name = name
        self._id = student_id
        self._gpa = gpa


# Private attributes use two underscores.
class StudentWithPrivate:
    def __init__(self, name, student_id, gpa):
        self.__name = name
        self.__id = student_id
        self.__gpa = gpa


# Properties let us control access to data safely.
class AccountWithProperty:
    def __init__(self, balance):
        self.__balance = balance

    @property
    def balance(self):
        return self.__balance

    @balance.setter
    def balance(self, value):
        if value <= 0:
            print("You can't set a non-positive balance.")
            return
        self.__balance = value
    


a = AccountWithProperty(1000)
print(a.balance)
a.balance = 2000
print(a.balance)


# A simple class can store and describe object data.
class Book:
    def __init__(self, title, author, pages):
        self.title = title
        self.author = author
        self.pages = pages

    def describe(self):
        print(f"This book named {self.title} is written by {self.author} and has {self.pages} pages.")


book1 = Book("The Hobbit", "J.R.R. Tolkien", 1000)
book2 = Book("The Lord of the Rings", "J.R.R. Tolkien", 1200)
book1.describe()
book2.describe()


# Encapsulation hides internal data and controls access.
class Product:
    def __init__(self, name, price, quantity):
        self.name = name
        self.price = price
        self.__quantity = quantity

    @property
    def quantity(self):
        return self.__quantity

    @quantity.setter
    def quantity(self, value):
        if value < 0:
            print("You cannot set a negative quantity.")
            return
        self.__quantity = value

    def restock(self, n):
        self.quantity = self.quantity + n
        print(f"The product {self.name} has been restocked with {n} more units which add a value of {self.price * n} ETB.")

    def sell(self, n):
        if self.quantity - n < 0:
            print("You can't sell more than you have.")
            return
        self.quantity = self.quantity - n
        print(f"The product {self.name} has been sold with {n} units for the price of {self.price * n} ETB.")


banana = Product("banana", 25, 50)
banana.restock(50)
banana.sell(50)

banana = Product("banana", 25, 50)
apple = Product("apple", 25, 50)
orange = Product("orange", 25, 50)

banana.restock(20)
apple.sell(10)
orange.restock(5)

print(banana.quantity)
print(apple.quantity)
print(orange.quantity)
