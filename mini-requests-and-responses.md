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

### `POST /api/sales` - Create a new sale

**Description:** This endpoint creates a new sale.

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/sales`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "customerId": 1,
    "isCredit": true,
    "total": 1000,
    "items": [
      {
        "productId": 1,
        "quantity": 2,
        "price": 500
      }
    ]
  }
  ```

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
  "outstandingBalance": 1000,
  "paid": 4000
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

### `GET /api/sales/payments` - Get all payments

**Description:** This endpoint retrieves a paginated list of all payments. It can be filtered by a date range.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/sales/payments`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Query Parameters:**
  - `page` (optional): The page number to retrieve. Defaults to `1`.
  - `limit` (optional): The number of items to retrieve per page. Defaults to `10`.
  - `startDate` (optional): The start date of the date range to filter by.
  - `endDate` (optional): The end date of the date range to filter by.

**Example URL with Query Parameters:**
`http://localhost:3000/api/sales/payments?page=1&limit=5&startDate=2025-09-01&endDate=2025-09-30`

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
  },
  {
    "id": 2,
    "amount": 1000,
    "customerId": 2,
    "saleId": 9,
    "paymentDate": "2025-10-19T12:00:00.000Z",
    "notes": "Cash payment"
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

## Customers Module

### `GET /api/customers` - Get all customers

**Description:** This endpoint retrieves a paginated list of all customers.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/customers`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Query Parameters:**
  - `page` (optional): The page number to retrieve. Defaults to `1`.
  - `limit` (optional): The number of items to retrieve per page. Defaults to `10`.

**Successful Response (Status: 200 OK):**
```json
[
  {
    "id": 1,
    "name": "irene",
    "email": "irene@gmail.com",
    "phone": "+255762559849",
    "address": null,
    "status": "active",
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
]
```

### `POST /api/customers` - Create a new customer

**Description:** This endpoint creates a new customer.

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/customers`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "isCredit": false
  }
  ```

**Successful Response (Status: 201 Created):**
```json
{
  "id": 2,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "address": "123 Main St",
  "status": "active",
  "isCredit": false,
  "creditLimit": null,
  "currentCredit": null,
  "loyaltyPoints": null,
  "birthday": null,
  "notes": null,
  "createdAt": "2025-10-23T10:00:00.000Z",
  "updatedAt": "2025-10-23T10:00:00.000Z",
  "createdById": 1,
  "updatedById": 1
}
```

### `GET /api/customers/:id` - Get a single customer

**Description:** This endpoint retrieves a single customer by its ID.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/customers/1`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
{
  "id": 1,
  "name": "irene",
  "email": "irene@gmail.com",
  "phone": "+255762559849",
  "address": null,
  "status": "active",
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
```

### `PUT /api/customers/:id` - Update a customer

**Description:** This endpoint updates a customer.

**Request:**
- **Method:** `PUT`
- **URL:** `http://localhost:3000/api/customers/1`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "address": "456 Oak Ave"
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "id": 1,
  "name": "irene",
  "email": "irene@gmail.com",
  "phone": "+255762559849",
  "address": "456 Oak Ave",
  "status": "active",
  "isCredit": true,
  "creditLimit": 1000000,
  "currentCredit": 500,
  "loyaltyPoints": 0,
  "birthday": null,
  "notes": null,
  "createdAt": "2025-10-13T10:35:50.993Z",
  "updatedAt": "2025-10-23T10:05:00.000Z",
  "createdById": 1,
  "updatedById": 1
}
```

### `DELETE /api/customers/:id` - Delete a customer

**Description:** This endpoint deletes a customer by its ID.

**Request:**
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/api/customers/1`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 204 No Content):**

## Purchases Module

### `GET /api/purchases/summary` - Get purchases summary

**Description:** This endpoint retrieves a summary of purchases.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/purchases/summary`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
{
  "totalPurchasesThisMonth": 1500,
  "pendingPurchaseOrders": 2,
  "purchaseGrowth": "50.00",
  "weeklyPurchasesList": [
    {
      "weekStart": "2025-09-29",
      "total": 500
    },
    {
      "weekStart": "2025-10-06",
      "total": 1000
    },
    {
      "weekStart": "2025-10-13",
      "total": 0
    },
    {
      "weekStart": "2025-10-20",
      "total": 0
    }
  ]
}
```

### `GET /api/purchases/orders` - Get all purchase orders

**Description:** This endpoint retrieves a paginated list of all purchase orders. It can be filtered by status, date range, and a search query.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/purchases/orders`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Query Parameters:**
  - `page` (optional): The page number to retrieve. Defaults to `1`.
  - `limit` (optional): The number of items to retrieve per page. Defaults to `10`.
  - `status` (optional): Filter by purchase order status.
  - `startDate` (optional): The start date of the date range to filter by.
  - `endDate` (optional): The end date of the date range to filter by.
  - `search` (optional): A search query to filter by purchase order ID or supplier name.

**Example URL with Query Parameters:**
`http://localhost:3000/api/purchases/orders?page=1&limit=10&status=pending`

**Successful Response (Status: 200 OK):**
```json
{
  "purchaseOrders": [
    {
      "id": 1,
      "supplierId": 1,
      "totalCost": 100,
      "status": "pending",
      "notes": "Urgent order",
      "createdAt": "2025-10-21T10:00:00.000Z",
      "updatedAt": "2025-10-21T10:00:00.000Z",
      "createdById": 1,
      "items": [
        {
          "id": 1,
          "purchaseOrderId": 1,
          "inventoryItemId": 1,
          "quantity": 10,
          "price": 10
        }
      ],
      "goodsReceipts": [],
      "supplier": {
        "id": 1,
        "name": "Supplier A"
      }
    }
  ],
  "total": 1
}
```

### `POST /api/purchases/orders` - Create a new purchase order

**Description:** This endpoint creates a new purchase order.

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/purchases/orders`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "supplierId": 1,
    "totalCost": 100,
    "status": "pending",
    "notes": "Urgent order",
    "items": [
      {
        "inventoryItemId": 1,
        "quantity": 10,
        "price": 10
      }
    ]
  }
  ```

**Successful Response (Status: 201 Created):**
```json
{
  "id": 2,
  "supplierId": 1,
  "totalCost": 100,
  "status": "pending",
  "notes": "Urgent order",
  "createdAt": "2025-10-21T11:00:00.000Z",
  "updatedAt": "2025-10-21T11:00:00.000Z",
  "createdById": 1,
  "items": [
    {
      "id": 2,
      "purchaseOrderId": 2,
      "inventoryItemId": 1,
      "quantity": 10,
      "price": 10
    }
  ]
}
```

