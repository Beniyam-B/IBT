customers =[ ("Abebe",1200),("Alemitu",3000),("Dejene",800),("Kebebush",400),("kebede",1500)]

def tier(balance):
    if balance >= 1000:
        return "premium"
    elif balance >= 500:
        return "Standard"
    else:
        return "Basic"
for name, balance in customers:
    print(f"{name} has a balance of {balance} ETB and is a {tier(balance)} customer.")