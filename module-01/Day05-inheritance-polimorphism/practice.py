# Inheritance, polymorphism, and abstraction
# These concepts show how classes can share behavior, change behavior, and define a common structure.
# Inheritance lets a child class reuse code from a parent class.
# This means the child class gets the parent's attributes and methods automatically.

class Animal:
    def __init__(self, name, legs):
        self.name = name
        self.legs = legs

    def speak(self):
        print(f"{self.name} is speaking")


class Dog(Animal):
    def __init__(self, name, legs, breed):
        super().__init__(name, legs)
        self.breed = breed

    def speak(self):
        print(f"{self.name} says: Woof!")


# Inheritance example
# The Dog class uses the Animal class as its parent.
# Because of inheritance, Dog can use the name and legs values from Animal.
border_collie = Dog("Border Collie", 4, "Border Collie")
border_collie.speak()

# Overriding and polymorphism
# This shows that a child class can change the behavior of a parent method.
# The Cat class overrides the speak() method to give a different output.
class Cat(Animal):
    def __init__(self, name, legs, kind=None):
        super().__init__(name, legs)
        self.kind = kind

    def speak(self):
        print(f"{self.name} says: Meow!")


animals = [Dog("Labrador", 4, "Labrador"), Cat("Milo", 4, "Cat")]
for animal in animals:
    animal.speak()

# Duck typing
# Python cares about whether an object can do a task, not only what class it belongs to.
# This means different classes can work with the same function if they have the same method name.
class Duck:
    def quack(self):
        print("Quack!")


class Person:
    def quack(self):
        print("I can quack too!")


def make_sound(obj):
    obj.quack()


make_sound(Duck())
make_sound(Person())

# Abstraction hides implementation details.
# It shows the important behavior without forcing us to know every internal step.
# The abstract base class defines methods that subclasses must provide.
from abc import ABC, abstractmethod


class AnimalBase(ABC):
    def __init__(self, name, legs):
        self.name = name
        self.legs = legs

    @abstractmethod
    def speak(self):
        pass


class Account(ABC):
    @abstractmethod
    def calculate_interest(self):
        pass


class SavingsAccount(Account):
    def __init__(self, balance):
        self.balance = balance

    def calculate_interest(self):
        return self.balance * 0.1


class CurrentAccount(Account):
    def calculate_interest(self):
        return 0


# Composition means an object has another object.
# This is different from inheritance because the class uses another class instead of extending it.
# In this example, AccountWithHistory contains a TransactionHistory object.
class TransactionHistory:
    def __init__(self):
        self.transactions = []


class AccountWithHistory:
    def __init__(self):
        self.history = TransactionHistory()


# Exercises
# These classes show how inheritance and abstraction work together in a real example.
class Vehicle(ABC):
    def __init__(self, make, model):
        self.make = make
        self.model = model

    def describe(self):
        print(f"{self.make} {self.model}")

    @abstractmethod
    def wheels(self):
        pass


class Car(Vehicle):
    def wheels(self):
        return 4


class Truck(Vehicle):
    # The Truck class uses super() to reuse the Vehicle constructor.
    # This lets it initialize make and model without rewriting that code.
    def __init__(self, make, model, capacity):
        super().__init__(make, model)
        self.capacity = capacity

    def describe(self):
        # This overrides the parent method to add extra information about the truck.
        print(f"{self.make} {self.model} has capacity {self.capacity}")

    def wheels(self):
        return 6


vehicles = [Car("Honda", "Civic"), Truck("Ford", "F150", 4)]
for vehicle in vehicles:
    vehicle.describe()
    print(f"Wheels: {vehicle.wheels()}")