class Account:
    def __init__(self, owner, account_number, balance):  # Create an account object with owner, number, and initial balance
        self.owner = owner  # Store the account owner name
        self.account_number = account_number  # Store the account number
        self.__balance = balance  # Store the balance privately inside the object
        self._observers = []  # Create an empty list to hold observer objects

    @property  # Define a property so balance can be read safely
    def balance(self):  # Create a method that returns the private balance
        return self.__balance  # Return the stored balance value

    def deposit(self, amount):  # Define a method to add money to the account
        if amount <= 0:  # Check whether the deposit amount is valid
            raise ValueError("You can't deposit a negative amount.")  # Stop the method if the amount is invalid
        self.__balance += amount  # Increase the private balance by the deposit amount
        self._notify(f"{amount} ETB deposited to account {self.account_number}")  # Send a message to all observers
        print(f"You have deposited {amount} ETB to your account.")  # Print a success message

    def withdraw(self, amount):  # Define a method to remove money from the account
        if self.__balance - amount < 0:  # Check whether the withdrawal would make the balance negative
            raise ValueError("You don't have enough balance to withdraw.")  # Stop the method if balance is too low
        self.__balance -= amount  # Reduce the balance by the withdrawal amount
        self._notify(f"{amount} ETB withdrawn from account {self.account_number}")  # Send a message to all observers
        print(f"You have withdrawn {amount} ETB from your account.")  # Print a success message

    def subscribe(self, observer):  # Define a method to add an observer to the account
        self._observers.append(observer)  # Add the observer object to the list

    def _notify(self, message):  # Define a method to inform observers about an event
        for observer in self._observers:  # Loop through each observer in the list
            observer.update(message)  # Call the observer's update method with the message

    def statement(self):  # Define a method to print an account statement
        print(f"Dear customer {self.owner}, your account number is {self.account_number} and your balance is {self.__balance} ETB.")  # Print account details


class SavingsAccount(Account):  # Create a savings account class that inherits from Account
    def __init__(self, owner, account_number, balance=0):  # Initialize a savings account with owner, number, and balance
        super().__init__(owner, account_number, balance)  # Call the parent class initializer
        config = BankConfig()  # Read the singleton bank configuration object
        self.rate = config.interest_rate  # Set the interest rate from the singleton config

    def add_interest(self):  # Define a method to add interest to the account
        interest = self.balance * self.rate  # Calculate the interest amount
        self.deposit(interest)  # Deposit the interest into the account

    def statement(self):  # Define a method to print the savings account statement
        print(f"Savings Account: {self.owner}, account number {self.account_number}, balance {self.balance} ETB.")  # Print savings account details


class CurrentAccount(Account):  # Create a current account class that inherits from Account
    def __init__(self, owner, account_number, balance=0):  # Initialize a current account with owner, number, and balance
        super().__init__(owner, account_number, balance)  # Call the parent class initializer
        config = BankConfig()  # Read the singleton bank configuration object
        self.overdraft_limit = config.overdraft_limit  # Set the overdraft limit from the singleton config

    def withdraw(self, amount):  # Override withdraw so current accounts can use an overdraft limit
        if self.balance - amount < -self.overdraft_limit:  # Check whether the withdrawal exceeds the allowed overdraft limit
            raise ValueError("You don't have enough balance to withdraw.")  # Stop if the overdraft limit is exceeded
        self._Account__balance -= amount  # Reduce the balance directly because it is a private attribute
        self._notify(f"{amount} ETB withdrawn from account {self.account_number}")  # Notify observers after a withdrawal
        print(f"You have withdrawn {amount} ETB from your account.")  # Print a success message

    def statement(self):  # Define a method to print the current account statement
        print(f"Current Account: {self.owner}, account number {self.account_number}, balance {self.balance} ETB.")  # Print current account details


class BankConfig:  # Create the singleton class that stores shared bank settings
    _instance = None  # Create a class-level variable that stores the one instance

    def __new__(cls):  # Override __new__ so only one object is created
        if cls._instance is None:  # Check whether an instance already exists
            cls._instance = super().__new__(cls)  # Create the object only once
            cls._instance.interest_rate = 0.05  # Store the default savings interest rate
            cls._instance.overdraft_limit = 1000  # Store the default overdraft limit
        return cls._instance  # Return the same object every time


class SMSAlert:  # Create an observer class that sends a text alert message
    def update(self, message):  # Define the method required by the observer pattern
        print(f"[SMS Alert] {message}")  # Print a message in SMS format


class AuditLog:  # Create an observer class that writes to an audit log
    def update(self, message):  # Define the method required by the observer pattern
        print(f"[Audit Log] {message}")  # Print a message in audit-log format


class AccountFactory:  # Create a factory class to build account objects by type
    @staticmethod  # Make the method callable without creating an instance
    def create(kind, owner, number, balance=0):  # Define a method that creates an account based on the kind input
        if kind.lower() == "savings":  # Check whether the requested account type is savings
            return SavingsAccount(owner, number, balance)  # Create and return a savings account
        if kind.lower() == "current":  # Check whether the requested account type is current
            return CurrentAccount(owner, number, balance)  # Create and return a current account
        raise ValueError("Unknown account type")  # Raise an error if the type is not recognized


account = AccountFactory.create("savings", "Abebe", "SAV-001", 1000)  # Create a savings account through the factory
account.subscribe(SMSAlert())  # Add an SMS observer to the account
account.subscribe(AuditLog())  # Add an audit observer to the account
account.deposit(200)  # Deposit money and notify observers
account.withdraw(150)  # Withdraw money and notify observers
account.add_interest()  # Add interest to the savings account
account.statement()  # Print the final account statement

