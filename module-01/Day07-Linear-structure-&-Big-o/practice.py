# Linear Structures & Big-O
# Big-O & Complexity
# Big-O describes how the running time (or space) of an algorithm grows as the size
# of the input increases. We commonly analyze worst-case complexity, although
# best-case and average-case are also useful in some contexts.
# e.g.: O(2n + 5) simplifies to O(n) because constant factors are ignored.

# Common complexity classes
# O(1): constant — time does not grow with input size.
# O(log n): logarithmic — grows slowly; e.g., binary search halves the search
#     space each step.
# O(n): linear — grows proportionally with input size; e.g., a single loop
#     over the data.
# O(n log n): linearithmic — grows faster than O(n) but slower than O(n^2);
#     typical for efficient sorting algorithms.
# O(n^2): quadratic — grows proportional to the square of n; typical for
#     nested loops or pairwise comparisons.

# How to reason about Big-O
first = accounts[0]          # O(1) — a single indexing operation

for acc in accounts:
     print(acc.owner)       # O(n) — processes each account once


for a in acocunts:
     for b in accounts:
          if a.owner == b.owner:    # O(n^2) — compares each pair of accounts




# Arrays and dictionaries (hashmaps)
# A Python list stores items in sequence at integer indices.
# - Indexing (access by position) is O(1).
# - Appending is amortized O(1) (the list resizes occasionally).
# - Inserting or deleting at the front or middle is O(n) because items must shift.
# - Membership test ('x in list') is O(n).
# Example:
accs = [acc0, acc1, acc2]
accs[0]                   # O(1) — direct index access
accs.append(acc3)         # amortized O(1) — append at end
accs.insert(0, acc4)      # O(n) — insert at front shifts elements
x in accs                 # O(n) — linear search

# A hashmap (Python dict) maps keys to values using a hash table.
# - Average-case complexity for lookup, insert, and delete is O(1).
# - In rare worst-case collision scenarios, operations can be O(n), but that
#   is uncommon with a good hash function and Python's implementation.
# - 'key in dict' is O(1) average.
# Example:
accs = {"CBE-1": acc1, "CBE_2": acc2, "CBE-3": acc3}
accs["CBE-1"]             # O(1) average — lookup by key
accs["CBE-4"] = acc4      # O(1) average — insert/update by key
"CBE-1" in accs           # O(1) average — membership test for key
del accs["CBE-1"]         # O(1) average — delete by key

# Arrays vs dicts
# - Lists: index-based access O(1); search/remove O(n) (unless removing last).
# - Dicts: key-based access O(1) average for lookup, insert, and delete.

# Linked Lists
# A linked list stores items in nodes that point to the next node. Nodes are
# not stored contiguously; traversal starts at the head and follows pointers.
# Singly linked lists point forward only; doubly linked lists also point back.
# Example node class (singly linked):
class Node:
     def __init__(self,data):
          self.data = data
          self.next = None    # points to the next node
     
head = Node(acc1)
head.next = Node(acc2)     # acc1 -> acc2 -> None

# Array vs linked list
# - Lists use contiguous memory and support O(1) indexed access.
# - Linked lists use nodes with pointers; insertion/removal at a known node is
#   O(1), but searching for a value is O(n).
# - Linked lists require extra memory per node for the pointer(s).

# Stack and Queue
# - Stack: LIFO (last in, first out)
# - Queue: FIFO (first in, first out)
# Stack and queue operations shown below are O(1) (amortized for list append/pop).
# Example stack:
stack = []
stack.append(1)      # push: amortized O(1)
stack.pop()          # pop: O(1)

# Example queue using deque:
from collections import deque
q=deque()
q.append(1)          # enqueue: O(1)
q.popleft()          # dequeue: O(1)



#excercises
#1, Name the Big-O. For five short snippets (a list index, a single loop, a nested loop, a dict lookup, a binary search), write the Big-O of each as a comment and explain why.

list = [acc1, acc2, acc3, acc4, acc5]
list[0]  # O(1) — direct index access, constant time
# single loop


while i < 5:
     print(f"number {i} is {i*i}")         # O(n) — single loop runs proportional to n

     i += 1

# nested loop
for i in range(5):
     for j in range(5):
          print(f"number {i} is {i*i}")   # O(n^2) — nested loops do pairwise work

# dict lookup
accounts = {"CBE-1": acc1, "CBE_2": acc2, "CBE-3": acc3}
accounts["CBE-1"]             # O(1) average — lookup by key in a hash table
#binary search

def binary_search(arr, value):
    counter = 0
    low = 0
    high = len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        counter += 1
        if arr[mid] == value:
            print(f"try number : {counter}")
            return f"found value {value} at index {mid}"
        elif arr[mid] < value:
            low = mid + 1
        else:
            high = mid - 1
    print(f"try number : {counter}")
    return None

values = [1, 3, 5, 6, 7]
print(binary_search(values, 6))             #has a big-o of O(logn) because it is a binary search



#2.  List vs. dict lookup. Build a list and a dict of 100,000 fake account numbers. Time how long it takes to find one near the end in each.

#list lookup
accounts = []
for acc in range (100000):
     accounts.append(f"CBE-{acc}")

accounts[99999] #takes almost no time because we are using indexing and it has a big-o of O(1)

#dict lookup
accounts = {}
for acc in range (100000):
     accounts[f"CBE-{acc} =" f"CBE-{acc}"]

accounts["CBE-100000"] #this one takes more time than the list lookup while having the same big-o of O(1) because we use keys and it needs to look up the key in the dictionary


#3 Build a stack. Write a Stack class with push, pop, and peek, and use it to reverse a list of names

class Stack:
     def __init__(self):
          self.stack =[]
     def push(self,value):
          self.stack.append(value)
     def pop(self):
          return self.stack.pop()
     def peek(self):
          return self.stack[-1]
     
stack = Stack()
stack.push(Beniyam)
stack.push(Abebe)
stack.push(Almaz)
stack.peek()
stack.pop()
stack.peek()


#4. Build a queue. Use collections.deque to model a bank service line: enqueue five customers,then serve them in order. 

from collections import deque

class Bankservice:
     def __init__(self):
          self.queue = deque()
     def enqueue(self,customer):
          self.queue.append(customer)
     def serve(self):
          return self.queue.popleft()
     
bank = Bankservice()
bank.enqueue(Beniyam)
bank.enqueue(Abebe)
bank.enqueue(Almaz)
bank.serve()
bank.serve()

#5.  Singly linked list. Implement a Node and a LinkedList with push_front and a print_all() that walks the chain.

class Node:
     def __init__(self,data):
          self.data = data
          self.next = None
     def push_front(self,data):
          new_node = Node(data)
          new_node.next = self.next
          self.next = new_node
     def print_all(self):
          current_node = self.next
          while current_node:
               print(current_node.data)
               current_node = current_node.next
          
linked_list = Node(acc-1)
linked_list.push_front(acc-2)
linked_list.push_front(acc-3)
linked_list.print_all()


























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












          
          







            


        