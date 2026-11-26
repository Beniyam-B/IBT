# AddisEats.Api (Day 60): logging and API documentation

This README is the design for the Addis Eats API: its route table, its error catalogue and the decisions behind them. The code is brought into line with it.

## Run it
## Route table

All paths are versioned under `/api/v1`. The failure column lists every status an endpoint can return; the error codes are in the catalogue below. 401 and 403 are added with authentication on Day 63, and 500 is only for genuine server faults.

| # | Method | Path | Purpose | Success | Failure |
|---|--------|------|---------|---------|---------|
| 1 | GET | `/api/v1/restaurants` | List restaurants, filtered and paged | 200 | 400 |
| 2 | GET | `/api/v1/restaurants/{id}` | Read one restaurant | 200 | 404 |
| 3 | GET | `/api/v1/restaurants/{id}/menu` | That restaurant's menu, paged | 200 | 400, 404 |
| 4 | GET | `/api/v1/menu-items` | The whole menu, filtered and paged | 200 | 400 |
| 5 | GET | `/api/v1/menu-items/{id}` | Read one menu item | 200 | 404 |
| 6 | POST | `/api/v1/menu-items` | Create a menu item | 201 | 400 |
| 7 | POST | `/api/v1/orders` | Place an order | 201 | 400, 404, 409, 422 |
| 8 | GET | `/api/v1/orders/{id}` | Read one order | 200 | 404 |
| 9 | PATCH | `/api/v1/orders/{id}/status` | Move an order forward | 200 | 400, 404, 409 |
| 10 | DELETE | `/api/v1/orders/{id}` | Cancel an order | 204 | 404, 409 |
| 11 | GET | `/admin/stats` | Counts of everything (needs the `X-Api-Key` header) | 200 | 401 |