### `GET /api/purchases/orders/:id` - Get a single purchase order

**Description:** This endpoint retrieves a single purchase order by its ID.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/purchases/orders/1`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
{
  "id": 1,
  "supplierId": 1,
  "totalCost": 100,
  "status": "pending",
  "notes": "Urgent order",
  "createdAt": "2025-10-21T10:00:00.000Z",
  "updatedAt": "2025-10-21T10:00:00.000Z",
  "createdById": 1,
  "items": [
    {
      "id": 1,
      "purchaseOrderId": 1,
      "inventoryItemId": 1,
      "quantity": 10,
      "price": 10
    }
  ]
}
```

### `PUT /api/purchases/orders/:id` - Update a purchase order

**Description:** This endpoint updates a purchase order.

**Request:**
- **Method:** `PUT`
- **URL:** `http://localhost:3000/api/purchases/orders/1`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "notes": "Updated notes"
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "id": 1,
  "supplierId": 1,
  "totalCost": 100,
  "status": "pending",
  "notes": "Updated notes",
  "createdAt": "2025-10-21T10:00:00.000Z",
  "updatedAt": "2025-10-21T11:05:00.000Z",
  "createdById": 1,
  "supplier": {
    "id": 1,
    "name": "Supplier A"
  },
  "items": [
    {
      "id": 1,
      "purchaseOrderId": 1,
      "inventoryItemId": 1,
      "quantity": 10,
      "price": 10
    }
  ]
}
```

### `PATCH /api/purchases/orders/:id/status` - Update purchase order status

**Description:** This endpoint updates the status of a purchase order.

**Request:**
- **Method:** `PATCH`
- **URL:** `http://localhost:3000/api/purchases/orders/1/status`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "status": "approved"
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "id": 1,
  "supplierId": 1,
  "totalCost": 100,
  "status": "approved",
  "notes": "Updated notes",
  "createdAt": "2025-10-21T10:00:00.000Z",
  "updatedAt": "2025-10-21T11:10:00.000Z",
  "createdById": 1,
  "supplier": {
    "id": 1,
    "name": "Supplier A"
  },
  "items": [
    {
      "id": 1,
      "purchaseOrderId": 1,
      "inventoryItemId": 1,
      "quantity": 10,
      "price": 10
    }
  ]
}
```

### `DELETE /api/purchases/orders/:id` - Delete a purchase order

**Description:** This endpoint deletes a purchase order by its ID.

**Request:**
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/api/purchases/orders/1`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 204 No Content):**

### `GET /api/purchases/receiving` - Get all goods receipts

**Description:** This endpoint retrieves a paginated list of all goods receipts. It can be filtered by status, date range, and a search query.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/purchases/receiving`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Query Parameters:**
  - `page` (optional): The page number to retrieve. Defaults to `1`.
  - `limit` (optional): The number of items to retrieve per page. Defaults to `10`.
  - `status` (optional): Filter by goods receipt status.
  - `startDate` (optional): The start date of the date range to filter by.
  - `endDate` (optional): The end date of the date range to filter by.
  - `search` (optional): A search query to filter by purchase order ID or supplier name.

**Example URL with Query Parameters:**
`http://localhost:3000/api/purchases/receiving?page=1&limit=10&status=completed`

**Successful Response (Status: 200 OK):**
```json
{
  "goodsReceipts": [
    {
      "id": 1,
      "purchaseOrderId": 1,
      "receivedDate": "2025-10-21T12:00:00.000Z",
      "receivedQuantity": 10,
      "status": "completed",
      "notes": "All items received.",
      "createdAt": "2025-10-21T12:00:00.000Z",
      "updatedAt": "2025-10-21T12:00:00.000Z",
      "createdById": 1,
      "purchaseOrder": {
        "id": 1,
        "supplier": {
          "id": 1,
          "name": "Supplier A"
        }
      },
      "supplierName": "Supplier A",
      "total": 100
    }
  ],
  "total": 1
}
```

### `POST /api/purchases/receiving` - Create a new goods receipt

**Description:** This endpoint creates a new goods receipt.

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/purchases/receiving`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "purchaseOrderId": 1,
    "receivedDate": "2025-10-21T12:00:00.000Z",
    "notes": "All items received.",
    "items": [
      {
        "inventoryItemId": 1,
        "receivedQuantity": 10
      }
    ]
  }
  ```

**Successful Response (Status: 201 Created):**
```json
{
  "id": 2,
  "purchaseOrderId": 1,
  "receivedDate": "2025-10-21T12:00:00.000Z",
  "receivedQuantity": 10,
  "status": "completed",
  "notes": "All items received.",
  "createdAt": "2025-10-21T12:05:00.000Z",
  "updatedAt": "2025-10-21T12:05:00.000Z",
  "createdById": 1
}
```

### `GET /api/purchases/receiving/:id` - Get a single goods receipt

**Description:** This endpoint retrieves a single goods receipt by its ID.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/purchases/receiving/1`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
{
  "id": 1,
  "purchaseOrderId": 1,
  "receivedDate": "2025-10-21T12:00:00.000Z",
  "receivedQuantity": 10,
  "status": "completed",
  "notes": "All items received.",
  "createdAt": "2025-10-21T12:00:00.000Z",
  "updatedAt": "2025-10-21T12:00:00.000Z",
  "createdById": 1
}
```

### `PUT /api/purchases/receiving/:id` - Update a goods receipt

**Description:** This endpoint updates a goods receipt.

**Request:**
- **Method:** `PUT`
- **URL:** `http://localhost:3000/api/purchases/receiving/1`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "notes": "Updated notes for goods receipt."
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "id": 1,
  "purchaseOrderId": 1,
  "receivedDate": "2025-10-21T12:00:00.000Z",
  "receivedQuantity": 10,
  "status": "completed",
  "notes": "Updated notes for goods receipt.",
  "createdAt": "2025-10-21T12:00:00.000Z",
  "updatedAt": "2025-10-21T12:10:00.000Z",
  "createdById": 1
}
```

### `DELETE /api/purchases/receiving/:id` - Delete a goods receipt

**Description:** This endpoint deletes a goods receipt by its ID.

**Request:**
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/api/purchases/receiving/1`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 204 No Content):**

