# Exercise 5: Choosing status codes

| Outcome | Code | Why |
|---------|------|-----|
| (a) A list of restaurants is returned | 200 OK | The request worked and there is a body to return |
| (b) An order is created | 201 Created | A new resource now exists, and Location says where |
| (c) An order is cancelled, nothing returned | 204 No Content | It succeeded, and there is nothing to send back |
| (d) The qty field arrives as "two" | 400 Bad Request | The caller sent malformed data (422 also defensible if the JSON is valid but the value is not) |
| (e) The auth token has expired | 401 Unauthorized | The caller is not authenticated any more |
| (f) A courier attempts to edit a menu | 403 Forbidden | We know who they are, but they are not allowed |
| (g) Order 99999 does not exist | 404 Not Found | No such resource |
| (h) Code throws an unhandled exception | 500 Internal Server Error | The fault is ours, not the caller's |