## Status code rules
- **200** a read succeeded, or an update returned the changed resource. An empty collection is still a 200 with an empty `data` array.
- **201** a resource was created, always with a `Location` header (`CreatedAtAction`).
- **204** it worked and there is nothing to say: no body at all (cancelling an order).
- **400** the request could not be understood (malformed body, bad type, bad paging, unknown parameter).
- **404** that resource does not exist.
- **409** the request is fine but clashes with the current state (closed restaurant, a move the order cannot make).
- **422** the request is well formed but breaks a business rule (a quantity of 0, an item that is not on that restaurant's menu).
- **500** our code threw and nobody caught it. Never returned for input the caller got wrong.

## Identifiers and filters

An identifier selects one thing, so it belongs in the path. A filter changes which subset comes back, so it belongs in the query string.

| Segment | Kind | Where it lives |
|---|---|---|
| `/api/v1` | version prefix | path |
| `restaurants`, `menu-items`, `orders` | collection (plural noun) | path |
| `{id}` | identifier | path, constrained with `:int` |
| `menu` in `restaurants/{id}/menu` | sub-resource of a restaurant | path |
| `status` in `orders/{id}/status` | sub-resource of an order | path |
| `area`, `areas`, `maxFeeEtb`, `category`, `maxPrice` | filters | query string |
| `page`, `limit` | paging controls | query string |

What I changed:
1. `/api/v1/menu` became `/api/v1/menu-items`, so the collection is a plural, hyphenated noun like the others.
2. Nothing else needed moving: no identifier is passed in the query string, and no filter is in the path (`/restaurants?area=Bole`, not `/restaurants/bole`).
3. The deepest path is two levels (`restaurants/{id}/menu`). Reaching one restaurant's items another way would use a filter on `/menu-items`, not a longer path.

## Verbs in paths

I scanned every route for create, get, update, list, fetch, do, cancel and lookup. The final route table has **no verb in any path**. Two operations tempted one, so here is each written three ways.

**Cancelling an order**

| Way | Route | Verdict |
|---|---|---|
| 1. Use the method that already exists | `DELETE /api/v1/orders/91` | chosen |
| 2. Model the state as a sub-resource | `PATCH /api/v1/orders/91/status` with `{ "status": "Cancelled" }` | works, but gives two ways to cancel |
| 3. Model the event as a resource | `POST /api/v1/orders/91/cancellations` | useful only if cancellations need a stored reason |

Chosen: way 1. DELETE exists for this, it is idempotent (cancelling twice is not an error), and it gives the API its 204. `PATCH` moves an order forward only, so there is exactly one way to cancel.

**Finding a restaurant by name** (the `lookup` routes from the Day 56 experiment, now removed)

| Way | Route | Verdict |
|---|---|---|
| 1. A filter | `GET /api/v1/restaurants?name=yod` | chosen |
| 2. An identifier | `GET /api/v1/restaurants/yod-abyssinia` | needs a unique slug |
| 3. A named verb | `GET /api/v1/restaurants/search?q=yod` | last resort |

Chosen: way 1. Finding is filtering a collection, and a filter in the query string keeps the path a noun.

No named-verb route remains. Login, which resists this, arrives on Day 63 and will be written as `POST /api/v1/auth/login` with that reason documented.

## Error catalogue

Every failure the API can produce is listed here once. The code is for machines (a frontend switches on `code`); the message is for people.

| Code | Status | When | Message to the client |
|---|---|---|---|
| `VALIDATION_FAILED` | 400 | A field is missing or malformed, or the body cannot be parsed | Names the field and the rule |
| `INVALID_PAGING` | 400 | `page` is below 1, or `limit` is outside 1 to 50 | page must be 1 or more, and limit must be between 1 and 50 |
| `UNKNOWN_PARAMETER` | 400 | The query string has a parameter the endpoint does not accept | Names the unknown parameter and lists the accepted ones |
| `RESTAURANT_NOT_FOUND` | 404 | The restaurant id does not exist | The restaurant was not found |
| `MENU_ITEM_NOT_FOUND` | 404 | The menu item id does not exist | The menu item was not found |
| `ORDER_NOT_FOUND` | 404 | The order id does not exist | The order was not found |
| `RESTAURANT_CLOSED` | 409 | Ordering from a closed restaurant | This restaurant is closed |
| `ORDER_STATUS_CONFLICT` | 409 | The move is not allowed from the order's current status | An order that is X cannot move to Y |
| `ORDER_ALREADY_DELIVERED` | 409 | Cancelling a delivered order | This order cannot be cancelled |
| `AMOUNT_INVALID` | 422 | The order total (items plus delivery) is below the minimum order of 150 ETB | The order total must be at least 150.00 ETB |
| `ITEM_NOT_ON_MENU` | 422 | The menu item does not belong to that restaurant | That item is not on this restaurant's menu |
| `UNAUTHENTICATED` | 401 | The `/admin` API key is missing or wrong | A valid X-Api-Key header is required |
| `INTERNAL_ERROR` | 500 | An unhandled exception, caught by the exception middleware | Something went wrong on our side |

### One error shape
Every error body is a ProblemDetails (RFC 7807) with an extra `code` field:

```json
{
  "type": "https://addiseats.et/errors/restaurant-not-found",
  "title": "The restaurant was not found.",
  "status": 404,
  "detail": "Restaurant 9999 does not exist.",
  "instance": "/api/v1/restaurants/9999",
  "code": "RESTAURANT_NOT_FOUND",
  "traceId": "0HNB2K3M5L9QD:00000001"
}
```

Validation errors add an `errors` object that lists every bad field at once, so a frontend can attach each message to a form field. Every error carries a `traceId`. No error body ever contains a stack trace or an exception message.

### 400 or 422
400 means the request could not be parsed or is malformed. 422 means it parsed cleanly but breaks a business rule. This rule holds on every endpoint.

## Status codes for four scenarios

| Scenario | Status | Justification |
|---|---|---|
| A search that returns no rows | 200 with `"data": []` | The request succeeded and found nothing. A 404 would claim the endpoint does not exist, and 204 means no body at all. |
| Cancelling an order that was already delivered | 409 `ORDER_ALREADY_DELIVERED` | The request is valid but conflicts with the order's current state. |
| A request with a negative ETB total | 422 `AMOUNT_INVALID` | The body parsed cleanly but breaks a business rule (a total must be above zero). |
| A valid token belonging to a courier who tries to edit a menu | 403 | The caller is known (so not 401), but is not allowed to do this. |

## REST, GraphQL or gRPC

| Scenario | Choice | Why |
|---|---|---|
| A public mobile API | REST | Every client, from our own app to a partner's website, can call plain HTTP and JSON, and responses can be cached and documented in Swagger. Paging and a `fields` parameter already save mobile data without adding a new query language. |
| An internal service-to-service call | gRPC | Both ends are ours, so the compact binary format and the strongly typed contract generated from a `.proto` file are an advantage and browser support does not matter. It is faster than JSON and supports streaming. |
| A dashboard that needs six resources on one screen | GraphQL | One query can ask for exactly the six resources and fields the screen shows, instead of six round trips that each return more than is needed. The extra complexity is acceptable for one read-heavy internal screen. |

## Unknown query parameters: rejected

Decision: **reject**. A query parameter an endpoint does not declare returns `400 UNKNOWN_PARAMETER`, and the message names the unknown parameter and lists the accepted ones. Ignoring it would be friendlier, but a typo such as `?aera=Bole` would then silently return all 32 restaurants and the client developer would never learn why the filter did nothing.

It is one global filter (`RejectUnknownQueryParametersFilter`), so the same convention holds on `/restaurants`, `/menu-items` and `/orders`: each action accepts exactly the query parameters it declares. A path value such as `id` is not a query parameter, so `?id=1` on `/restaurants/1` is rejected too.


## Validation layers

Each layer is cheaper than the next and rejects a different kind of wrong. A rule lives in exactly one layer.

| Layer | Asks | Failure | In this API |
|---|---|---|---|
| 1. Route constraint | Could this URL ever be valid? | 404 | `{id:int}` rejects `/orders/abc` |
| 2. Model binding | Can the text become the declared type? | 400 `VALIDATION_FAILED` | `"restaurantId": "one"` |
| 3. Data annotations | Is each field within its rules? | 400 `VALIDATION_FAILED`, every bad field at once | attributes on the request types |
| 4. Business rules | Is this acceptable right now? | 404, 409 or 422 | the service returns a `Result` |
| 5. Database constraints | The last defence | | Module 5 |

## Exercise 1: annotations on every request type

| Request type | Field | Rules (each with its own message) |
|---|---|---|
| `CreateOrderDto` | `restaurantId` | Range 1 or more |
| | `menuItemId` | Range 1 or more |
| | `quantity` | Range 1 to 50 |
| | `phone` | Required, MinLength 10, StringLength 13 |
| `CreateMenuItemDto` | `name` | Required, StringLength 2 to 100 |
| | `category` | Required, StringLength 50 |
| `UpdateOrderStatusDto` | `status` | EnumDataType (must be a real status) |
| `RestaurantQuery` | `area`, `maxFeeEtb` | StringLength 50, Range 0 to 10,000 |

Errors use camelCase field names so a frontend can bind them to form fields. A request with four bad fields reports all four at once.

## Exercise 2: EthiopianMobileAttribute

Shape only: `^(?:\+251|0)(?:9|7)\d{8}$`, compiled once. Whether the number is registered with TeleBirr is a business rule and belongs in layer 4.

| Number | Case | Status |
|---|---|---|
| `0911234567` | valid: 09 form | 201 |
| `0711234567` | valid: 07 form | 201 |
| `+251911234567` | valid: +251 with 9 | 201 |
| `+251711234567` | valid: +251 with 7 | 201 |
| `0811234567` | invalid: 08 is not a mobile prefix | 400 |
| `091123456` | invalid: too short | 400 |
| `+25191123456` | invalid: +251 form too short | 400 |
| `09112x4567` | invalid: contains a letter | 400 |

## Exercise 3: EtbAmountAttribute

Applied to `priceEtb` when creating a menu item. It rejects zero, negatives and more than two decimal places, on a `decimal` (never a `double`).

| priceEtb | Case | Status |
|---|---|---|
| `480.50` | valid: two decimals | 201 |
| `95` | valid: whole number | 201 |
| `480.505` | invalid: three decimals | 400 |
| `12.345` | invalid: three decimals | 400 |
| `0` | invalid: zero | 400 |
| `-5` | invalid: negative | 400 |

## Exercise 4: a rule across two fields

`CreateOrderDto` implements `IValidatableObject` for the scheduled delivery: `scheduledFor` is required (and must be in the future) when `isScheduled` is true, and is not allowed when it is false. It runs after the property attributes and only if they all passed.

Why it cannot be a property attribute: a property attribute only sees the value of the one property it sits on, and this rule needs `isScheduled` and `scheduledFor` together.

## Exercise 5: Result<T>

`OrderService` returns `Result<Order>` from every method. A failure carries a catalogue entry (code, status) and a detail message, so the status travels with the error and the controller never guesses. The controller only checks `IsSuccess` and calls `Fail(result)`.

| Case | Status | Code |
|---|---|---|
| restaurant does not exist | 404 | RESTAURANT_NOT_FOUND |
| restaurant is closed | 409 | RESTAURANT_CLOSED |
| item is on another restaurant's menu | 422 | ITEM_NOT_ON_MENU |
| total below the 150 ETB minimum | 422 | AMOUNT_INVALID |
| a valid order | 201 | - |

# Exercise 5: Result<T>

`OrderService` returns `Result<Order>` from every method. A failure carries a catalogue entry (code, status) and a detail message, so the status travels with the error and the controller never guesses. The controller only checks `IsSuccess` and calls `Fail(result)`.

| Case | Status | Code |
|---|---|---|
| restaurant does not exist | 404 | RESTAURANT_NOT_FOUND |
| restaurant is closed | 409 | RESTAURANT_CLOSED |
| item is on another restaurant's menu | 422 | ITEM_NOT_ON_MENU |
| total below the 150 ETB minimum | 422 | AMOUNT_INVALID |
| a valid order | 201 | - |
PS L:\IBT\codeops-portfolio\Module-04\Day58-Validation-and-Error-Handling>


## Exercise 6: no client total

The order request type has no total at all: `CreateOrderDto` holds a restaurant, an item, a quantity and a phone. The server computes `totalEtb` as `price x quantity + delivery fee` from the menu. Unknown JSON fields are rejected (`JsonUnmappedMemberHandling.Disallow`), so a client cannot slip one in.

Attempt to order for 1 ETB by sending `"totalEtb": 1`:

Status 400

```json
{"type":"https://addiseats.et/errors/validation-failed","title":"One or more validation errors occurred.","status":400,"detail":"One or more fields are missing or malformed.","instance":"/api/v1/orders","errors":{"request":["The request field is required."],"$.totalEtb":["The JSON property 'totalEtb' could not be mapped to any .NET member contained in type 'AddisEats.Api.Dtos.CreateOrderDto'."]},"code":"VALIDATION_FAILED"}
```

The same order without the extra field is accepted and the server works out the real total:

Status 201

```json
{"id":3,"restaurantId":1,"menuItemId":1,"quantity":2,"totalEtb":370,"status":"Placed","placedOn":"2026-11-21T06:00:15.2904458Z","customerPhone":"0911234567"}
```

The one amount a client does send is `priceEtb` when creating a menu item. That is the price being defined, not a total, and it goes through `EtbAmountAttribute`.

## Exercise 7: the exception middleware

`ExceptionHandlingMiddleware` is registered first, so it wraps everything after it. It logs the full exception once (with the method, path and trace id) and returns a `ProblemDetails` with a generic message. `GET /api/v1/debug/throw` exists only in Development and throws on purpose:

Status 500

```json
{"type":"https://addiseats.et/errors/internal-error","title":"Something went wrong on our side.","status":500,"detail":"An unexpected error occurred. Quote the trace id if you contact support.","instance":"/api/v1/debug/throw","code":"INTERNAL_ERROR","traceId":"0HNQ7IJEU9DPP:00000001"}
```

The log line carries the same trace id, so support can find the failure from what the customer reads off the screen. The response contains no stack trace, no exception message, no table names and no connection strings.

## Exercise 8: every catalogue code from a real request

Each body below was recorded from the running API (Development, starting data). Every one has the same shape: `type`, `title`, `status`, `detail`, `instance`, a machine `code` and a `traceId`. Validation errors add an `errors` object that lists every bad field.

### VALIDATION_FAILED (400)

Request: `POST /api/v1/orders with {"restaurantId":0,"menuItemId":0,"quantity":99,"phone":"12345"}`

```json
```

### INVALID_PAGING (400)

Request: `GET /api/v1/restaurants?limit=0`

```json
```

### UNKNOWN_PARAMETER (400)

Request: `GET /api/v1/restaurants?aera=Bole`

```json
```

### RESTAURANT_NOT_FOUND (404)

Request: `GET /api/v1/restaurants/9999`

```json
```

### MENU_ITEM_NOT_FOUND (404)

Request: `GET /api/v1/menu-items/9999`

```json
```

### ORDER_NOT_FOUND (404)

Request: `GET /api/v1/orders/999`

```json
```

### RESTAURANT_CLOSED (409)

Request: `POST /api/v1/orders with {"restaurantId":2,"menuItemId":7,"quantity":1,"phone":"0911234567"}`

```json
```

### ORDER_STATUS_CONFLICT (409)

Request: `PATCH /api/v1/orders/1/status with {"status":"Preparing"}`

```json
```

### ORDER_ALREADY_DELIVERED (409)

Request: `DELETE /api/v1/orders/1`

```json
```

### AMOUNT_INVALID (422)

Request: `POST /api/v1/orders with {"restaurantId":4,"menuItemId":19,"quantity":1,"phone":"0911234567"}`

```json
```

### ITEM_NOT_ON_MENU (422)

Request: `POST /api/v1/orders with {"restaurantId":1,"menuItemId":13,"quantity":1,"phone":"0911234567"}`

```json
```

### INTERNAL_ERROR (500)

Request: `GET /api/v1/debug/throw`

```json
```


## Exercise 8: every catalogue code from a real request

Each body below was recorded from the running API (Development, starting data). Every one has the same shape: `type`, `title`, `status`, `detail`, `instance`, a machine `code` and a `traceId`. Validation errors add an `errors` object that lists every bad field.

### VALIDATION_FAILED (400)

Request: `POST /api/v1/orders with {"restaurantId":0,"menuItemId":0,"quantity":99,"phone":"12345"}`

```json
{"type":"https://addiseats.et/errors/validation-failed","title":"One or more validation errors occurred.","status":400,"detail":"One or more fields are missing or malformed.","instance":"/api/v1/orders","errors":{"phone":["A phone number has at least 10 characters.","Enter a valid Ethiopian mobile number, such as 0911234567 or +251911234567."],"quantity":["Quantity must be between 1 and 50."],"menuItemId":["Choose a menu item: menuItemId must be 1 or more."],"restaurantId":["Choose a restaurant: restaurantId must be 1 or more."]},"code":"VALIDATION_FAILED","traceId":"0HNQ7ILF4R8S8:00000001"}
```

### INVALID_PAGING (400)

Request: `GET /api/v1/restaurants?limit=0`

```json
{"type":"https://addiseats.et/errors/invalid-paging","title":"The page or limit is out of range.","status":400,"detail":"page must be 1 or more, and limit must be between 1 and 50.","instance":"/api/v1/restaurants","code":"INVALID_PAGING","traceId":"0HNQ7ILF4R8S9:00000001"}
```

### UNKNOWN_PARAMETER (400)

Request: `GET /api/v1/restaurants?aera=Bole`

```json
{"type":"https://addiseats.et/errors/unknown-parameter","title":"The request has a query parameter this endpoint does not accept.","status":400,"detail":"Unknown query parameter(s): aera. This endpoint accepts: Area, Areas, Limit, MaxFeeEtb, Page.","instance":"/api/v1/restaurants","code":"UNKNOWN_PARAMETER","traceId":"0HNQ7ILF4R8SA:00000001"}
```

### RESTAURANT_NOT_FOUND (404)

Request: `GET /api/v1/restaurants/9999`

```json
{"type":"https://addiseats.et/errors/restaurant-not-found","title":"The restaurant was not found.","status":404,"detail":"Restaurant 9999 does not exist.","instance":"/api/v1/restaurants/9999","code":"RESTAURANT_NOT_FOUND","traceId":"0HNQ7ILF4R8SB:00000001"}
```

### MENU_ITEM_NOT_FOUND (404)

Request: `GET /api/v1/menu-items/9999`

```json
{"type":"https://addiseats.et/errors/menu-item-not-found","title":"The menu item was not found.","status":404,"detail":"Menu item 9999 does not exist.","instance":"/api/v1/menu-items/9999","code":"MENU_ITEM_NOT_FOUND","traceId":"0HNQ7ILF4R8SC:00000001"}
```

### ORDER_NOT_FOUND (404)

Request: `GET /api/v1/orders/999`

```json
{"type":"https://addiseats.et/errors/order-not-found","title":"The order was not found.","status":404,"detail":"Order 999 does not exist.","instance":"/api/v1/orders/999","code":"ORDER_NOT_FOUND","traceId":"0HNQ7ILF4R8SD:00000001"}
```

### RESTAURANT_CLOSED (409)

Request: `POST /api/v1/orders with {"restaurantId":2,"menuItemId":7,"quantity":1,"phone":"0911234567"}`

```json
{"type":"https://addiseats.et/errors/restaurant-closed","title":"This restaurant is closed.","status":409,"detail":"Restaurant 2 is closed.","instance":"/api/v1/orders","code":"RESTAURANT_CLOSED","traceId":"0HNQ7ILF4R8SE:00000001"}
```

### ORDER_STATUS_CONFLICT (409)

Request: `PATCH /api/v1/orders/1/status with {"status":"Preparing"}`

```json
{"type":"https://addiseats.et/errors/order-status-conflict","title":"The order cannot make that move.","status":409,"detail":"An order that is Delivered cannot move to Preparing.","instance":"/api/v1/orders/1/status","code":"ORDER_STATUS_CONFLICT","traceId":"0HNQ7ILF4R8SF:00000001"}
```

### ORDER_ALREADY_DELIVERED (409)

Request: `DELETE /api/v1/orders/1`

```json
{"type":"https://addiseats.et/errors/order-already-delivered","title":"This order cannot be cancelled.","status":409,"detail":"A delivered order cannot be cancelled.","instance":"/api/v1/orders/1","code":"ORDER_ALREADY_DELIVERED","traceId":"0HNQ7ILF4R8SG:00000001"}
```

### AMOUNT_INVALID (422)

Request: `POST /api/v1/orders with {"restaurantId":4,"menuItemId":19,"quantity":1,"phone":"0911234567"}`

```json
{"type":"https://addiseats.et/errors/amount-invalid","title":"The order total is below the minimum order.","status":422,"detail":"The order total must be at least 150.00 ETB (this one is 105.00 ETB).","instance":"/api/v1/orders","code":"AMOUNT_INVALID","traceId":"0HNQ7ILF4R8SH:00000001"}
```

### ITEM_NOT_ON_MENU (422)

Request: `POST /api/v1/orders with {"restaurantId":1,"menuItemId":13,"quantity":1,"phone":"0911234567"}`

```json
{"type":"https://addiseats.et/errors/item-not-on-menu","title":"That item is not on this restaurant's menu.","status":422,"detail":"Menu item 13 is not on restaurant 1's menu.","instance":"/api/v1/orders","code":"ITEM_NOT_ON_MENU","traceId":"0HNQ7ILF4R8SI:00000001"}
```

### INTERNAL_ERROR (500)

Request: `GET /api/v1/debug/throw`

```json
{"type":"https://addiseats.et/errors/internal-error","title":"Something went wrong on our side.","status":500,"detail":"An unexpected error occurred. Quote the trace id if you contact support.","instance":"/api/v1/debug/throw","code":"INTERNAL_ERROR","traceId":"0HNQ7ILF4R8SJ:00000001"}
```



## What changed since Day 57
- A zero or negative price is now a field-level rule (`EtbAmountAttribute`), so it returns 400 `VALIDATION_FAILED`.
- `AMOUNT_INVALID` (422) is now the business rule "the order total must reach the minimum order", worked out on the server.
- Every error body, from the controllers and from the exception middleware, has the same shape with a `code` and a `traceId`.
- `Result<T>` is returned from every `OrderService` method that can fail. The two lookups (`GetById` on restaurants and menu items) still return `null` when nothing is found: that is a lookup, not a rule being broken.


## Exercise 5: a scoped service in a middleware constructor

Convention middleware is created **once**, when the pipeline is built, and the same instance then serves every request. A scoped service is meant to live for one request. Put it in the constructor and the first instance is captured and shared by every customer, forever.

**In Development** the framework refuses it, because scope validation is on there:

```
dotnet : Unhandled exception. System.InvalidOperationException: Cannot resolve scoped service
```

**With validation off** (the Staging environment, and Production) it starts and works for the first request. Two requests sent at the same moment to `/lab/alpha` and `/lab/beta`, twice:

```
round 1 : ids = 1101c7af5f40404b84b29802293ece9a, 1101c7af5f40404b84b29802293ece9a | paths = /beta, /beta
round 2 : ids = 1101c7af5f40404b84b29802293ece9a, 1101c7af5f40404b84b29802293ece9a | paths = /alpha, /alpha
```

The same id every time (one object for everyone), and both requests report the same path: one of them is shown the other customer's data. On a real API that is one customer seeing another's order.

**The fix** is to take the scoped service as a parameter of `InvokeAsync`, which the framework resolves per request. The same experiment:

```
round 1 : ids = 0c7b09d8d8a146a5980f736d1d5a1fd4, e49f1d7ac8494d8bbda9cd28690b3c50 | paths = /beta, /alpha
round 2 : ids = e48ffa88c7464bc2b5d9e92def4d8c2a, 175d2249ae194270b28a6870308ff9b9 | paths = /beta, /alpha
```

Different ids, and each request sees its own path. The rule: the constructor is for things that live as long as the app (`RequestDelegate`, `ILogger`, `IOptions`). Anything scoped arrives through `InvokeAsync`. The lab route exists only in Development.

## Exercise 6: UseAuthorization above UseAuthentication (a scratch branch, since deleted)

Authentication works out who the caller is and authorization decides what they may do, so authentication has to come first. I protected `GET /api/v1/secure` with `[Authorize]` and a demo login (a caller counts as logged in when it sends `X-Demo-User`), then ran the pipeline both ways.

### Correct order (`UseAuthentication`, then `UseAuthorization`)

```
HTTP/1.1 401 Unauthorized
Content-Length: 0
Date: Mon, 23 Nov 2026 07:22:45 GMT
Server: Kestrel
X-Correlation-Id: 9d4eb88bd21c4f60aca1f9bdf38839c8

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Date: Mon, 23 Nov 2026 07:22:45 GMT
Server: Kestrel
Transfer-Encoding: chunked
X-Correlation-Id: d8658aaa1e874a86ab6a8006991fd519

{"message":"You are in.","user":"almaz"}

--- log

10:22:46 warn: Microsoft.AspNetCore.HttpsPolicy.HttpsRedirectionMiddleware[3] => SpanId:4188535474f70a11, TraceId:b6377ca647569b0f966d4078acf16cf8, ParentId:0000000000000000 => ConnectionId:0HNQ96A965P66 => RequestPath:/api/v1/secure RequestId:0HNQ96A965P66:00000001 => CorrelationId:9d4eb88bd21c4f60aca1f9bdf38839c8 Failed to determine the https port for redirect.
10:22:46 info: Microsoft.AspNetCore.Authorization.DefaultAuthorizationService[2] => SpanId:4188535474f70a11, TraceId:b6377ca647569b0f966d4078acf16cf8, ParentId:0000000000000000 => ConnectionId:0HNQ96A965P66 => RequestPath:/api/v1/secure RequestId:0HNQ96A965P66:00000001 => CorrelationId:9d4eb88bd21c4f60aca1f9bdf38839c8 Authorization failed. These requirements were not met: DenyAnonymousAuthorizationRequirement: Requires an authenticated user.
10:22:46 info: AddisEats.Api.Auth.DemoHeaderAuthHandler[12] => SpanId:4188535474f70a11, TraceId:b6377ca647569b0f966d4078acf16cf8, ParentId:0000000000000000 => ConnectionId:0HNQ96A965P66 => RequestPath:/api/v1/secure RequestId:0HNQ96A965P66:00000001 => CorrelationId:9d4eb88bd21c4f60aca1f9bdf38839c8 AuthenticationScheme: DemoHeader was challenged.
10:22:46 info: AddisEats.Api.Middleware.RequestTimingMiddleware[0] => SpanId:4188535474f70a11, TraceId:b6377ca647569b0f966d4078acf16cf8, ParentId:0000000000000000 => ConnectionId:0HNQ96A965P66 => RequestPath:/api/v1/secure RequestId:0HNQ96A965P66:00000001 => CorrelationId:9d4eb88bd21c4f60aca1f9bdf38839c8 GET /api/v1/secure -> 401 in 119ms
10:22:46 info: AddisEats.Api.Middleware.RequestTimingMiddleware[0] => SpanId:214b56636c9952f3, TraceId:98185ab8fea6992202a9029b7b1f93ab, ParentId:0000000000000000 => ConnectionId:0HNQ96A965P67 => RequestPath:/api/v1/secure RequestId:0HNQ96A965P67:00000001 => CorrelationId:d8658aaa1e874a86ab6a8006991fd519 GET /api/v1/secure -> 200 in 65ms
```

### Reordered (`UseAuthorization`, then `UseAuthentication`)

```
HTTP/1.1 401 Unauthorized
Content-Length: 0
Date: Mon, 23 Nov 2026 07:23:34 GMT
Server: Kestrel
X-Correlation-Id: 400132ef4d754faa9a3173e178b1a4b9

HTTP/1.1 401 Unauthorized
Content-Length: 0
Date: Mon, 23 Nov 2026 07:23:34 GMT
Server: Kestrel
X-Correlation-Id: 9cbfd7140cca447c8d7905e87b76e2c5


--- log

10:23:35 warn: Microsoft.AspNetCore.HttpsPolicy.HttpsRedirectionMiddleware[3] => SpanId:bb2971e050abddae, TraceId:774c59ad2741b1f2693ddd4ae9a59862, ParentId:0000000000000000 => ConnectionId:0HNQ96ANRB6MP => RequestPath:/api/v1/secure RequestId:0HNQ96ANRB6MP:00000001 => CorrelationId:400132ef4d754faa9a3173e178b1a4b9 Failed to determine the https port for redirect.
10:23:35 info: Microsoft.AspNetCore.Authorization.DefaultAuthorizationService[2] => SpanId:bb2971e050abddae, TraceId:774c59ad2741b1f2693ddd4ae9a59862, ParentId:0000000000000000 => ConnectionId:0HNQ96ANRB6MP => RequestPath:/api/v1/secure RequestId:0HNQ96ANRB6MP:00000001 => CorrelationId:400132ef4d754faa9a3173e178b1a4b9 Authorization failed. These requirements were not met: DenyAnonymousAuthorizationRequirement: Requires an authenticated user.
10:23:35 info: AddisEats.Api.Auth.DemoHeaderAuthHandler[12] => SpanId:bb2971e050abddae, TraceId:774c59ad2741b1f2693ddd4ae9a59862, ParentId:0000000000000000 => ConnectionId:0HNQ96ANRB6MP => RequestPath:/api/v1/secure RequestId:0HNQ96ANRB6MP:00000001 => CorrelationId:400132ef4d754faa9a3173e178b1a4b9 AuthenticationScheme: DemoHeader was challenged.
10:23:35 info: AddisEats.Api.Middleware.RequestTimingMiddleware[0] => SpanId:bb2971e050abddae, TraceId:774c59ad2741b1f2693ddd4ae9a59862, ParentId:0000000000000000 => ConnectionId:0HNQ96ANRB6MP => RequestPath:/api/v1/secure RequestId:0HNQ96ANRB6MP:00000001 => CorrelationId:400132ef4d754faa9a3173e178b1a4b9 GET /api/v1/secure -> 401 in 110ms
10:23:35 info: Microsoft.AspNetCore.Authorization.DefaultAuthorizationService[2] => SpanId:50e2486cdda99b95, TraceId:fb6783eb70c35c784e15f6dca0fa0d76, ParentId:0000000000000000 => ConnectionId:0HNQ96ANRB6MQ => RequestPath:/api/v1/secure RequestId:0HNQ96ANRB6MQ:00000001 => CorrelationId:9cbfd7140cca447c8d7905e87b76e2c5 Authorization failed. These requirements were not met: DenyAnonymousAuthorizationRequirement: Requires an authenticated user.
10:23:35 info: AddisEats.Api.Auth.DemoHeaderAuthHandler[12] => SpanId:50e2486cdda99b95, TraceId:fb6783eb70c35c784e15f6dca0fa0d76, ParentId:0000000000000000 => ConnectionId:0HNQ96ANRB6MQ => RequestPath:/api/v1/secure RequestId:0HNQ96ANRB6MQ:00000001 => CorrelationId:9cbfd7140cca447c8d7905e87b76e2c5 AuthenticationScheme: DemoHeader was challenged.
10:23:35 info: AddisEats.Api.Middleware.RequestTimingMiddleware[0] => SpanId:50e2486cdda99b95, TraceId:fb6783eb70c35c784e15f6dca0fa0d76, ParentId:0000000000000000 => ConnectionId:0HNQ96ANRB6MQ => RequestPath:/api/v1/secure RequestId:0HNQ96ANRB6MQ:00000001 => CorrelationId:9cbfd7140cca447c8d7905e87b76e2c5 GET /api/v1/secure -> 401 in 22ms
```

In the reordered pipeline authorization asks "may this user proceed?" before anything has identified the user, so it sees an anonymous caller and refuses. A caller with perfectly valid credentials is rejected, and the log says the request failed authorization, not that the credentials were wrong. This is the bug to remember: if every protected route returns 401 for a valid login, check the order of these two lines first.

## Exercise 7: the audit action filter

`AuditActionFilter` logs the name of the action that ran and its bound arguments, with phone numbers and other secrets replaced by `***`. It is registered after the unknown-parameter filter, so a request that filter rejects never reaches an action and is never audited. A real entry from the log (`POST /api/v1/orders`):

```
10:27:00 info: AddisEats.Api.Filters.AuditActionFilter[0] => SpanId:026a2aea2f06c084, TraceId:9d3369ba01df9a29b7b71c90d2e5ddb5, ParentId:0000000000000000 => ConnectionId:0HNQ96CKO9N2J => RequestPath:/api/v1/orders RequestId:0HNQ96CKO9N2J:00000001 => CorrelationId:audit-post => AddisEats.Api.Controllers.OrdersController.Create (AddisEats.Api) Action AddisEats.Api.Controllers.OrdersController.Create (AddisEats.Api) with {"request":{"restaurantId":1,"menuItemId":1,"quantity":2,"phone":"***","isScheduled":false,"scheduledFor":null}}
```

**Why this could not be middleware:** middleware runs before routing has chosen an action and before model binding, so all it can see is the raw request stream, not the action name or the bound, validated arguments.

## Exercise 8: the pipeline, line by line

This is the pipeline half of `Program.cs`, copied from the code. A request travels down it, and the response travels back up. The order is dependency order, not alphabetical: each step needs something the previous one established.

```csharp
var app = builder.Build();

// ---- 2. The pipeline, top to bottom. The order is the design.
app.UseMiddleware<ExceptionHandlingMiddleware>();   // outermost: it can report a failure in anything below it
app.UseMiddleware<CorrelationIdMiddleware>();       // the id exists before anything logs
app.UseMiddleware<RequestTimingMiddleware>();       // measures everything below it, so it comes early

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    // Development only: a deliberate throw, to prove the handler works. Hidden from Swagger.
    app.MapGet("/api/v1/debug/throw", IResult () => throw new InvalidOperationException("boom: Server=secret-db;Password=hunter2"))
       .ExcludeFromDescription();

    // Development only: a slow route, to see the Warning from the timing middleware.
    app.MapGet("/api/v1/debug/slow", async (int? ms) =>
    {
        var wait = Math.Clamp(ms ?? 1500, 0, 5000);
        await Task.Delay(wait);
        return Results.Ok(new { waitedMs = wait });
    }).ExcludeFromDescription();
}

app.UseHttpsRedirection();
app.UseCors(FrontendPolicy);   // before routing, so a preflight request is answered

// A branch: only requests whose path starts with /admin enter it. Everything else carries on down the main pipeline.
app.Map("/admin", admin =>
{
    admin.UseMiddleware<ApiKeyMiddleware>();   // runs first inside the branch and stops the request if the key is wrong

    // The terminal step of the branch. If the key middleware short-circuits, this line never appears in the log.
    admin.Run(async ctx =>
    {
        var log = ctx.RequestServices.GetRequiredService<ILoggerFactory>().CreateLogger("Admin");
        log.LogInformation("admin handler ran");

        await ctx.Response.WriteAsJsonAsync(new
        {
            restaurants = AddisEats.Api.Data.SeedData.Restaurants.Count,
            menuItems = AddisEats.Api.Data.SeedData.MenuItems.Count,
            orders = AddisEats.Api.Data.SeedData.Orders.Count
        });
    });
});
// Lab (exercise 5), never in Production: shows how a scoped service behaves inside middleware.
if (app.Environment.IsDevelopment())
{
    app.Map("/lab", lab =>
    {
        lab.UseMiddleware<RequestScratchMiddleware>();
        lab.Run(ctx => ctx.Response.WriteAsync("lab ok"));
    });
}

app.UseRouting();              // decides which endpoint matches, without running it
// app.UseRateLimiter();       // Day 63: after routing, so limits can differ per endpoint
// app.UseAuthentication();    // Day 61: who is the caller
// app.UseAuthorization();     // Day 62: may they proceed
app.MapControllers();          // runs the endpoint: terminal, nothing after it ever executes

app.Run();




```

Why each line sits where it does:

| # | Step | Why it is here |
|---|------|----------------|
| 1 | `ExceptionHandlingMiddleware` | Outermost, so it wraps everything below it and is the only component that can report a failure in any of the others. If it were later, a crash in an earlier step would escape as a raw 500. |
| 2 | `CorrelationIdMiddleware` | Before anything logs, so every later log line and every error body carries the id. Just inside the exception handler: the trace id is already on the request by the time an exception travels back up, and the header is added with `OnStarting` so it survives the handler clearing the response. |
| 3 | `RequestTimingMiddleware` | Early, so it measures the whole pipeline below it and not only the controller. After the correlation id, so the timing line already carries it. Reversed, it would not. |
| 4 | `UseSwagger`, `UseSwaggerUI` (Development) | Middleware that answers `/swagger` itself and short-circuits, so those requests never reach MVC. Development only. |
| 5 | `/api/v1/debug/*` routes (Development) | A deliberate throw and a slow route, to prove the exception handler and the Warning threshold work. Never exposed outside Development. |
| 6 | `UseHttpsRedirection` | Decided before anything reads the request in detail. |
| 7 | `UseCors` | Before routing, so a browser preflight (OPTIONS) request is answered without needing an endpoint. |
| 8 | `Map("/admin")` with `ApiKeyMiddleware` | A branch: only `/admin` requests enter it, so the key check never touches the public API. It sits after HTTPS and CORS so they still apply, and before routing because admin requests never need MVC. A wrong key short-circuits with 401 and nothing after it runs. |
| 9 | `/lab` branch (Development) | The scoped-lifetime experiment (exercise 5), correct version. Development only. |
| 10 | `UseRouting` | Selects the endpoint but does not run it. The gap between this and `MapControllers` is where rate limiting, authentication and authorization live. |
| 11 | `// UseRateLimiter` (Day 63) | After routing, so limits can differ per endpoint, and before authentication so a flood is refused cheaply. |
| 12 | `// UseAuthentication` (Day 61) | Establishes who the caller is. Must precede authorization: reversed, authorization sees an anonymous user and rejects valid credentials (exercise 6). |
| 13 | `// UseAuthorization` (Day 62) | Decides whether that caller may proceed. Needs the endpoint (from routing) and the identity (from authentication). |
| 14 | `MapControllers` | Terminal: runs the endpoint, and nothing registered after it ever executes. The action filters (unknown parameters, then audit) run inside it. |
| 15 | `Run` | Starts listening. |

**Static files** (step 3 in the usual canonical order) are not used, because this is an API with no files to serve. If they were added, `UseStaticFiles` would go after HTTPS redirection and before CORS, since a file needs no routing.


## Day 59 summary

New this week:
- `CorrelationIdMiddleware`: accepts a safe `X-Correlation-Id` or generates one, stores it as the request's trace id, returns it on every response (including errors) and attaches it to every log line.
- `RequestTimingMiddleware`: logs method, path, status and milliseconds, at Warning above 1000 ms.
- `ApiKeyMiddleware`: short-circuits with 401 on an `/admin` branch. The key comes from configuration (the `Admin__ApiKey` environment variable) and is never committed.
- `AuditActionFilter`: logs the action and its arguments, with phone numbers redacted.
- A fully ordered pipeline with `UseRouting` explicit and `UseRateLimiter`, `UseAuthentication` and `UseAuthorization` present but commented, ready for Days 61 to 63.

Rules this week enforced:
- No scoped service is ever injected into a middleware constructor. Scoped services arrive through `InvokeAsync`.
- The exception middleware is registered before everything else.
- Authentication comes before authorization.

## Capstone verification (from a real run)

Run on 2026-11-23 19:12 against the running API, with the admin key set in the environment. Every check passed:

```
PASS  error response carries the id (body and header): 404 not found
PASS  error response carries the id (body and header): 400 validation
PASS  error response carries the id (body and header): 400 unknown parameter
PASS  error response carries the id (body and header): 401 admin key
PASS  error response carries the id (body and header): 500 deliberate throw
PASS  admin: no key and a wrong key are 401, the right key is 200
PASS  admin: the handler ran for the right key only (exactly once)
PASS  admin: the refused requests never reached the handler
PASS  the correlation id is inside the timing log line
PASS  a slow request is logged as warn
PASS  audit: the order is audited with the phone redacted
PASS  audit: the phone number is nowhere in the log
PASS  audit: a rejected request is never audited
PASS  no scoped service in any middleware constructor
PASS  the exception middleware is registered before everything else
PASS  the pipeline matches the canonical order, including the commented future lines
```

Log lines from the same run. The correlation id is inside the timing line, the slow request is a warning, and the audit entry has the phone redacted:

```
19:06:51 info: AddisEats.Api.Middleware.RequestTimingMiddleware[0] => SpanId:2763e61438ae3fe1, TraceId:969a8dfd800f5246bf999b9399e21375, ParentId:0000000000000000 => ConnectionId:0HNQ9FF4G9PPS => RequestPath:/api/v1/restaurants/9999 RequestId:0HNQ9FF4G9PPS:00000001 => CorrelationId:cap-404 GET /api/v1/restaurants/9999 -> 404 in 31ms

19:06:55 warn: AddisEats.Api.Middleware.RequestTimingMiddleware[0] => SpanId:bbf0f5d9600c8e1e, TraceId:76dd75abd0966ae6744d5add8093259d, ParentId:0000000000000000 => ConnectionId:0HNQ9FF4G9PQ4 => RequestPath:/api/v1/debug/slow RequestId:0HNQ9FF4G9PQ4:00000001 => CorrelationId:cap-slow GET /api/v1/debug/slow -> 200 in 1548ms

19:06:56 info: AddisEats.Api.Filters.AuditActionFilter[0] => SpanId:be211d957224ebbb, TraceId:7b6f625994fa9d853649d3b81aabdb6f, ParentId:0000000000000000 => ConnectionId:0HNQ9FF4G9PQ5 => RequestPath:/api/v1/orders RequestId:0HNQ9FF4G9PQ5:00000001 => CorrelationId:cap-audit => AddisEats.Api.Controllers.OrdersController.Create (AddisEats.Api) Action AddisEats.Api.Controllers.OrdersController.Create (AddisEats.Api) with {"request":{"restaurantId":1,"menuItemId":1,"quantity":2,"phone":"***","isScheduled":false,"scheduledFor":null}}
```


## Logging policy

Six rules, decided once and applied by every service.

1. **Templates, never concatenation.** Every log call uses named placeholders (`"Order {OrderId} placed"`). No `$` strings and no `+`, so logs can be searched by field and not only read.
2. **One line per request**, written by `RequestTimingMiddleware`: method, path, status and duration. Services do not log entry and exit.
3. **Business events at Information.** An order placed, moved or cancelled is countable later.
4. **Rejections at Information.** A validation or business-rule failure is normal traffic: the API is working. Only the catalogue code is logged.
5. **No personal data, ever.** No full phone numbers, addresses, tokens, API keys, connection strings or request bodies. Log the area and the ids.
6. **Every line carries the correlation id.** It is added by the scope in `CorrelationIdMiddleware`. No service adds it itself.

| Event | Level | Why |
|---|---|---|
| A request completed | Information | One line per request |
| An order was placed, moved or cancelled | Information | A business event |
| A request took over one second | Warning | Not broken, but worth investigating |
| Validation or a business rule rejected a request | Information | Normal traffic |
| A dependency was unreachable and a customer suffered | Error | Added when payments and a database exist |
| An unhandled exception | Error | From the exception middleware |
| A delivery fee was computed | Debug | Detail for development only |

## Exercise 2: levels per category

Levels are configured in `appsettings.json`, not in code, and the category is the filter: `ILogger<T>` puts the full type name in the category, so the prefix `AddisEats` controls every one of our own services at once.

```json
"LogLevel": {
  "Default": "Information",
  "Microsoft": "Warning",
  "Microsoft.AspNetCore": "Warning",
  "Microsoft.EntityFrameworkCore": "Warning",
  "Microsoft.Hosting.Lifetime": "Information",
  "AddisEats": "Debug"
}
```

The same single `POST /api/v1/orders`, counted by its correlation id:

| Configuration | Log lines for that one request |
|---|---|
| Everything at Debug (no policy) | 38 |
| This policy (our code at Debug, the framework at Warning) | 5 |

The lines left under the policy:

```
09:29:55 info: AddisEats.Api.Common.Filters.AuditActionFilter[0] => SpanId:04e92eedc80b0d11, TraceId:ef032905c7cdb83bcd1f2024b185284e, ParentId:0000000000000000 => ConnectionId:0HNQBGQNHALT0 => RequestPath:/api/v1/orders RequestId:0HNQBGQNHALT0:00000001 => CorrelationId:vol-test => AddisEats.Api.Controllers.OrdersController.Create (AddisEats.Api) Action AddisEats.Api.Controllers.OrdersController.Create (AddisEats.Api) with {"request":{"restaurantId":1,"menuItemId":1,"quantity":2,"phone":"***","isScheduled":false,"scheduledFor":null}}
09:29:55 dbug: AddisEats.Api.Services.OrderServices.OrderService[0] => SpanId:04e92eedc80b0d11, TraceId:ef032905c7cdb83bcd1f2024b185284e, ParentId:0000000000000000 => ConnectionId:0HNQBGQNHALT0 => RequestPath:/api/v1/orders RequestId:0HNQBGQNHALT0:00000001 => CorrelationId:vol-test => AddisEats.Api.Controllers.OrdersController.Create (AddisEats.Api) Delivery fee for Bole is 50 ETB
09:29:55 info: AddisEats.Api.Services.OrderServices.OrderService[0] => SpanId:04e92eedc80b0d11, TraceId:ef032905c7cdb83bcd1f2024b185284e, ParentId:0000000000000000 => ConnectionId:0HNQBGQNHALT0 => RequestPath:/api/v1/orders RequestId:0HNQBGQNHALT0:00000001 => CorrelationId:vol-test => AddisEats.Api.Controllers.OrdersController.Create (AddisEats.Api) Order 3 placed at restaurant 1 in Bole: 2 x item 1, total 370 ETB
09:29:55 info: AddisEats.Api.Common.Filters.AuditActionFilter[0] => SpanId:04e92eedc80b0d11, TraceId:ef032905c7cdb83bcd1f2024b185284e, ParentId:0000000000000000 => ConnectionId:0HNQBGQNHALT0 => RequestPath:/api/v1/orders RequestId:0HNQBGQNHALT0:00000001 => CorrelationId:vol-test => AddisEats.Api.Controllers.OrdersController.Create (AddisEats.Api) Action AddisEats.Api.Controllers.OrdersController.Create (AddisEats.Api) finished with 201
09:29:55 info: AddisEats.Api.Middleware.RequestTimingMiddleware[0] => SpanId:04e92eedc80b0d11, TraceId:ef032905c7cdb83bcd1f2024b185284e, ParentId:0000000000000000 => ConnectionId:0HNQBGQNHALT0 => RequestPath:/api/v1/orders RequestId:0HNQBGQNHALT0:00000001 => CorrelationId:vol-test POST /api/v1/orders -> 201 in 129ms
```

In Module 7 these logs go to an aggregator and storage becomes a line on a bill. The framework logs every routing decision and every filter it runs, which is rarely useful. `Microsoft.Hosting.Lifetime` stays at Information so the startup line (Now listening on...) is still printed.

## Exercise 3: the correlation id inside OrderService

A real line written by `OrderService`, with the id from the `X-Correlation-Id` header:

```

```

**How it got there:** `CorrelationIdMiddleware` opens a logger scope (`BeginScope`) around the rest of the pipeline, and a scope follows the request through every call and `await` it makes (it travels in async-local state), so every log call made while that request is being handled picks it up automatically. `OrderService` receives nothing and passes nothing along.

## Exercise 3: the correlation id inside OrderService

A real line written by `OrderService`, with the id from the `X-Correlation-Id` header:

```
09:32:11 info: AddisEats.Api.Services.OrderServices.OrderService[0] => SpanId:f4f42f9a8d27d0ef, TraceId:150473bcca60ebe3e66dddaa7778a19e, ParentId:0000000000000000 => ConnectionId:0HNQBGRATD28K => RequestPath:/api/v1/orders RequestId:0HNQBGRATD28K:00000001 => CorrelationId:corr-in-service => AddisEats.Api.Controllers.OrdersController.Create (AddisEats.Api) Order 3 placed at restaurant 1 in Bole: 2 x item 1, total 370 ETB
```

**How it got there:** `CorrelationIdMiddleware` opens a logger scope (`BeginScope`) around the rest of the pipeline, and a scope follows the request through every call and `await` it makes (it travels in async-local state), so every log call made while that request is being handled picks it up automatically. `OrderService` receives nothing and passes nothing along.