## Production Module

### `POST /api/production` - Create a new production run

**Description:** This endpoint creates a new production run.

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/production`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "productId": 1,
    "quantity": 100,
    "notes": "Morning batch"
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "id": 1,
  "productId": 1,
  "quantityProduced": 100,
  "producedById": 1,
  "notes": "Morning batch",
  "status": "PENDING",
  "cost": 15000,
  "createdAt": "2025-10-21T10:00:00.000Z",
  "updatedAt": "2025-10-21T10:00:00.000Z",
  "finalizedAt": null,
  "updatedById": 1
}
```

### `PUT /api/production/:id` - Update a production run

**Description:** This endpoint updates a production run.

**Request:**
- **Method:** `PUT`
- **URL:** `http://localhost:3000/api/production/1`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "quantityProduced": 120,
    "notes": "Morning batch, updated quantity"
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "id": 1,
  "productId": 1,
  "quantityProduced": 120,
  "producedById": 1,
  "notes": "Morning batch, updated quantity",
  "status": "PENDING",
  "cost": 18000,
  "createdAt": "2025-10-21T10:00:00.000Z",
  "updatedAt": "2025-10-21T10:05:00.000Z",
  "finalizedAt": null,
  "updatedById": 1
}
```

### `PATCH /api/production/:id/finalize` - Finalize a production run

**Description:** This endpoint finalizes a production run.

**Request:**
- **Method:** `PATCH`
- **URL:** `http://localhost:3000/api/production/1/finalize`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "userId": 1
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "id": 1,
  "productId": 1,
  "quantityProduced": 120,
  "producedById": 1,
  "notes": "Morning batch, updated quantity",
  "status": "FINALIZED",
  "cost": 18000,
  "createdAt": "2025-10-21T10:00:00.000Z",
  "updatedAt": "2025-10-21T10:10:00.000Z",
  "finalizedAt": "2025-10-21T10:10:00.000Z",
  "updatedById": 1
}
```

### `GET /api/production` - Get all production runs

**Description:** This endpoint retrieves a paginated list of all production runs. It can be filtered by a date range and product name.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/production`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Query Parameters:**
  - `page` (optional): The page number to retrieve. Defaults to `1`.
  - `limit` (optional): The number of items to retrieve per page. Defaults to `10`.
  - `startDate` (optional): The start date of the date range to filter by.
  - `endDate` (optional): The end date of the date range to filter by.
  - `productName` (optional): The name of the product to filter by.

**Example URL with Query Parameters:**
`http://localhost:3000/api/production?page=1&limit=10&startDate=2025-10-01&endDate=2025-10-31`

**Successful Response (Status: 200 OK):**
```json
{
  "productionRuns": [
    {
      "id": 1,
      "productId": 1,
      "quantityProduced": 120,
      "producedById": 1,
      "notes": "Morning batch, updated quantity",
      "status": "FINALIZED",
      "cost": 18000,
      "createdAt": "2025-10-21T10:00:00.000Z",
      "updatedAt": "2025-10-21T10:10:00.000Z",
      "finalizedAt": "2025-10-21T10:10:00.000Z",
      "updatedById": 1,
      "product": {
        "id": 1,
        "name": "Croissant"
      },
      "producedBy": {
        "id": 1,
        "name": "Admin User"
      },
      "updatedBy": {
        "id": 1,
        "name": "Admin User"
      }
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

### `GET /api/production/:id` - Get a single production run

**Description:** This endpoint retrieves a single production run by its ID.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/production/1`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
{
  "id": 1,
  "productId": 1,
  "quantityProduced": 120,
  "producedById": 1,
  "notes": "Morning batch, updated quantity",
  "status": "FINALIZED",
  "cost": 18000,
  "createdAt": "2025-10-21T10:00:00.000Z",
  "updatedAt": "2025-10-21T10:10:00.000Z",
  "finalizedAt": "2025-10-21T10:10:00.000Z",
  "updatedById": 1,
  "product": {
    "id": 1,
    "name": "Croissant"
  },
  "ingredientsDeducted": [
    {
      "name": "Flour",
      "amountDeducted": 12,
      "unit": "kg",
      "cost": 12000
    },
    {
      "name": "Butter",
      "amountDeducted": 6,
      "unit": "kg",
      "cost": 6000
    }
  ]
}
```

## Products Module

### `GET /api/products` - Get all products

**Description:** This endpoint retrieves a list of all products.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/products`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
[
  {
    "id": 1,
    "name": "Croissant",
    "description": "A buttery, flaky, viennoiserie pastry.",
    "price": 2.5,
    "image": null,
    "instructions": [],
    "prepTime": 30,
    "quantity": 100,
    "batchSize": 10,
    "status": "active",
    "createdAt": "2025-10-21T10:00:00.000Z",
    "updatedAt": "2025-10-21T10:00:00.000Z",
    "createdById": 1,
    "updatedById": 1,
    "productRecipes": [
      {
        "id": 1,
        "productId": 1,
        "inventoryItemId": 1,
        "amountRequired": 0.1,
        "inventoryItem": {
          "id": 1,
          "name": "Flour",
          "unit": "kg"
        }
      }
    ]
  }
]
```

### `POST /api/products` - Create a new product

**Description:** This endpoint creates a new product.

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/products`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "name": "Baguette",
    "description": "A long, thin loaf of French bread.",
    "price": 3,
    "prepTime": 20,
    "batchSize": 5,
    "status": "active",
    "productRecipes": [
      {
        "inventoryItemId": 1,
        "amountRequired": 0.5
      }
    ]
  }
  ```

**Successful Response (Status: 201 Created):**
```json
{
  "id": 2,
  "name": "Baguette",
  "description": "A long, thin loaf of French bread.",
  "price": 3,
  "image": null,
  "instructions": [],
  "prepTime": 20,
  "quantity": 0,
  "batchSize": 5,
  "status": "active",
  "createdAt": "2025-10-21T11:00:00.000Z",
  "updatedAt": "2025-10-21T11:00:00.000Z",
  "createdById": 1,
  "updatedById": 1,
  "productRecipes": [
    {
      "id": 2,
      "productId": 2,
      "inventoryItemId": 1,
      "amountRequired": 0.5,
      "inventoryItem": {
        "id": 1,
        "name": "Flour",
        "unit": "kg"
      }
    }
  ]
}
```

### `GET /api/products/:id` - Get a single product

**Description:** This endpoint retrieves a single product by its ID.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/products/1`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
{
  "id": 1,
  "name": "Croissant",
  "description": "A buttery, flaky, viennoiserie pastry.",
  "price": 2.5,
  "image": null,
  "instructions": [],
  "prepTime": 30,
  "quantity": 100,
  "batchSize": 10,
  "status": "active",
  "createdAt": "2025-10-21T10:00:00.000Z",
  "updatedAt": "2025-10-21T10:00:00.000Z",
  "createdById": 1,
  "updatedById": 1,
  "productRecipes": [
    {
      "id": 1,
      "productId": 1,
      "inventoryItemId": 1,
      "amountRequired": 0.1,
      "inventoryItem": {
        "id": 1,
        "name": "Flour",
        "unit": "kg"
      }
    }
  ]
}
```

### `PUT /api/products/:id` - Update a product

**Description:** This endpoint updates a product.

**Request:**
- **Method:** `PUT`
- **URL:** `http://localhost:3000/api/products/1`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "price": 2.75,
    "productRecipes": [
      {
        "inventoryItemId": 1,
        "amountRequired": 0.12
      }
    ]
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "id": 1,
  "name": "Croissant",
  "description": "A buttery, flaky, viennoiserie pastry.",
  "price": 2.75,
  "image": null,
  "instructions": [],
  "prepTime": 30,
  "quantity": 100,
  "batchSize": 10,
  "status": "active",
  "createdAt": "2025-10-21T10:00:00.000Z",
  "updatedAt": "2025-10-21T11:05:00.000Z",
  "createdById": 1,
  "updatedById": 1,
  "productRecipes": [
    {
      "id": 3,
      "productId": 1,
      "inventoryItemId": 1,
      "amountRequired": 0.12,
      "inventoryItem": {
        "id": 1,
        "name": "Flour",
        "unit": "kg"
      }
    }
  ]
}
```

### `DELETE /api/products/:id` - Delete a product

**Description:** This endpoint deletes a product by its ID.

**Request:**
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/api/products/1`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 204 No Content):**

