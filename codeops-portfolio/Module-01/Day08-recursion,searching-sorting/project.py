# Account class: represents a basic bank account with balance, history, and observers
class Account:
    def __init__(self, owner, account_number, balance):
        self.owner = owner  # stores the account owner name
        self.account_number = account_number  # stores the unique account ID
        self.__balance = balance  # private balance for encapsulation
        self._observers = []  # list of observers for notifications
        self.history = []  # stores transaction records for undo support
        self._registry = None  # links the account to its registry

    @property  # read-only access to the private balance
    def balance(self):
        return self.__balance

    def _record_transaction(self, action, amount):  # saves each action in history and undo stack
        record = {"action": action, "amount": amount}
        self.history.append(record)
        if self._registry is not None:
            self._registry._undo_stack.append((self, record))

    def deposit(self, amount):  # adds money to the account
        if amount <= 0:
            raise ValueError("You can't deposit a negative amount.")
        self.__balance += amount
        self._record_transaction("deposit", amount)
        self._notify(f"{amount} ETB deposited to account {self.account_number}")
        print(f"You have deposited {amount} ETB to your account.")

    def withdraw(self, amount):  # removes money from the account
        if self.__balance - amount < 0:
            raise ValueError("You don't have enough balance to withdraw.")
        self.__balance -= amount
        self._record_transaction("withdraw", amount)
        self._notify(f"{amount} ETB withdrawn from account {self.account_number}")
        print(f"You have withdrawn {amount} ETB from your account.")

    def subscribe(self, observer):  # adds an observer to receive account notifications
        self._observers.append(observer)

    def _notify(self, message):  # sends update messages to all subscribed observers
        for observer in self._observers:
            observer.update(message)

    def statement(self):  # prints the account owner's statement
        print(f"Dear customer {self.owner}, your account number is {self.account_number} and your balance is {self.__balance} ETB.")


# SavingsAccount class: extends Account with interest support
class SavingsAccount(Account):
    def __init__(self, owner, account_number, balance=0):
        super().__init__(owner, account_number, balance)
        config = BankConfig()  # gets shared singleton configuration
        self.rate = config.interest_rate  # sets the savings interest rate

    def add_interest(self):  # calculates and deposits interest into the account
        interest = self.balance * self.rate
        self.deposit(interest)

    def statement(self):  # prints a savings-specific statement
        print(f"Savings Account: {self.owner}, account number {self.account_number}, balance {self.balance} ETB.")


# CurrentAccount class: extends Account with overdraft support
class CurrentAccount(Account):
    def __init__(self, owner, account_number, balance=0):
        super().__init__(owner, account_number, balance)
        config = BankConfig()  # gets shared singleton configuration
        self.overdraft_limit = config.overdraft_limit  # sets the overdraft maximum

    def withdraw(self, amount):  # allows withdrawing up to the overdraft limit
        if self.balance - amount < -self.overdraft_limit:
            raise ValueError("You don't have enough balance to withdraw.")
        self._Account__balance -= amount
        self._record_transaction("withdraw", amount)
        self._notify(f"{amount} ETB withdrawn from account {self.account_number}")
        print(f"You have withdrawn {amount} ETB from your account.")

    def statement(self):  # prints a current-account statement
        print(f"Current Account: {self.owner}, account number {self.account_number}, balance {self.balance} ETB.")


# BankConfig class: implements the singleton pattern for shared bank settings
class BankConfig:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.interest_rate = 0.05  # fixed interest rate for savings accounts
            cls._instance.overdraft_limit = 1000  # fixed overdraft limit for current accounts
        return cls._instance


# SMSAlert class: observer that receives SMS notifications
class SMSAlert:
    def update(self, message):
        print(f"[SMS Alert] {message}")


# AuditLog class: observer that records account activity
class AuditLog:
    def update(self, message):
        print(f"[Audit Log] {message}")


# AccountFactory class: creates the correct account type using a factory method
class AccountFactory:
    @staticmethod
    def create(kind, owner, number, balance=0):
        if kind.lower() == "savings":
            return SavingsAccount(owner, number, balance)
        if kind.lower() == "current":
            return CurrentAccount(owner, number, balance)
        raise ValueError("Unknown account type")


# AccountRegistry class: keeps all accounts in one registry and supports undo operations
class AccountRegistry:
    def __init__(self):
        self.by_number = {}  # fast lookup by account number
        self.order = []      # keeps insertion order for list_all
        self._undo_stack = []  # tracks undo actions in LIFO order

    def add(self, account):  # registers a new account in the dictionary and order list
        if account.account_number in self.by_number:
            raise ValueError("Account number already exists")
        self.by_number[account.account_number] = account
        account._registry = self
        self.order.append(account.account_number)

    def find(self, account_number):  # returns the account by number or None
        return self.by_number.get(account_number)

    def list_all(self):  # returns accounts in registration order
        return [self.by_number[number] for number in self.order]

    def undo_last(self):  # rolls back the most recent transaction if available
        if not self._undo_stack:
            return None

        account, _ = self._undo_stack.pop()
        if not account.history:
            return None

        last_record = account.history.pop()
        if last_record["action"] == "deposit":
            account._Account__balance -= last_record["amount"]
        else:
            account._Account__balance += last_record["amount"]

        return account