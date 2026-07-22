#SOLID Principle & Design Patterns
#SOLID is a set of design principles that help you to write object-oriented code that is easy to understand, change, extend, and reuse.
#Design Patterns are reusable solutions to common problems that occur in software design.

#SOLID Principle

#Single Responsibility Principle: A class should have only one reason to change. agod-class Account holds the balance , saves itself and sends sms alerts. it has three reasons to change but with this principle it should have only one reason to change.so you split it.

#Open-Closed Principle: Software entities (classes, modules, functions, etc.) should be open for extension, but closed for modification. so you can add new functionality without changing the existing code.

#Liskov Substitution Principle: If S is a subtype of T, then objects of type T may be replaced with objects of type S without altering any of the desirable properties of that program. so you can replace the subclass with the superclass without changing the functionality.

#Interface Segregation Principle: Many client-specific interfaces are better than one general-purpose interface. so you can have multiple interfaces for different functionalities.

#Dependency Inversion Principle: High-level modules should not depend on low-level modules. both should depend on abstractions. so you can change the low-level module without affecting the high-level module.

#SRP and LSP are the most important principles in software design. so you should follow them.

#Design patterns --creational patterns 
#desighn patterns are relible reusable solutions to problems that comes up often 
#they have three family memebers
#1. Creational :this is how objects are created  
#2. Structural :this is how objects are composed
#3. behavioural :this is how they communicate with each other

# creational pattern : singleton
# singleton is a class that can have only one instance and provide a global point of access to it. so you can use it anywhere in the program.
# a singlton source of tuth , one configuration object Override __new__ so that the class always returns one instance it created.
#eg:
class BankConfig:
    _instance = None
    def __new__(cls):  #we __new__ method to create a singleton object and cls is the class name that is used with __new__ method
        if cls._instance is None:
            cls._instance = super().__new__(cls) #this is the super class of the class that is used with __new__ method
            cls._instance.interest_rate = 0.05 #this line of code is used to set the value of interest rate
            cls._instance.overdraft_limit = 1000 #this line of code is used to set the value of overdraft limit(the minimum amount that can be withdrawn)
        return cls._instance #this line of code is used to return the instance of the class (which can change depending on the interest rate and overdraft limit)
    
BankConfig() is Bankconfig()   #this is the way to create an object of the class if true -- BankConfig is a singleton class same object is created every time we call the function

#creational pattern : factory
# factory is a class that creates objects without exposing the implementation details. so you can use it anywhere in the program.
# a factory class that creates an object of the class it is used with. it has a method that returns an object of the class it is used with.
#it also decides which class to create based on some input, the rest of the code asks for type by name insted of importing and naming every class, this pair with oppen/close principle

class AccountFactory:
    @staticmethod
    def create(kind,owner,number,balance=0): #this code is used to create an object of the class it is used with based on the input
        if kind == "Savings":
            return SavingsAccount(owner,number,balance) #first we check the kind of account we want to create
        if kind == "Current":
            return CurrentAccount(owner,number,balance) #if it is a current account we create an object of the class it is used with
        raise ValueError(f"Unkown account type {kind}") #if it is not a current account or a savings account we raise an error
    
acc= AccountFactory.create("savings","Almaz","CBE-1",1500) #this code is used to create an object of the class it is used with based on the input

#Design patterns : Behavioural
#observer :lets many objects observe a change in a subject object. so you can use it anywhere in the program. this happens whithout the subject knowing about the observers.thiis keeps the account decoupled from things that react to changes in the account.

class Account:
    def __init__(self): #this is the constructor of the class it is used with
        self._observers = [] #this is the list of observers
        def subscribe(self,obs):#this is the method that subscribes an observer to the account
            self.observers.append(obs)#this line of code is used to add the observer to the list of observers
            def _notify(self,event):#this is the method that is called when the account is updated
                for obs in self._observers:
                    obs.update(event)#this line of code is used to call the update method of the observer update is found in the observer class
            def withdraw(self,amount): #this is the method that withdraws the amount from the account
                self.balance -= amount
                slef._notify(f"{amount} ETB withdrawn")#this line of code is used to call the _notify method of the account
#observer pattern
#each observer needs an update()method the account calls when it is updated, it knows nothing about the observers
#the observers need a subscribe() method that the account calls when it subscribes to the account
#the observers need a unsubscribe() method that the account calls when it unsubscribes from the account

class SMSAlert:
    def update(self,event):#this is written to be called when the account is updated with the intention of sending an sms alert
        print (f"[TeleBirr SMS] {event}")
class AuditLog:
    def update(self,event):#this is written to be called when the account is updated with the intention of logging the event
        print (f"[log] {event}")

acc.subscribe(SMSAlert())#this sends an sms alert when subbscribed
acc.subscribe(AuditLog())#this logs the event when subbscribed
acc.withdraw(1000)#this withdraws 1000 from the account both observers fire, the account is updated and the observers are notified

#why does it matteer: Account never imports observers (SmsAlert and AuditLog) so it is decoupled from them. so you can change the observers without changing the account.this is the open/close principle