## Inventory Module

### `GET /api/inventory/summary` - Get inventory summary

**Description:** This endpoint retrieves a summary of the inventory, including low stock and out of stock items.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/inventory/summary`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
{
  "lowStock": {
    "count": 1,
    "items": [
      {
        "id": 1,
        "name": "Flour",
        "currentQuantity": 5,
        "minLevel": 10,
        "type": "raw_material"
      }
    ]
  },
  "outOfStock": {
    "count": 0,
    "items": []
  },
  "materialsUsed": {
    "count": 1,
    "items": [
      {
        "materialName": "Flour",
        "amountDeducted": 12,
        "unit": "kg",
        "productName": "Croissant",
        "quantityProduced": 120
      }
    ]
  },
  "topSellingProducts": {
    "count": 1,
    "items": [
      {
        "productName": "Croissant",
        "totalQuantitySold": 15,
        "numberOfSales": 5,
        "quantityOnHand": 100
      }
    ]
  },
  "weeklyAdjustments": {
    "count": 1,
    "items": [
      {
        "itemName": "Flour",
        "amount": -5,
        "unit": "kg",
        "reason": "Damaged goods",
        "createdBy": "Admin User",
        "createdAt": "2025-10-21T12:00:00.000Z"
      }
    ]
  }
}
```

### `GET /api/inventory` - Get all inventory items

**Description:** This endpoint retrieves a list of all inventory items. It can be filtered by type.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/inventory`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Query Parameters:**
  - `type` (optional): Filter by item type (`raw_material` or `supply`).

**Example URL with Query Parameters:**
`http://localhost:3000/api/inventory?type=raw_material`

**Successful Response (Status: 200 OK):**
```json
[
  {
    "id": 1,
    "name": "Flour",
    "type": "raw_material",
    "unit": "kg",
    "currentQuantity": 50,
    "minLevel": 10,
    "cost": 1.5,
    "createdAt": "2025-10-21T10:00:00.000Z",
    "updatedAt": "2025-10-21T10:00:00.000Z",
    "createdById": 1,
    "updatedById": 1
  }
]
```

### `POST /api/inventory` - Create a new inventory item

**Description:** This endpoint creates a new inventory item.

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/inventory`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "name": "Sugar",
    "type": "raw_material",
    "unit": "kg",
    "currentQuantity": 100,
    "minLevel": 20,
    "cost": 2
  }
  ```

**Successful Response (Status: 201 Created):**
```json
{
  "id": 2,
  "name": "Sugar",
  "type": "raw_material",
  "unit": "kg",
  "currentQuantity": 100,
  "minLevel": 20,
  "cost": 2,
  "createdAt": "2025-10-21T11:00:00.000Z",
  "updatedAt": "2025-10-21T11:00:00.000Z",
  "createdById": 1,
  "updatedById": 1
}
```

### `GET /api/inventory/:id` - Get a single inventory item

**Description:** This endpoint retrieves a single inventory item by its ID.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/inventory/1`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
{
  "id": 1,
  "name": "Flour",
  "type": "raw_material",
  "unit": "kg",
  "currentQuantity": 50,
  "minLevel": 10,
  "cost": 1.5,
  "createdAt": "2025-10-21T10:00:00.000Z",
  "updatedAt": "2025-10-21T10:00:00.000Z",
  "createdById": 1,
  "updatedById": 1
}
```

### `PUT /api/inventory/:id` - Update an inventory item

**Description:** This endpoint updates an inventory item.

**Request:**
- **Method:** `PUT`
- **URL:** `http://localhost:3000/api/inventory/1`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "minLevel": 15,
    "cost": 1.75
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "id": 1,
  "name": "Flour",
  "type": "raw_material",
  "unit": "kg",
  "currentQuantity": 50,
  "minLevel": 15,
  "cost": 1.75,
  "createdAt": "2025-10-21T10:00:00.000Z",
  "updatedAt": "2025-10-21T11:05:00.000Z",
  "createdById": 1,
  "updatedById": 1
}
```

### `DELETE /api/inventory/:id` - Delete an inventory item

**Description:** This endpoint deletes an inventory item by its ID.

**Request:**
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/api/inventory/1`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 204 No Content):**

## Adjustments Module

### `POST /api/adjustments` - Create a new inventory adjustment

