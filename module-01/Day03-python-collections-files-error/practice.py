#Day03 
#Lists and tuples
#lists is an ordered placment of values that are changable and also are identified by their index starting from 0 to last -1 they are stored in sqare brackates and assigned names which in combination with the index is used to acess and operate on this lists
#you can also use range of index to affect more than one value in the list
#eg
names = ["Abebe" , "Almaz" , "Bereket" ,"Chaltu"] #this is a list that has a variable calles 'names' which its values are automatcally assigned index used to acess the values 
names[0] #this gives you Abebe
names[-1] #this gives you Chaltu this  is indexing
names[1:3] #this gives you Almaz , Bereket  this is called slicing

#to identify the number of elements in the list we use len() operator
#eg
len(names) # output: 4
# some methods that can affect lsits are 
#.append(x) this adds to the value in the list at the end
total =[]
for prices in [100 , 200 , 400]:
    total.append(prices * 0.20) #20% tax
#.insert(i,x) inserts value x at position i
 #.remove(x) removes the first item that is x
 #.pop() removes and returns last item
 #.sort() sorts the lsit in order (smallest first )
 #.reverse() reverses the order in place
#we can use loops with list to get an action to the whole vlaues 


#tuples are fixed lists ,after creation we cannot change them we use them for values that does not change and is put inside brackates '()'
location = (9.0385 , 0.4987)
#we can separate the latitutde and logtiude using
lat , lon = location



#dictionaries and sets 
# dictionary maps a key to a value this allows us to search for a vlaues by name which is a key insted of location (index) .
# written as: variable = { 
# "key" : value}

#eg 
students = {
    "name": "Ben",
    "grade": 3.0,
    "department": "computer science"
}

# to acess this values 
students["name"]  # Ben

#to update value
students["grade"] = 2.75  #changes 3.0 to 2.75 
# safley acess values to not get error if the values are not found it needs to show the default value
students.get("key" , "default") #default is shown if the key does not exist

#iterating a dictionary (using loops , other emthods to acess )
#eg
groceries = {"tomatoe" , 50, "onions" , 135, "eggs" , 25}

for price, grocerie in groceries.price():
    print(f"{price}: {grocerie} ETB")


groceries.keys() #the grocerie name
groceries.values() #the prices
"onions" in groceries #True - test if the values and keys exist


#Sets holds unordered , unique items , good to remove duplcates, good to test if values exist 
#eg

nums = {1,2,2,6,4,4}
unique = set(nums)   #(1,2,4,6)


a = {"abebe" , "kebede"}
b = {"samuel" ,"kebede"}

a | b # collects the values together {"abebe" , "kebede" , "samuel" }
a & b # intersection {"kebede"}
a - b # difference {'abebe}




#comprehensions and modules
#comprehension builds a collection in a single, readable line , combines loop and append

#eg
numbers = [10 ,20 ,60]
#change every item
add_amount =[n + 5 for n in numbers ]  # for loop used inside the csess method of a list (comprhension)  
# new value which is in add_amount = [15 ,25 ,65]
#can be also used to filter with condition 
small = [n for n in numbers if n<15]  #samll is now small=[20,60]
#this always have the same way of being written [minimization ...]
#you just use '{}' for dictonary 
minimized = {num: num - 5 for num in numbers}

