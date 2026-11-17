# Exercise 3: Headers for request 1 (GET /api/v1/restaurants?area=Bole)

## Request headers
| Header | What it is doing |
|--------|------------------|
| Host: api.example.com | Says which site the request is for |
| Accept: application/json | Asks for the reply as JSON |
| Authorization: Bearer <token> | Proves who is asking |
| User-Agent: Mozilla/5.0 ... | Identifies the browser making the request |

## Response headers
| Header | What it is doing |
|--------|------------------|
| Content-Type: application/json | Says the body is JSON |
| Content-Length: 1842 | Size of the body in bytes |
| Cache-Control: no-store | Tells the browser not to keep a copy |
| Date: ... | When the server sent the reply |