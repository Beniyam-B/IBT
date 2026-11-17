# Exercise 6: An API contract (GitHub REST API)

## Three things it promises
1. Every response is JSON and uses standard HTTP status codes (404 for a missing repository, 401 for bad credentials).
2. Predictable URLs: GET /repos/{owner}/{repo} always returns that repository.
3. Lists are paged, and the response tells you how to reach the next page.

## One thing it does not document that I would want to know
Any guaranteed response-time or uptime figure for each endpoint. I would want that before building a feature that depends on it.