**Description:** This endpoint creates a new inventory adjustment.

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/adjustments`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "inventoryItemId": 1,
    "amount": -5,
    "reason": "Damaged goods"
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "adjustment": {
    "id": 1,
    "inventoryItemId": 1,
    "amount": -5,
    "reason": "Damaged goods",
    "createdById": 1,
    "createdAt": "2025-10-21T12:00:00.000Z",
    "updatedAt": "2025-10-21T12:00:00.000Z"
  },
  "inventoryItem": {
    "id": 1,
    "name": "Flour",
    "type": "raw_material",
    "unit": "kg",
    "currentQuantity": 45,
    "minLevel": 15,
    "cost": 1.75,
    "createdAt": "2025-10-21T10:00:00.000Z",
    "updatedAt": "2025-10-21T12:00:00.000Z",
    "createdById": 1,
    "updatedById": 1
  }
}
```

### `GET /api/adjustments` - Get all inventory adjustments

**Description:** This endpoint retrieves a paginated list of all inventory adjustments. It can be filtered by date range, type, name, and a search query.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/adjustments`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Query Parameters:**
  - `page` (optional): The page number to retrieve. Defaults to `1`.
  - `limit` (optional): The number of items to retrieve per page. Defaults to `10`.
  - `startDate` (optional): The start date of the date range to filter by.
  - `endDate` (optional): The end date of the date range to filter by.
  - `type` (optional): Filter by item type (`raw_material` or `supply`).
  - `name` (optional): Filter by item name.
  - `search` (optional): A search query to filter by item name or reason.

**Example URL with Query Parameters:**
`http://localhost:3000/api/adjustments?page=1&limit=10&type=raw_material`

**Successful Response (Status: 200 OK):**
```json
{
  "adjustments": [
    {
      "id": 1,
      "inventoryItemId": 1,
      "amount": -5,
      "reason": "Damaged goods",
      "createdById": 1,
      "createdAt": "2025-10-21T12:00:00.000Z",
      "updatedAt": "2025-10-21T12:00:00.000Z",
      "inventoryItem": {
        "id": 1,
        "name": "Flour",
        "type": "raw_material"
      },
      "createdBy": {
        "id": 1,
        "name": "Admin User"
      }
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

## Authentication

### `POST /api/auth/register` - Register a new user

**Description:** This endpoint registers a new user. It is recommended to create roles using the `/api/users/roles` endpoint first and then provide the `roleId` during registration.

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/register`
- **Headers:**
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "email": "admin@example.com",
    "password": "password123",
    "name": "Admin User",
    "roleId": 1
  }
  ```

**Successful Response (Status: 201 Created):**
```json
{
  "id": 1,
  "email": "admin@example.com"
}
```

### `POST /api/auth/login` - Login a user

**Description:** This endpoint authenticates a user and returns a JWT token.

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/login`
- **Headers:**
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "email": "admin@example.com",
    "password": "password123"
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin",
    "permissions": ["all"]
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJhZG1pbiIsInBlcm1pc3Npb25zIjpbImFsbCJdLCJpYXQiOjE3NTk0MDkxNjgsImV4cCI6MTc1OTQxMDA2OH0.mVEMO0EDE9tNgZl-x2ORypHrogYapvkc6fwNSfLUkkk"
}
```

### `POST /api/auth/login-with-code` - Login with a 6-digit code

**Description:** This endpoint authenticates a user with their email and a 6-digit code and returns a JWT token. This endpoint is rate-limited to 5 requests per 15 minutes per IP address. After 10 failed attempts, the account will be locked for 15 minutes.

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/login-with-code`
- **Headers:**
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "email": "admin@example.com",
    "loginCode": "123456"
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin",
    "permissions": ["all"]
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJhZG1pbiIsInBlcm1pc3Npb25zIjpbImFsbCJdLCJpYXQiOjE3NTk0MDkxNjgsImV4cCI6MTc1OTQxMDA2OH0.mVEMO0EDE9tNgZl-x2ORypHrogYapvkc6fwNSfLUkkk"
}
```

### `POST /api/auth/refresh-token` - Refresh a JWT token

**Description:** This endpoint refreshes a JWT token using a refresh token.

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/refresh-token`
- **Headers:**
  - `Cookie: refreshToken=<YOUR_REFRESH_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
{
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin",
    "permissions": ["all"]
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJhZG1pbiIsInBlcm1pc3Npb25zIjpbImFsbCJdLCJpYXQiOjE3NTk0MDkxNjgsImV4cCI6MTc1OTQxMDA2OH0.mVEMO0EDE9tNgZl-x2ORypHrogYapvkc6fwNSfLUkkk"
}
```

### `POST /api/auth/reset-password` - Reset a user's password

**Description:** This endpoint resets a user's password. This is intended to be used by an admin.

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/reset-password`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <ADMIN_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "newPassword": "newPassword123"
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "message": "Password reset successfully"
}
```

### `POST /api/auth/logout` - Logout a user

