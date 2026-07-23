# #recursion
# # is a when a function calls itself to solve a smaller version of the same problem
# # it needs to have two parts 
# # 1. base case: when the problem is small enough to be solved directly
# # 2. recursive case: when the problem is not small enough to be solved directly, but can be solved by solving a smaller version of the problem
# # #example of recursion
# # def factorial(n):
# #     if n == 0:
# #         return 1
# #     else:
# #         return n * factorial(n-1)

# # # this is the base case, when n is 0, the factorial is 1
# # print(factorial(0))
# # # this is the recursive case, when n is not 0, the factorial is n times the factorial of n-1
# # print(factorial(5))

# #the call stack
# #the call stack is a data structure that keeps track of the functions that are currently being executed

# #searching
# #linear search: checks every element one by one
# def linear_search(list , value):  # function that searches a list linearly
#      for i, x in enumerates(list): # enumerates returns the index and value of the list
#           if x == value :
#                return x   # returns the matched value
#           return -1   # returns -1 if the value is not found

# #binary search: works on a sorted list by splitting it in half to find the value faster
# def binary_search(list , value):  # function that searches a sorted list using binary search
#      low = 0  # the lower index of the list
#      high = len(list) - 1  # the higher index of the list
#      while low <= high:  # while the lower index is less than or equal to the higher index
#           mid = (low + high) // 2  # find the middle index
#           if list[mid] == value:  # if the middle index is equal to the value
#                return mid  # return the middle index
#           elif list[mid] < value:  # if the middle index is less than the value
#                low = mid + 1  # set the lower index to the middle index + 1
#           else:  # if the middle index is greater than the value
#                high = mid - 1  # set the higher index to the middle index - 1
#      return -1  # return -1 if the value is not found


# #sorting 
# #sorting is the process of arranging the elements of a list in a specific order
# #merge sort: divides the list into two halves, sorts each half recursively, and then merges the sorted halves
# def merge_sort(list):  # function that sorts a list using merge sort
#      if len(list) <= 1:  # if the list has only one element or is empty
#           return list  # return the list
#      else:  # if the list has more than one element
#           mid = len(list) // 2  # find the middle index
#           left_half = merge_sort(list[:mid])  # sort the left half
#           right_half = merge_sort(list[mid:])  # sort the right half
#           return merge(left_half, right_half)  # merge the sorted halves

# #pythons built-in sort function
# list = [5, 2, 8, 3, 9, 4, 6, 1, 7, 0]
# print(list)
# print(sorted(list))

# #two pointers and sliding window
# #walking two indices through a sorted list from both ends, classic use: does any pair of values sum to a taget
# def has_pair(nums, target):       
# # nums is sorted 
#  lo, hi = 0, len(nums) - 1 
#  while lo < hi: 
#   s = nums[lo] + nums[hi] 
#   if s == target: return True 
#   elif s < target: lo += 1  # need a bigger value 
#   else: hi -= 1             
# # need a smaller value 
#  return False 


# #sliding window 
# #sliding window is a technique that allows you to find a pattern in a list by looking at a fixed number of elements at a time
# #keep a moving window over a sequence and update a running total as it slides , adds a new iteem and drops the old -- insted of recomputing each window from scratch one pass o(n)

# #largest sum of any k consecutive deposits 
# def max_window(nums, k): 
#  window = sum(nums[:k]) 
#  best = window 
#  for i in range(k, len(nums)): 
#    window += nums[i] - nums[i - k]   # slide 
#    best = max(best, window) 
#  return best 

#excercises
#1.  Recursive sum. Write a recursive total(nums) that sums a list, and a recursive count_down(n) that prints n down to 1.
nums = [1, 2, 3, 4, 5]
def total(nums):
    if len(nums) == 1:
        return nums[0]
    else:
        return nums[0] + total(nums[1:])
def count_down(n):
    if n == 1:
        return
    else:
        print(n)
        count_down(n-1)  
total = total(nums)
print(f"total = {total}")
count_down(5)

#2.  Binary search. Implement binary_search(items, target) on a sorted list and return the index, or -1. Test it on a sorted list of balances.
list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
def binary_search(items, target):
    low = 0
    high = len(items) - 1
    while low <= high:
        mid = (low + high) // 2
        if items[mid] == target:
            return mid
        elif items[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1
found = binary_search(list, 5)
print(f"target found at index {found}")

#3.  Merge sort. Implement merge_sort(items) and its merge helper. Confirm it matches sorted() on random lists.
random_list = [34,223,55,78,22,6,1,88]
def merge_sort(items):
    if len(items) <= 1:
        return items
    else:
        mid = len(items) // 2
        left_half = merge_sort(items[:mid])
        right_half = merge_sort(items[mid:])
        return merge(left_half, right_half)
def merge(left, right):
    result = []
    while left and right:
        if left[0] < right[0]:
            result.append(left.pop(0))
        else:
            result.append(right.pop(0))
    result.extend(left)
    result.extend(right)
    return result
print(merge_sort(random_list))

#4.  Sort with a key. Given a list of (name, balance) tuples, sort it by balance descending using sorted(key=...).
list_with_names =[('almaz',200),('kebede',400),('abebe',707)]
def sort_by_balance(list_with_names):
    return sorted(list_with_names, key=lambda x: x[1], reverse=True)
print(sort_by_balance(list_with_names))

#5.  Two pointers. Write has_pair(nums, target) for a sorted list, returning whether two values sum to the target.
sorted_list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
def has_pair(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        s = nums[lo] + nums[hi]
        if s == target:
            return True
        elif s < target:
            lo += 1
        else:
            hi -= 1
    return False
target = has_pair(sorted_list, 10)
print(f"does target sum exist? :{target}")



























































































# Taking input from the user and storing it in a list
# class Accountregistry:  # creates a class for storing account names
#      def __init__(self):  # initializes an empty list
#           self.Accounts = []   # creates an empty list to save names
#      def AccFirstName(self):  # takes a name from the user
#           Name = input("Enter Your name: ")
#           self.Accounts.append(Name)   # adds the entered name to the list
#      def ListNames(self):  # prints the saved names
#           print(f"new user {self.Accounts}")   # prints all saved names
     
    

# registry = Accountregistry()
# registry.AccFirstName()
# registry.ListNames()













# Linear search: checks every element one by one
# def linear_search(list , value):  # function that searches a list linearly
#      for i, x in enumerates(list): # enumerates returns the index and value of the list
#           if x == value :
#                return x   # returns the matched value
#           return -1   # returns -1 if the value is not found
     












# Binary search: works on a sorted list by splitting it in half to find the value faster
# This is the main idea of binary search in sorting and searching
