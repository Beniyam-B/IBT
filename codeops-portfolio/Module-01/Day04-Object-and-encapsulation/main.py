class Account:
    def __init__(self , owner ,account_no , balance):
        self.owner = owner
        self.account_no = account_no
        self.__balance = balance
    @property
    def balance(self):
        return self.__balance
    @balance.setter
    def balance(self,amount):
        if amount <=0:
            print("You can't set a negative balance.")
            return
        self.__balance = amount
    def deposit(self,amount):
        if amount <=0:
            print("You can't deposit a negative amount.")
            return
        self.balance += amount
        print(f"You have deposited {amount} ETB to your account.")
    def withdraw(self,amount):
        if self.balance - amount < 0:
            print("You don't have enough balance to withdraw.")
            return
        self.balance -= amount
        print(f"You have withdrawn {amount} ETB from your account.")

dagmawi = Account("Dagmawi","AB001",0)
dagmawi.balance(2500)
dagmawi.deposit(500)
dagmawi.withdraw(500)
almaz =Account("Almaz","AB002",0)
almaz.balance(10000)
almaz.deposit(5000)
almaz.withdraw(3040)


