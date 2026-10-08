# Rendering Strategy — Addis Eats

| Route              | Strategy                         | Why                                                                 |
|--------------------|----------------------------------|----------------------------------------------------------------------|
| /                  | Static                           | Story and tagline never change between builds                        |
| /menu              | Dynamic                          | Reads searchParams (q, category) on every request                    |
| /menu/[id]         | Static via generateStaticParams  | Every dish id is known at build time                                 |
| /cart              | Client                           | The cart is the person's own state, kept in the browser              |
| /checkout          | Static shell + server action     | Page is just a form; the session and validation checks run in placeOrder |
| /login, /register  | Static shell, client form        | UI only for now; submit wiring comes with the real auth step         |
| /api/dishes        | Route handler (GET)              | Reads dishes from db.js                                              |
| /api/dishes/[id]   | Route handler (GET)              | Returns one dish, or 404 with { error }                              |
| /api/orders        | Route handler (POST)             | Validates with orderSchema, 422 on failure, 201 on success; never cached |

## Build output

Paste the route table from `npm run build` here and confirm each marker matches the table above.

```
<paste route table>
```
