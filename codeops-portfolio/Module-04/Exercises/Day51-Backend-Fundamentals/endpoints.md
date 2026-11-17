# Addis Eats API: Endpoint Table (Day 51)

All paths are versioned under `/api/v1`.

| # | Method | Path | Purpose | Success | Likely failure |
|---|--------|------|---------|---------|----------------|
| 1 | GET | /api/v1/restaurants?area=Bole&page=1 | List restaurants, filtered and paged | 200 | 400 |
| 2 | GET | /api/v1/restaurants/{id} | Read one restaurant | 200 | 404 |
| 3 | GET | /api/v1/restaurants/{id}/menu | Read a restaurant's menu | 200 | 404 |
| 4 | POST | /api/v1/restaurants | Add a restaurant (admin) | 201 | 403 |
| 5 | PATCH | /api/v1/menu-items/{id} | Update a menu item's price or name | 200 | 404 |
| 6 | POST | /api/v1/orders | Place an order | 201 | 422 |
| 7 | GET | /api/v1/orders | List the caller's orders | 200 | 401 |
| 8 | GET | /api/v1/orders/{id} | Read one order | 200 | 404 |
| 9 | PATCH | /api/v1/orders/{id}/status | Move an order to its next status | 200 | 409 |
| 10 | DELETE | /api/v1/orders/{id} | Cancel an order | 204 | 404 |
| 11 | POST | /api/v1/payments | Start a payment (method in the body, e.g. TeleBirr) | 201 | 400 |
| 12 | GET | /api/v1/payments/{id} | Read a payment's status | 200 | 404 |
| 13 | POST | /api/v1/users | Register an account | 201 | 409 |
| 14 | POST | /api/v1/sessions | Log in (creates a session and returns a token) | 201 | 401 |

## Self-check
- No path contains a verb. Login is `/sessions` and registration is `/users`.
- Every collection is plural.
- Every row has a success code and a failure code.
- Creations return 201, never 200.
- Bad caller input returns 4xx, never 500.