# Day 56 notes

## Exercise 1: :int constraints
Every id segment is `{id:int}` (restaurants, restaurants/{id}/menu, menu). GET /api/v1/restaurants/abc returns 404 and not 400: "abc" cannot satisfy the :int constraint, so the router finds no matching endpoint and no action is ever called. Model-binding validation, which is what produces a 400, only runs after an action has been chosen.

## Exercise 2: a route parameter that does not match the method parameter
I renamed the route to `{restaurantId:int}` but left the method as `GetOne(int id)`. It built and ran with no error. GET /api/v1/restaurants/1 returned 404 with "Restaurant 0 does not exist." (id was 0), and GET /api/v1/restaurants/1?id=1 returned 200, because `id` was no longer found in the route so it was read from the query string.

Why it is not a compile error: route templates are just strings, and the compiler never links them to method parameter names. Model binding matches them by name at run time, so a mismatch silently binds to a default value.

## Exercise 5: ambiguous routes
I gave two actions the identical route `lookup/{key}` / `lookup/{name}`. The exception is saved in ambiguity-exception.txt and shown in the README. Both actions match the same URL, so the router cannot choose one.

Fix 1, a constraint: `lookup/{key:int}` versus `lookup/{name}`. A request for lookup/5 matches only the int route and lookup/yod only the other, so nothing is ambiguous.
Fix 2, distinct literal paths: `lookup/by-key/{key}` versus `lookup/by-name/{name}`. The literal segments make the two URLs different.
