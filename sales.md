## Sales Module

### `GET /api/sales` - Get all sales

**Description:** This endpoint retrieves a paginated list of all sales. It can be filtered by a date range, credit status, and sale status.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/sales`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Query Parameters:**
  - `page` (optional): The page number to retrieve. Defaults to `1`.
  - `limit` (optional): The number of items to retrieve per page. Defaults to `10`.
  - `startDate` (optional): The start date of the date range to filter by.
  - `endDate` (optional): The end date of the date range to filter by.
  - `isCredit` (optional): Filter by credit status.
  - `status` (optional): Filter by sale status.

**Example URL with Query Parameters:**
`http://localhost:3000/api/sales?page=1&limit=5&startDate=2025-09-01&endDate=2025-09-30`

**Successful Response (Status: 201 Created):**
```json
{
  "sale": {
    "id": 50,
    "customerId": 1,
    "soldById": 2,
    "isCredit": true,
    "creditDueDate": null,
    "total": 1000,
    "status": "unpaid",
    "createdAt": "2025-10-01T00:00:00.000Z",
    "updatedAt": "2025-10-01T00:00:00.000Z",
    "items": [
      {
        "id": 66,
        "saleId": 50,
        "productId": 1,
        "quantity": 2,
        "price": 500,
        "notes": null
      }
    ]
  },
  "outstandingPayments": 1000
}
```

### `POST /api/sales/:id/payments` - Create a new payment for a sale

**Description:** This endpoint creates a new payment for a sale.

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/sales/8/payments`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "amount": 500
  }
  ```

**Successful Response (Status: 201 Created):**
```json
{
  "id": 1,
  "amount": 500,
  "customerId": 1,
  "saleId": 8,
  "paymentDate": "2025-10-18T11:46:03.210Z",
  "notes": null
}
```

### `GET /api/sales/:id/payments` - Get all payments for a sale

**Description:** This endpoint retrieves all payments for a sale.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/sales/8/payments`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
[
  {
    "id": 1,
    "amount": 500,
    "customerId": 1,
    "saleId": 8,
    "paymentDate": "2025-10-18T11:46:03.210Z",
    "notes": null
  }
]
```

### `GET /api/sales/:id` - Get a single sale

**Description:** This endpoint retrieves a single sale by its ID.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/sales/8`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
{
  "id": 8,
  "customerId": 1,
  "soldById": 1,
  "isCredit": true,
  "creditDueDate": null,
  "total": 1000,
  "status": "unpaid",
  "paymentStatus": "PARTIALLY_PAID",
  "createdAt": "2025-10-18T11:45:42.973Z",
  "updatedAt": "2025-10-18T11:46:04.501Z",
  "items": [
    {
      "id": 9,
      "saleId": 8,
      "productId": 1,
      "quantity": 2,
      "price": 500,
      "notes": null,
      "name": "Candy"
    }
  ],
  "customer": {
    "id": 1,
    "name": "irene",
    "email": "irene@gmail.com",
    "phone": "+255762559849",
    "address": null,
    "status": "inactive",
    "isCredit": true,
    "creditLimit": 1000000,
    "currentCredit": 500,
    "loyaltyPoints": 0,
    "birthday": null,
    "notes": null,
    "createdAt": "2025-10-13T10:35:50.993Z",
    "updatedAt": "2025-10-18T11:46:03.548Z",
    "createdById": 1,
    "updatedById": 1
  }
}
```