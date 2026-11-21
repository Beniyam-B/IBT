# AddisEats.Api (Day 58): validation and error handling

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
| 6 | POST | `/api/v1/menu-items` | Create a menu item | 201 | 400, 422 |
| 7 | POST | `/api/v1/orders` | Place an order | 201 | 400, 404, 409, 422 |
| 8 | GET | `/api/v1/orders/{id}` | Read one order | 200 | 404 |
| 9 | PATCH | `/api/v1/orders/{id}/status` | Move an order forward | 200 | 400, 404, 409 |
| 10 | DELETE | `/api/v1/orders/{id}` | Cancel an order | 204 | 404, 409 |

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
| `AMOUNT_INVALID` | 422 | A quantity or a price of zero or less | Must be greater than zero |
| `ITEM_NOT_ON_MENU` | 422 | The menu item does not belong to that restaurant | That item is not on this restaurant's menu |
| `INTERNAL_ERROR` | 500 | An unhandled exception (made global on Day 58) | Something went wrong on our side |

### One error shape
Every error body is a ProblemDetails (RFC 7807) with an extra `code` field:

```json
{
  "type": "https://addiseats.et/errors/restaurant-not-found",
  "title": "The restaurant was not found.",
  "status": 404,
  "detail": "Restaurant 9999 does not exist.",
  "instance": "/api/v1/restaurants/9999",
  "code": "RESTAURANT_NOT_FOUND"
}
```

Validation errors add an `errors` object, so a frontend can attach each message to a form field. No error body ever contains a stack trace.

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

