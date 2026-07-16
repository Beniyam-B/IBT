from account import Account


class SavingsAccount(Account):
    def __init__(self, owner, account_number, balance=0, rate=0.05):
        super().__init__(owner, account_number, balance)
        self.rate = rate

    def add_interest(self):
        interest = self.balance * self.rate
        self.deposit(interest)

    def statement(self):
        print(
            f"Savings Account: {self.owner}, account number {self.account_number}, "
            f"balance {self.balance} ETB."
        )


class CurrentAccount(Account):
    def __init__(self, owner, account_number, balance=0, overdraft_limit=0):
        super().__init__(owner, account_number, balance)
        self.overdraft_limit = overdraft_limit

    def withdraw(self, amount):
        if self.balance - amount < -self.overdraft_limit:
            raise ValueError("You don't have enough balance to withdraw.")
        self._Account__balance -= amount
        print(f"You have withdrawn {amount} ETB from your account.")

    def statement(self):
        print(
            f"Current Account: {self.owner}, account number {self.account_number}, "
            f"balance {self.balance} ETB."
        )


# Example usage
savings = SavingsAccount("Dagmawi", "SA001", 1000, 0.1)
savings.add_interest()
savings.statement()

current = CurrentAccount("Almaz", "CA001", 500, overdraft_limit=100)
current.withdraw(400)
current.statement()