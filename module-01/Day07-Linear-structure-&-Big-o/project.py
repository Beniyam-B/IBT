class Account:
    def __init__(self, owner, account_number, balance):
        self.owner = owner
        self.account_number = account_number
        self.__balance = balance
        self._observers = []
        self.history = []  # Stores transaction records for undo support
        self._registry = None  # Links the account to its registry

    @property
    def balance(self):
        return self.__balance

    def _record_transaction(self, action, amount):
        record = {"action": action, "amount": amount}
        self.history.append(record)
        if self._registry is not None:
            self._registry._undo_stack.append((self, record))

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("You can't deposit a negative amount.")
        self.__balance += amount
        self._record_transaction("deposit", amount)
        self._notify(f"{amount} ETB deposited to account {self.account_number}")
        print(f"You have deposited {amount} ETB to your account.")

    def withdraw(self, amount):
        if self.__balance - amount < 0:
            raise ValueError("You don't have enough balance to withdraw.")
        self.__balance -= amount
        self._record_transaction("withdraw", amount)
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
        self._record_transaction("withdraw", amount)
        self._notify(f"{amount} ETB withdrawn from account {self.account_number}")
        print(f"You have withdrawn {amount} ETB from your account.")

    def statement(self):
        print(f"Current Account: {self.owner}, account number {self.account_number}, balance {self.balance} ETB.")


class BankConfig:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.interest_rate = 0.05
            cls._instance.overdraft_limit = 1000
        return cls._instance


class SMSAlert:
    def update(self, message):
        print(f"[SMS Alert] {message}")


class AuditLog:
    def update(self, message):
        print(f"[Audit Log] {message}")


class AccountFactory:
    @staticmethod
    def create(kind, owner, number, balance=0):
        if kind.lower() == "savings":
            return SavingsAccount(owner, number, balance)
        if kind.lower() == "current":
            return CurrentAccount(owner, number, balance)
        raise ValueError("Unknown account type")


class AccountRegistry:
    def __init__(self):
        self.by_number = {}  # Fast lookup by account number
        self.order = []      # Keeps insertion order for list_all
        self._undo_stack = []  # Tracks undo actions in LIFO order

    def add(self, account):
        if account.account_number in self.by_number:
            raise ValueError("Account number already exists")
        self.by_number[account.account_number] = account
        account._registry = self
        self.order.append(account.account_number)

    def find(self, account_number):
        return self.by_number.get(account_number)

    def list_all(self):
        return [self.by_number[number] for number in self.order]

    def undo_last(self):
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


if __name__ == "__main__":
    registry = AccountRegistry()
    account = AccountFactory.create("savings", "Almaz", "CBE-1", 1000)
    registry.add(account)

    account.deposit(50)
    print("Balance after deposit:", account.balance)

    registry.undo_last()
    print("Balance after undo:", account.balance)
    print("Accounts in order:", [acc.account_number for acc in registry.list_all()])