#Excercise
#1.Spot the SRP violation. Take a Report class that builds, saves, and emails a report. Split it into three focused classes
#Wrong example (this works, but it breaks SRP because one class does too many jobs)
class Report:
    def __init__(self, name, date):  # initialize the report with a title and date
        self.name = name  # store the report name
        self.date = date  # store the report date
        self.data = []  # create an empty list to hold data

    def build(self):  # build the report content
        self.data = [self.name, self.date]  # put the name and date into the data list
        return self.data  # return the built report data

    def save(self):  # save the report
        print("saving")  # print a save message

    def email(self):  # email the report
        print("emailing")  # print an email message

#Better example (this follows SRP because each class has one purpose)
class Report:
    def __init__(self, name, date):  # initialize the report data
        self.name = name  # store report name
        self.date = date  # store report date

    def build(self):  # prepare the report data
        return {"name": self.name, "date": self.date}  # return a dictionary with report data

class ReportSaver:
    def save(self, report):  # receive a report object and save it
        data = report.build()  # build the report data first
        print(f"Saving report: {data}")  # print the saved data

class ReportEmailer:
    def email(self, report):  # receive a report object and send it by email
        data = report.build()  # build the report data first
        print(f"Emailing report: {data}")  # print the email message

#Create objects and run the example
report = Report("Quarterly Report", "2026-07-18")  # create a report
ReportSaver().save(report)  # save the report
ReportEmailer().email(report)  # email the report

#2.  Refactor to OCP. Replace an if/elif that prints a shape's area by shape type with a small class hierarchy and one method.
#Wrong example (this works, but it uses a long if/elif chain and is hard to extend)
class ShapeOld:
    def __init__(self, kind, value):  # initialize the shape with its type and size
        self.kind = kind  # store the shape type
        self.value = value  # store the size value

    def area(self):  # calculate the area based on shape type
        if self.kind == "circle":  # if the shape is a circle
            return 3.14 * self.value * self.value  # compute circle area
        elif self.kind == "square":  # if the shape is a square
            return self.value * self.value  # compute square area
        else:  # otherwise treat it as a triangle
            return self.value * self.value * 0.5  # compute triangle area

#Better example (this follows OCP because new shapes can be added without changing the main logic)
class Shape:
    def area(self):  # base method that subclasses must implement
        raise NotImplementedError("Subclasses must implement area()")  # raise an error if not implemented

class Circle(Shape):
    def __init__(self, radius):  # initialize a circle with a radius
        self.radius = radius  # store the radius

    def area(self):  # calculate circle area
        return 3.14 * self.radius * self.radius  # formula for circle area

class Square(Shape):
    def __init__(self, side):  # initialize a square with one side
        self.side = side  # store the side length

    def area(self):  # calculate square area
        return self.side * self.side  # formula for square area

class Triangle(Shape):
    def __init__(self, base, height):  # initialize a triangle with base and height
        self.base = base  # store base
        self.height = height  # store height

    def area(self):  # calculate triangle area
        return 0.5 * self.base * self.height  # formula for triangle area

#Create objects and print their areas
circle = Circle(5)  # create a circle object
square = Square(4)  # create a square object
triangle = Triangle(4, 6)  # create a triangle object
print(circle.area())  # print the circle area
print(square.area())  # print the square area
print(triangle.area())  # print the triangle area

#3.  Write a Singleton. Build an AppSettings Singleton holding a currency ("ETB") and confirm two instances are the same object.
#Wrong example (this works, but it creates separate objects each time)
class AppSettingsWrong:
    def __init__(self):  # initialize a settings object
        self.currency = "ETB"  # set the default currency

#Better example (this follows the Singleton pattern because only one object is created)
class AppSettings:
    _instance = None  # class variable that stores the single instance

    def __new__(cls):  # __new__ runs before __init__ and controls object creation
        if cls._instance is None:  # if no instance exists yet
            cls._instance = super().__new__(cls)  # create the object once
            cls._instance.currency = "ETB"  # set the currency on that one object
        return cls._instance  # return the same object every time

#Create two references and compare them
settings1 = AppSettings()  # first instance
settings2 = AppSettings()  # second instance
print(settings1 is settings2)  # True means both variables point to the same object
print(settings1.currency)  # print the stored currency

#4.  Write a Factory. Create a ShapeFactory.create(kind) that returns a Circle, Square, or Triangle
#The factory pattern hides the creation logic and gives one simple place to create objects.
class ShapeFactory:
    @staticmethod
    def create(kind):  # receive the shape kind as a string
        if kind == "circle":  # if the user wants a circle
            return Circle(3)  # return a circle object
        if kind == "square":  # if the user wants a square
            return Square(4)  # return a square object
        if kind == "triangle":  # if the user wants a triangle
            return Triangle(4, 5)  # return a triangle object
        raise ValueError("Unknown shape type")  # raise an error for unknown input

#Create objects through the factory
shape1 = ShapeFactory.create("circle")  # create a circle through the factory
shape2 = ShapeFactory.create("square")  # create a square through the factory
shape3 = ShapeFactory.create("triangle")  # create a triangle through the factory
print(shape1.area())  # print the area of the factory-created circle
print(shape2.area())  # print the area of the factory-created square
print(shape3.area())  # print the area of the factory-created triangle

#5.Write an Observer pair. Make a NewsAgency subject and two subscriber classes that print when notified.