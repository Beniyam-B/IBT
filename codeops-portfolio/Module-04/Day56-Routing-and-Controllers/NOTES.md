# Day 56 notes

## Exercise 1: :int constraints
Every id segment is `{id:int}` (restaurants, restaurants/{id}/menu, menu). GET /api/v1/restaurants/abc returns 404 and not 400: "abc" cannot satisfy the :int constraint, so the router finds no matching endpoint and no action is ever called. Model-binding validation, which is what produces a 400, only runs after an action has been chosen.
