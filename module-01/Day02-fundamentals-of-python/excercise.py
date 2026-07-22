customers =[ ("Abebe",1200),("Alemitu",3000),("Dejene",800),("Kebebush",400),("kebede",1500)]

def tier(balance):
    if balance >= 1000:
        return "premium"
    elif balance >= 500:
        return "Standard"
    else:
        return "Basic"
basic = 0
standard = 0
premium = 0

for coustomer , balance in customers:
     
     coustomer_tier = tier(balance)
    
     print (f"coustomer:{coustomer} is {coustomer_tier} customer Balance: {balance} ETB\n")
     if coustomer_tier == "Basic":
         basic +=1
     elif coustomer_tier == "Premium":
         premium += 1
     else:
         standard += 1

print(f"basic users number is : {basic}")
print (f"standard users number is : {standard}")
print (f"premium users number is : {premium}")