# Addis Eats API: endpoint table (Day 51)

Base path for every endpoint: `/api/v1`

| # | Method | Path | Purpose | Success status | Request body? | Safe to repeat? | Typical failures |
|---|---|---|---|---|---|---|---|
| 1 | GET | `/restaurants?area=Bole&page=1` | List restaurants, filtered and paged | 200 | No | Yes | 400 (bad query value) |
| 2 | GET | `/restaurants/{id}` | Read one restaurant | 200 | No | Yes | 404 |
| 3 | GET | `/restaurants/{id}/menu` | Read that restaurant's menu | 200 | No | Yes | 404 |
| 4 | POST | `/orders` | Place an order | 201 (+ `Location` header) | Yes | **No** (a repeat makes a second order) | 400, 401, 422 |
| 5 | GET | `/orders/{id}` | Read one order | 200 | No | Yes | 401, 403, 404 |
| 6 | PATCH | `/orders/{id}/status` | Move an order to its next status | 200 | Yes | Usually | 401, 403, 404, 409 |
| 7 | DELETE | `/orders/{id}` | Cancel an order | 204 | No | Yes (same end state) | 401, 403, 404, 409 |
| 8 | POST | `/payments/telebirr` | Start an ETB payment | 201 | Yes | **No** | 400, 401, 503 |
| 9 | POST | `/auth/login` | Log in and get a token | 200 | Yes | Yes, in effect | 400, 401 |

Rows 1 to 6 are the required six. Rows 7 to 9 are extra.

## Rows I expect to be challenged on
- **Row 4: 200 or 201?** 201, because a new resource was created, and the `Location` header says where it lives.
- **Row 6: PATCH or PUT?** PATCH, because only the status changes, not the whole order.
- **Row 7: what does a repeated DELETE return?** Either 204 again or 404 can be defended. What matters is that the end state is the same: the order is gone.
- **Row 6: updating an order that is already delivered.** 409 Conflict, because the request clashes with the current state.
- **Row 5: someone else's order.** 403 if the caller is known but not allowed, or 404 if you do not want to confirm the order exists.
