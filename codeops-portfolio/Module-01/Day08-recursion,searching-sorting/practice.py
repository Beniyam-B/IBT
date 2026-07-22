#taking vALUE FROM USER AND SAVING IT TO LIST
class Accountregistry:
     def __init__(self):
          self.Accounts = []
     def AccFirstName(self):
          Name = input("Enter Your name: ")
          self.Accounts.append(Name)
     def ListNames(self):
          print(f"new user {self.Accounts}")
     
    

registry = Accountregistry()
registry.AccFirstName()
registry.ListNames()













#Linear search
def linear_search(list , value):
     for i, x in enumerates(list): #enumerates is a function that returns the index and value of the list
          if x == value :
               return x 
          return -1
     












#BINARY SEARCH with try counter