**Description:** This endpoint logs out a user by clearing the refresh token cookie.

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/logout`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 204 No Content):**

### `GET /api/auth/me` - Get the current user

**Description:** This endpoint retrieves the currently authenticated user's information.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/auth/me`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
{
  "id": 1,
  "email": "admin@example.com",
  "name": "Admin User",
  "role": "admin",
  "permissions": ["all"]
}
```

### `PUT /api/auth/me` - Update the current user

**Description:** This endpoint updates the currently authenticated user's information.

**Request:**
- **Method:** `PUT`
- **URL:** `http://localhost:3000/api/auth/me`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "name": "New Name",
    "currentPassword": "password123",
    "newPassword": "newPassword123"
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "id": 1,
  "email": "admin@example.com",
  "name": "New Name",
  "role": {
    "id": 1,
    "name": "admin",
    "description": null,
    "permissions": ["all"]
  }
}
```

### `POST /api/auth/login-with-code` - Login with a 6-digit code

**Description:** This endpoint authenticates a user with their email and a 6-digit code and returns a JWT token. This endpoint is rate-limited to 5 requests per 15 minutes per IP address. After 10 failed attempts, the account will be locked for 15 minutes.

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/login-with-code`
- **Headers:**
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "email": "admin@example.com",
    "loginCode": "123456"
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin",
    "permissions": ["all"]
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJhZG1pbiIsInBlcm1pc3Npb25zIjpbImFsbCJdLCJpYXQiOjE3NTk0MDkxNjgsImV4cCI6MTc1OTQxMDA2OH0.mVEMO0EDE9tNgZl-x2ORypHrogYapvkc6fwNSfLUkkk"
}
```

## Production Module

### `POST /api/production` - Create a new production run

**Description:** This endpoint creates a new production run.

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/production`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "productId": 1,
    "quantity": 100,
    "notes": "Morning batch"
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "id": 1,
  "productId": 1,
  "quantityProduced": 100,
  "producedById": 1,
  "notes": "Morning batch",
  "status": "PENDING",
  "cost": 15000,
  "createdAt": "2025-10-21T10:00:00.000Z",
  "updatedAt": "2025-10-21T10:00:00.000Z",
  "finalizedAt": null,
  "updatedById": 1
}
```

### `PUT /api/production/:id` - Update a production run

**Description:** This endpoint updates a production run.

**Request:**
- **Method:** `PUT`
- **URL:** `http://localhost:3000/api/production/1`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "quantityProduced": 120,
    "notes": "Morning batch, updated quantity"
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "id": 1,
  "productId": 1,
  "quantityProduced": 120,
  "producedById": 1,
  "notes": "Morning batch, updated quantity",
  "status": "PENDING",
  "cost": 18000,
  "createdAt": "2025-10-21T10:00:00.000Z",
  "updatedAt": "2025-10-21T10:05:00.000Z",
  "finalizedAt": null,
  "updatedById": 1
}
```

### `PATCH /api/production/:id/finalize` - Finalize a production run

**Description:** This endpoint finalizes a production run.

**Request:**
- **Method:** `PATCH`
- **URL:** `http://localhost:3000/api/production/1/finalize`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "userId": 1
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "id": 1,
  "productId": 1,
  "quantityProduced": 120,
  "producedById": 1,
  "notes": "Morning batch, updated quantity",
  "status": "FINALIZED",
  "cost": 18000,
  "createdAt": "2025-10-21T10:00:00.000Z",
  "updatedAt": "2025-10-21T10:10:00.000Z",
  "finalizedAt": "2025-10-21T10:10:00.000Z",
  "updatedById": 1
}
```

### `GET /api/production` - Get all production runs

**Description:** This endpoint retrieves a paginated list of all production runs. It can be filtered by a date range and product name.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/production`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Query Parameters:**
  - `page` (optional): The page number to retrieve. Defaults to `1`.
  - `limit` (optional): The number of items to retrieve per page. Defaults to `10`.
  - `startDate` (optional): The start date of the date range to filter by.
  - `endDate` (optional): The end date of the date range to filter by.
  - `productName` (optional): The name of the product to filter by.

**Example URL with Query Parameters:**
`http://localhost:3000/api/production?page=1&limit=10&startDate=2025-10-01&endDate=2025-10-31`

**Successful Response (Status: 200 OK):**
```json
{
  "productionRuns": [
    {
      "id": 1,
      "productId": 1,
      "quantityProduced": 120,
      "producedById": 1,
      "notes": "Morning batch, updated quantity",
      "status": "FINALIZED",
      "cost": 18000,
      "createdAt": "2025-10-21T10:00:00.000Z",
      "updatedAt": "2025-10-21T10:10:00.000Z",
      "finalizedAt": "2025-10-21T10:10:00.000Z",
      "updatedById": 1,
      "product": {
        "id": 1,
        "name": "Croissant"
      },
      "producedBy": {
        "id": 1,
        "name": "Admin User"
      },
      "updatedBy": {
        "id": 1,
        "name": "Admin User"
      }
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

### `GET /api/production/:id` - Get a single production run

**Description:** This endpoint retrieves a single production run by its ID.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/production/1`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
{
  "id": 1,
  "productId": 1,
  "quantityProduced": 120,
  "producedById": 1,
  "notes": "Morning batch, updated quantity",
  "status": "FINALIZED",
  "cost": 18000,
  "createdAt": "2025-10-21T10:00:00.000Z",
  "updatedAt": "2025-10-21T10:10:00.000Z",
  "finalizedAt": "2025-10-21T10:10:00.000Z",
  "updatedById": 1,
  "product": {
    "id": 1,
    "name": "Croissant"
  },
  "ingredientsDeducted": [
    {
      "name": "Flour",
      "amountDeducted": 12,
      "unit": "kg",
      "cost": 12000
    },
    {
      "name": "Butter",
      "amountDeducted": 6,
      "unit": "kg",
      "cost": 6000
    }
  ]
}
```

## Products Module

### `GET /api/products` - Get all products

**Description:** This endpoint retrieves a list of all products.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/products`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
[
  {
    "id": 1,
    "name": "Croissant",
    "description": "A buttery, flaky, viennoiserie pastry.",
    "price": 2.5,
    "image": null,
    "instructions": [],
    "prepTime": 30,
    "quantity": 100,
    "batchSize": 10,
    "status": "active",
    "createdAt": "2025-10-21T10:00:00.000Z",
    "updatedAt": "2025-10-21T10:00:00.000Z",
    "createdById": 1,
    "updatedById": 1,
    "productRecipes": [
      {
        "id": 1,
        "productId": 1,
        "inventoryItemId": 1,
        "amountRequired": 0.1,
        "inventoryItem": {
          "id": 1,
          "name": "Flour",
          "unit": "kg"
        }
      }
    ]
  }
]
```

### `POST /api/products` - Create a new product

**Description:** This endpoint creates a new product.

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/products`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "name": "Baguette",
    "description": "A long, thin loaf of French bread.",
    "price": 3,
    "prepTime": 20,
    "batchSize": 5,
    "status": "active",
    "productRecipes": [
      {
        "inventoryItemId": 1,
        "amountRequired": 0.5
      }
    ]
  }
  ```

**Successful Response (Status: 201 Created):**
```json
{
  "id": 2,
  "name": "Baguette",
  "description": "A long, thin loaf of French bread.",
  "price": 3,
  "image": null,
  "instructions": [],
  "prepTime": 20,
  "quantity": 0,
  "batchSize": 5,
  "status": "active",
  "createdAt": "2025-10-21T11:00:00.000Z",
  "updatedAt": "2025-10-21T11:00:00.000Z",
  "createdById": 1,
  "updatedById": 1,
  "productRecipes": [
    {
      "id": 2,
      "productId": 2,
      "inventoryItemId": 1,
      "amountRequired": 0.5,
      "inventoryItem": {
        "id": 1,
        "name": "Flour",
        "unit": "kg"
      }
    }
  ]
}
```

### `GET /api/products/:id` - Get a single product

**Description:** This endpoint retrieves a single product by its ID.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/products/1`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
{
  "id": 1,
  "name": "Croissant",
  "description": "A buttery, flaky, viennoiserie pastry.",
  "price": 2.5,
  "image": null,
  "instructions": [],
  "prepTime": 30,
  "quantity": 100,
  "batchSize": 10,
  "status": "active",
  "createdAt": "2025-10-21T10:00:00.000Z",
  "updatedAt": "2025-10-21T10:00:00.000Z",
  "createdById": 1,
  "updatedById": 1,
  "productRecipes": [
    {
      "id": 1,
      "productId": 1,
      "inventoryItemId": 1,
      "amountRequired": 0.1,
      "inventoryItem": {
        "id": 1,
        "name": "Flour",
        "unit": "kg"
      }
    }
  ]
}
```

### `PUT /api/products/:id` - Update a product

**Description:** This endpoint updates a product.

**Request:**
- **Method:** `PUT`
- **URL:** `http://localhost:3000/api/products/1`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "price": 2.75,
    "productRecipes": [
      {
        "inventoryItemId": 1,
        "amountRequired": 0.12
      }
    ]
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "id": 1,
  "name": "Croissant",
  "description": "A buttery, flaky, viennoiserie pastry.",
  "price": 2.75,
  "image": null,
  "instructions": [],
  "prepTime": 30,
  "quantity": 100,
  "batchSize": 10,
  "status": "active",
  "createdAt": "2025-10-21T10:00:00.000Z",
  "updatedAt": "2025-10-21T11:05:00.000Z",
  "createdById": 1,
  "updatedById": 1,
  "productRecipes": [
    {
      "id": 3,
      "productId": 1,
      "inventoryItemId": 1,
      "amountRequired": 0.12,
      "inventoryItem": {
        "id": 1,
        "name": "Flour",
        "unit": "kg"
      }
    }
  ]
}
```

### `DELETE /api/products/:id` - Delete a product

**Description:** This endpoint deletes a product by its ID.

**Request:**
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/api/products/1`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 204 No Content):**

