class Account:
    def __init__(self , owner ,account_number , balance=0):
        self.owner = owner
        self.account_number = account_number
        self.__balance = balance
    @property
    def balance(self):
        return self.__balance
    @balance.getter
    def balance(self):
        return self.__balance
    def deposit(self,amount):
        if amount <= 0 :
            raise ValueError("You can't deposit a negative amount.")
        self.__balance += amount
        print(f"You have deposited {amount} ETB to your account.")
    def withdraw(self,amount):
        if self.__balance - amount < 0:
            raise ValueError("You don't have enough balance to withdraw.")
        self.__balance -= amount
        print(f"You have withdrawn {amount} ETB from your account.")
    def statment(self ):
        print(f"Dear coustomer {self.owner}, your account number is {self.account_number} and your balance is {self.__balance} ETB.")

dagmawi = Account("Dagmawi","AB001",0)
dagmawi.deposit(500)
dagmawi.withdraw(500)
dagmawi.statment()
dagmawi.balance
almaz =Account("Almaz","AB002",0)
almaz.deposit(5000)
almaz.withdraw(3040)
almaz.statment()
almaz.balance