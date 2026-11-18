# Day 54 exercise notes

## Exercise 4: lifetimes (GET /api/v1/health/lifetime)

| Lifetime | Controller vs probe, same call | Call 1 vs call 2 | sameInstance |
|---|---|---|---|
| Transient | different values | changes | false |
| Scoped | identical values | changes | true |
| Singleton | identical values | never changes | true |

Explanation: A transient service is created every time something asks for it, so even two classes in the same request get different objects. A scoped service is created once per request and shared inside it, while a singleton is created once for the whole application and shared by every request.
