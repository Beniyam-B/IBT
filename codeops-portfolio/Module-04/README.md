# Module 4: Backend Track (.NET with C#)

| Day | Folder | What it holds |
|---|---|---|
| 51 | `Day51-Backend-Fundamentals/` | Endpoint table, network trace, and a tiny first server (`FirstServer`) |
| 52 | `Day52-NET-Track-Setup/` | `AddisEats.TopUp`: the in-class TeleBirr calculator. `AddisEats.TopUp.Five`: the homework extension |

## Run Day 51
```bash
cd Day51-Backend-Fundamentals/FirstServer
dotnet run --urls http://localhost:5000
```

## Run Day 52
```bash
cd Day52-NET-Track-Setup/AddisEats.TopUp
dotnet run
```
Type a name, a network (Ethio Telecom or Safaricom) and an amount. Amounts that are not numbers, are zero or negative, or are above 5,000 ETB are rejected.

The five-customer version:
```bash
cd Day52-NET-Track-Setup/AddisEats.TopUp.Five
dotnet run
```