## Inventory Module

### `GET /api/inventory/summary` - Get inventory summary

**Description:** This endpoint retrieves a summary of the inventory, including low stock and out of stock items.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/inventory/summary`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
{
  "lowStock": {
    "count": 1,
    "items": [
      {
        "id": 1,
        "name": "Flour",
        "currentQuantity": 5,
        "minLevel": 10,
        "type": "raw_material"
      }
    ]
  },
  "outOfStock": {
    "count": 0,
    "items": []
  },
  "materialsUsed": {
    "count": 1,
    "items": [
      {
        "materialName": "Flour",
        "amountDeducted": 12,
        "unit": "kg",
        "productName": "Croissant",
        "quantityProduced": 120
      }
    ]
  },
  "topSellingProducts": {
    "count": 1,
    "items": [
      {
        "productName": "Croissant",
        "totalQuantitySold": 15,
        "numberOfSales": 5,
        "quantityOnHand": 100
      }
    ]
  },
  "weeklyAdjustments": {
    "count": 1,
    "items": [
      {
        "itemName": "Flour",
        "amount": -5,
        "unit": "kg",
        "reason": "Damaged goods",
        "createdBy": "Admin User",
        "createdAt": "2025-10-21T12:00:00.000Z"
      }
    ]
  }
}
```

### `GET /api/inventory` - Get all inventory items

**Description:** This endpoint retrieves a list of all inventory items. It can be filtered by type.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/inventory`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Query Parameters:**
  - `type` (optional): Filter by item type (`raw_material` or `supply`).

**Example URL with Query Parameters:**
`http://localhost:3000/api/inventory?type=raw_material`

**Successful Response (Status: 200 OK):**
```json
[
  {
    "id": 1,
    "name": "Flour",
    "type": "raw_material",
    "unit": "kg",
    "currentQuantity": 50,
    "minLevel": 10,
    "cost": 1.5,
    "createdAt": "2025-10-21T10:00:00.000Z",
    "updatedAt": "2025-10-21T10:00:00.000Z",
    "createdById": 1,
    "updatedById": 1
  }
]
```

### `POST /api/inventory` - Create a new inventory item

**Description:** This endpoint creates a new inventory item.

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/inventory`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "name": "Sugar",
    "type": "raw_material",
    "unit": "kg",
    "currentQuantity": 100,
    "minLevel": 20,
    "cost": 2
  }
  ```

**Successful Response (Status: 201 Created):**
```json
{
  "id": 2,
  "name": "Sugar",
  "type": "raw_material",
  "unit": "kg",
  "currentQuantity": 100,
  "minLevel": 20,
  "cost": 2,
  "createdAt": "2025-10-21T11:00:00.000Z",
  "updatedAt": "2025-10-21T11:00:00.000Z",
  "createdById": 1,
  "updatedById": 1
}
```

### `GET /api/inventory/:id` - Get a single inventory item

**Description:** This endpoint retrieves a single inventory item by its ID.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/inventory/1`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
{
  "id": 1,
  "name": "Flour",
  "type": "raw_material",
  "unit": "kg",
  "currentQuantity": 50,
  "minLevel": 10,
  "cost": 1.5,
  "createdAt": "2025-10-21T10:00:00.000Z",
  "updatedAt": "2025-10-21T10:00:00.000Z",
  "createdById": 1,
  "updatedById": 1
}
```

### `PUT /api/inventory/:id` - Update an inventory item

**Description:** This endpoint updates an inventory item.

**Request:**
- **Method:** `PUT`
- **URL:** `http://localhost:3000/api/inventory/1`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "minLevel": 15,
    "cost": 1.75
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "id": 1,
  "name": "Flour",
  "type": "raw_material",
  "unit": "kg",
  "currentQuantity": 50,
  "minLevel": 15,
  "cost": 1.75,
  "createdAt": "2025-10-21T10:00:00.000Z",
  "updatedAt": "2025-10-21T11:05:00.000Z",
  "createdById": 1,
  "updatedById": 1
}
```

### `DELETE /api/inventory/:id` - Delete an inventory item

**Description:** This endpoint deletes an inventory item by its ID.

**Request:**
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/api/inventory/1`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 204 No Content):**

## Adjustments Module

### `POST /api/adjustments` - Create a new inventory adjustment

