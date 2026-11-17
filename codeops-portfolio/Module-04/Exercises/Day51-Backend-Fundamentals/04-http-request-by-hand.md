# Exercise 4: Create an order by hand

2 portions of menu item 7, from restaurant 14, delivered to Bole, paid by TeleBirr.

```http
POST /api/v1/orders HTTP/1.1
Host: # Exercise 4: Create an order by hand

2 portions of menu item 7, from restaurant 14, delivered to Bole, paid by TeleBirr.

```http
POST /api/v1/orders HTTP/1.1
Host: api.addiseats.example
Content-Type: application/json
Accept: application/json
Authorization: Bearer eyJhbGciOi...

{
  "restaurantId": 14,
  "area": "Bole",
  "paymentMethod": "TeleBirr",
  "items": [
    { "menuItemId": 7, "quantity": 2 }
  ]
}
```
Content-Type: application/json
Accept: application/json
Authorization: Bearer eyJhbGciOi...

{
  "restaurantId": 14,
  "area": "Bole",
  "paymentMethod": "TeleBirr",
  "items": [
    { "menuItemId": 7, "quantity": 2 }
  ]
}
```