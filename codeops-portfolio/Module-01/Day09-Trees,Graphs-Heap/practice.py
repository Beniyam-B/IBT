# trees
#a tree is a data structure that is used to store hierarchical data
#binary tree search: gives each node a left child and a right child , also keeps them in order  everything on the left is less than everything on the right
#to find a value in a tree, you start at the root and compare the value to the value of the current node
#search , insert and delete are all O(log n) operations when the tree is balanced
#balanced trees are trees that are structured in such a way that the height of the tree is logarithmic in the number of nodes
class Node:
    def __init__(self, value):
        self.value = value
        self.left = None #small values on the left
        self.right = None  #large values on the left


#traversals
# inorder traversal: visits the left subtree, then the current node, then the right subtree
# postorder traversal: visits the left subtree, then the right subtree, then the current node
# preorder traversal: visits the current node, then the left subtree, then the right subtree
def inorder(root):
    if root is None:
        return
    inorder(root.left)
    print(root.value)
    inorder(root.right)
def postorder(root):
    if root is None:
        return
    postorder(root.left)
    postorder(root.right)
    print(root.value)
def preorder(root):
    if root is None:
        return
    print(root.value)
    preorder(root.left)
    preorder(root.right)

#graphs
#a graph is nodes or vertices jined by connections which are called edges , there is no root like trees and any node can connect to any other edges migh be directed and weighted a common way to store one is a adjecent list which is a dictionary that maps vertex to its neghbour.
#eg 
# graph = { 
# "Almaz":  ["Dawit", "Tigist", "Samuel"], 
# "Dawit":  ["Almaz", "Hanna"], 
# "Tigist": ["Almaz", "Samuel"], 
# "Samuel": ["Almaz", "Tigist", "Hanna"], 
# "Hanna":  ["Dawit", "Samuel"], 
# } 
#traversing a graph
# Breadth-first search (BFS) explores all neighbours first, then their neighbours — level by level, using a queue.
#  Depth-first search (DFS) follows one path as far as it goes, then backs up — using recursion or a stack. 

#eg
# from collections import deque 
# def bfs(graph, start): 
#    seen = {start} 
#    q = deque([start]) 
#    while q: 
#      node = q.popleft() 
#      for n in graph[node]: 
#       if n not in seen: 
#         seen.add(n) 
#         q.append(n)
#    return seen

#Heap
#A heap is a binary tree with one rule: every parent is smaller than its children (a min-heap), so the smallest item is always at the root.
#A heap is the engine of a priority queue: "always give me the most urgent item next," regardless of when it arrived. Python's heapq module turns any list into a heap.

# import heapq 
# queue = [] 
# heapq.heappush(queue, (1, "Rent"))     # priority 1 
# heapq.heappush(queue, (5, "Snacks"))   # priority 5 
# heapq.heappush(queue, (2, "Salary"))   # priority 2 
# heapq.heappop(queue)    # (1, "Rent") — smallest first


#excercises
#1.  Build a BST. Write a Node class and an insert(root, value) function. Insert several balances, then print them with an in-order traversal — they should come out sorted. 

# class Node:
#     def __init__(self, value):
#         self.value = value
#         self.left = None
#         self.right = None
# def insert(root, value):
#     if root is None:
#         return Node(value)
#     if value < root.value:
#         root.left = insert(root.left, value)
#     else:
#         root.right = insert(root.right, value)
#     return root
# root = insert(None, 103)
# root = insert(root, 54)
# root = insert(root, 150)
# root = insert(root, 39)

# inorder = inorder(root)
# print(inorder)

#2. Tree depth. Write a recursive height(node) that returns the depth of a binary tree.
# def height(node):
#     if node is None:
#         return 0
#     return 1 + max(height(node.left), height(node.right))


#3.  Graph BFS. Given an adjacency-list graph, implement bfs(graph, start) and return the set of reachable vertices.
# from collections import deque
# def bfs(graph, start):
#     seen = {start}
#     q = deque([start])
#     while q:
#         node = q.popleft()
#         for n in graph[node]:
#             if n not in seen:
#                 seen.add(n)
#                 q.append(n)
#     return seen
# graph_names = {
#     "Almaz": ["Dawit", "Tigist", "Samuel"],
#     "Dawit": ["Almaz", "Hanna"],
#     "Tigist": ["Almaz", "Samuel"],
#     "Samuel": ["Almaz", "Tigist", "Hanna"],
#     "Hanna": ["Dawit", "Samuel"],
# }
# start = "Almaz"
# print(bfs(graph_names, start))
#4. Graph DFS. Implement dfs(graph, start) recursively, and compare the visit order with your BFS.
# from collections import deque
# def dfs(graph, start):
#     seen = {start}
#     q = deque([start])
#     while q:
#         node = q.popleft()
#         for n in graph[node]:
#             if n not in seen:
#                 seen.add(n)
#                 q.append(n)
#     return seen
# graph_names = {
#     "Almaz": ["Dawit", "Tigist", "Samuel"],
#     "Dawit": ["Almaz", "Hanna"],
#     "Tigist": ["Almaz", "Samuel"],
#     "Samuel": ["Almaz", "Tigist", "Hanna"],
#     "Hanna": ["Dawit", "Samuel"],
# }
# start = "Almaz"
# print(dfs(graph_names, start))

#5.  Priority queue. Use heapq to push five (priority, task) tuples in mixed order, then pop them all — they should come out by priority. 
import heapq 
queue = [] 
heapq.heappush(queue, (1, "Rent"))     # priority 1 
heapq.heappush(queue, (5, "Snacks"))   # priority 5 
heapq.heappush(queue, (2, "Salary"))   # priority 2 
heapq.heappop(queue)    # (1, "Rent") — smallest first

w = heapq.heappop(queue)
print(f"Popped {w}")
heapq.heappush(queue, (3, "Water"))   # priority 3