**Description:** This endpoint creates a new inventory adjustment.

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/adjustments`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "inventoryItemId": 1,
    "amount": -5,
    "reason": "Damaged goods"
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "adjustment": {
    "id": 1,
    "inventoryItemId": 1,
    "amount": -5,
    "reason": "Damaged goods",
    "createdById": 1,
    "createdAt": "2025-10-21T12:00:00.000Z",
    "updatedAt": "2025-10-21T12:00:00.000Z"
  },
  "inventoryItem": {
    "id": 1,
    "name": "Flour",
    "type": "raw_material",
    "unit": "kg",
    "currentQuantity": 45,
    "minLevel": 15,
    "cost": 1.75,
    "createdAt": "2025-10-21T10:00:00.000Z",
    "updatedAt": "2025-10-21T12:00:00.000Z",
    "createdById": 1,
    "updatedById": 1
  }
}
```

### `GET /api/adjustments` - Get all inventory adjustments

**Description:** This endpoint retrieves a paginated list of all inventory adjustments. It can be filtered by date range, type, name, and a search query.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/adjustments`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Query Parameters:**
  - `page` (optional): The page number to retrieve. Defaults to `1`.
  - `limit` (optional): The number of items to retrieve per page. Defaults to `10`.
  - `startDate` (optional): The start date of the date range to filter by.
  - `endDate` (optional): The end date of the date range to filter by.
  - `type` (optional): Filter by item type (`raw_material` or `supply`).
  - `name` (optional): Filter by item name.
  - `search` (optional): A search query to filter by item name or reason.

**Example URL with Query Parameters:**
`http://localhost:3000/api/adjustments?page=1&limit=10&type=raw_material`

**Successful Response (Status: 200 OK):**
```json
{
  "adjustments": [
    {
      "id": 1,
      "inventoryItemId": 1,
      "amount": -5,
      "reason": "Damaged goods",
      "createdById": 1,
      "createdAt": "2025-10-21T12:00:00.000Z",
      "updatedAt": "2025-10-21T12:00:00.000Z",
      "inventoryItem": {
        "id": 1,
        "name": "Flour",
        "type": "raw_material"
      },
      "createdBy": {
        "id": 1,
        "name": "Admin User"
      }
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

## Authentication

### `POST /api/auth/register` - Register a new user

**Description:** This endpoint registers a new user. It is recommended to create roles using the `/api/users/roles` endpoint first and then provide the `roleId` during registration.

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/register`
- **Headers:**
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "email": "admin@example.com",
    "password": "password123",
    "name": "Admin User",
    "roleId": 1
  }
  ```

**Successful Response (Status: 201 Created):**
```json
{
  "id": 1,
  "email": "admin@example.com"
}
```

### `POST /api/auth/login` - Login a user

**Description:** This endpoint authenticates a user and returns a JWT token.

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/login`
- **Headers:**
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "email": "admin@example.com",
    "password": "password123"
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin",
    "permissions": ["all"]
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJhZG1pbiIsInBlcm1pc3Npb25zIjpbImFsbCJdLCJpYXQiOjE3NTk0MDkxNjgsImV4cCI6MTc1OTQxMDA2OH0.mVEMO0EDE9tNgZl-x2ORypHrogYapvkc6fwNSfLUkkk"
}
```

### `POST /api/auth/login-with-code` - Login with a 6-digit code

**Description:** This endpoint authenticates a user with their email and a 6-digit code and returns a JWT token. This endpoint is rate-limited to 5 requests per 15 minutes per IP address. After 10 failed attempts, the account will be locked for 15 minutes.

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/login-with-code`
- **Headers:**
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "email": "admin@example.com",
    "loginCode": "123456"
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin",
    "permissions": ["all"]
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJhZG1pbiIsInBlcm1pc3Npb25zIjpbImFsbCJdLCJpYXQiOjE3NTk0MDkxNjgsImV4cCI6MTc1OTQxMDA2OH0.mVEMO0EDE9tNgZl-x2ORypHrogYapvkc6fwNSfLUkkk"
}
```

### `POST /api/auth/refresh-token` - Refresh a JWT token

**Description:** This endpoint refreshes a JWT token using a refresh token.

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/refresh-token`
- **Headers:**
  - `Cookie: refreshToken=<YOUR_REFRESH_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
{
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin",
    "permissions": ["all"]
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJhZG1pbiIsInBlcm1pc3Npb25zIjpbImFsbCJdLCJpYXQiOjE3NTk0MDkxNjgsImV4cCI6MTc1OTQxMDA2OH0.mVEMO0EDE9tNgZl-x2ORypHrogYapvkc6fwNSfLUkkk"
}
```

### `POST /api/auth/reset-password` - Reset a user's password

**Description:** This endpoint resets a user's password. This is intended to be used by an admin.

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/reset-password`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <ADMIN_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "newPassword": "newPassword123"
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "message": "Password reset successfully"
}
```

### `POST /api/auth/logout` - Logout a user

**Description:** This endpoint logs out a user by clearing the refresh token cookie.

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/logout`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 204 No Content):**

### `GET /api/auth/me` - Get the current user

**Description:** This endpoint retrieves the currently authenticated user's information.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/auth/me`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
{
  "id": 1,
  "email": "admin@example.com",
  "name": "Admin User",
  "role": "admin",
  "permissions": ["all"]
}
```

### `PUT /api/auth/me` - Update the current user

**Description:** This endpoint updates the currently authenticated user's information.

**Request:**
- **Method:** `PUT`
- **URL:** `http://localhost:3000/api/auth/me`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "name": "New Name",
    "currentPassword": "password123",
    "newPassword": "newPassword123"
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "id": 1,
  "email": "admin@example.com",
  "name": "New Name",
  "role": {
    "id": 1,
    "name": "admin",
    "description": null,
    "permissions": ["all"]
  }
}
```

### `POST /api/auth/login-with-code` - Login with a 6-digit code

**Description:** This endpoint authenticates a user with their email and a 6-digit code and returns a JWT token. This endpoint is rate-limited to 5 requests per 15 minutes per IP address. After 10 failed attempts, the account will be locked for 15 minutes.

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/login-with-code`
- **Headers:**
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "email": "admin@example.com",
    "loginCode": "123456"
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin",
    "permissions": ["all"]
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJhZG1pbiIsInBlcm1pc3Npb25zIjpbImFsbCJdLCJpYXQiOjE3NTk0MDkxNjgsImV4cCI6MTc1OTQxMDA2OH0.mVEMO0EDE9tNgZl-x2ORypHrogYapvkc6fwNSfLUkkk"
}
```
