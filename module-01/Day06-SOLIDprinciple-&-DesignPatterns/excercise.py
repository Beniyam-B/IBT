class Account:
    def __init__(self, owner, account_number, balance):
        self.owner = owner
        self.account_number = account_number
        self.__balance = balance
        self._observers = []

    @property
    def balance(self):
        return self.__balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("You can't deposit a negative amount.")
        self.__balance += amount
        self._notify(f"{amount} ETB deposited to account {self.account_number}")
        print(f"You have deposited {amount} ETB to your account.")

    def withdraw(self, amount):
        if self.__balance - amount < 0:
            raise ValueError("You don't have enough balance to withdraw.")
        self.__balance -= amount
        self._notify(f"{amount} ETB withdrawn from account {self.account_number}")
        print(f"You have withdrawn {amount} ETB from your account.")

    def subscribe(self, observer):
        self._observers.append(observer)

    def _notify(self, message):
        for observer in self._observers:
            observer.update(message)

    def statement(self):
        print(f"Dear customer {self.owner}, your account number is {self.account_number} and your balance is {self.__balance} ETB.")


class SavingsAccount(Account):
    def __init__(self, owner, account_number, balance=0):
        super().__init__(owner, account_number, balance)
        config = BankConfig()
        self.rate = config.interest_rate

    def add_interest(self):
        interest = self.balance * self.rate
        self.deposit(interest)

    def statement(self):
        print(f"Savings Account: {self.owner}, account number {self.account_number}, balance {self.balance} ETB.")


class CurrentAccount(Account):
    def __init__(self, owner, account_number, balance=0):
        super().__init__(owner, account_number, balance)
        config = BankConfig()
        self.overdraft_limit = config.overdraft_limit

    def withdraw(self, amount):
        if self.balance - amount < -self.overdraft_limit:
            raise ValueError("You don't have enough balance to withdraw.")
        self._Account__balance -= amount
        self._notify(f"{amount} ETB withdrawn from account {self.account_number}")
        print(f"You have withdrawn {amount} ETB from your account.")

    def statement(self):
        print(f"Current Account: {self.owner}, account number {self.account_number}, balance {self.balance} ETB.")


# Singleton pattern: one shared configuration object
class BankConfig:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.interest_rate = 0.05
            cls._instance.overdraft_limit = 1000
        return cls._instance


# Observer pattern: notify objects when the account changes
class SMSAlert:
    def update(self, message):
        print(f"[SMS Alert] {message}")


class AuditLog:
    def update(self, message):
        print(f"[Audit Log] {message}")


# Factory pattern: create accounts without exposing the creation logic
class AccountFactory:
    @staticmethod
    def create(kind, owner, number, balance=0):
        if kind.lower() == "savings":
            return SavingsAccount(owner, number, balance)
        if kind.lower() == "current":
            return CurrentAccount(owner, number, balance)
        raise ValueError("Unknown account type")


account = AccountFactory.create("savings", "Abebe", "SAV-001", 1000)
account.subscribe(SMSAlert())
account.subscribe(AuditLog())
account.deposit(200)
account.withdraw(150)
account.add_interest()
account.statement()

