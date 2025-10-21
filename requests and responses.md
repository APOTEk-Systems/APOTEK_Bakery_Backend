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

## Accounting Module

### `POST /api/accounting/expense-categories` - Create a new expense category

**Description:** This endpoint creates a new expense category.

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/accounting/expense-categories`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "name": "Electricity"
  }
  ```

**Successful Response (Status: 201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Electricity"
  }
}
```

### `POST /api/accounting/expenses` - Create a new expense

**Description:** This endpoint creates a new expense.

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/accounting/expenses`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "amount": 100,
    "date": "2025-09-25T00:00:00.000Z",
    "notes": "Gas for the delivery truck",
  "expenseCategoryId": 2
  }
  ```

**Successful Response (Status: 201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "amount": 100,
    "date": "2025-09-25T00:00:00.000Z",
    "status": "pending",
    "notes": "Gas for the delivery truck",
    "createdAt": "2025-09-26T13:49:18.116Z",
    "updatedAt": "2025-09-26T13:49:18.116Z",
    "createdById": 6,
    "approvedById": null,
    "updatedById": null,
    "expenseCategoryId": 2
}
```

### `GET /api/accounting/expense-categories` - Get all expense categories

**Description:** This endpoint retrieves all expense categories.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/accounting/expense-categories`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "electricity"
    },
    {
      "id": 2,
      "name": "gas"
    },
    {
      "id": 3,
      "name": "water"
    },
    {
      "id": 4,
      "name": "transportation"
    },
    {
      "id": 5,
      "name": "salaries"
    },
    {
      "id": 6,
      "name": "rent"
    },
    {
      "id": 7,
      "name": "communication"
    }
  ]
}
```

## Settings Module

### `GET /api/settings` - Get all settings

**Description:** This endpoint retrieves all application settings, categorized by key.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/settings`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
{
  "data": {
    "information": {
      "email": "info@goldencrustbakery.com",
      "phone": "(555) 123-BAKE",
      "address": "123 Baker Street, Pastry City, PC 12345",
      "website": "www.goldencrustbakery.com",
      "bakeryName": "Golden Crust Bakery",
      "description": "Artisanal bakery serving fresh bread and pastries since 1995"
    },
    "businessHours": [
      {
        "day": "Monday",
        "open": "07:00",
        "close": "18:00",
        "isOpen": true
      },
      {
        "day": "Tuesday",
        "open": "07:00",
        "close": "18:00",
        "isOpen": true
      },
      {
        "day": "Wednesday",
        "open": "07:00",
        "close": "18:00",
        "isOpen": true
      },
      {
        "day": "Thursday",
        "open": "07:00",
        "close": "18:00",
        "isOpen": true
      },
      {
        "day": "Friday",
        "open": "07:00",
        "close": "18:00",
        "isOpen": true
      },
      {
        "day": "Saturday",
        "open": "07:00",
        "close": "20:00",
        "isOpen": true
      },
      {
        "day": "Sunday",
        "open": null,
        "close": null,
        "isOpen": false
      }
    ],
    "notifications": {
      "dailySalesSummary": false,
      "lowInventoryAlerts": true,
      "newOrderNotifications": true,
      "customerBirthdayReminders": true
    },
    "vatAndTax": {
      "taxRate": 18,
      "acceptCash": true,
      "acceptCards": true
    }
  }
}
```

### `PUT /api/settings` - Update application settings

**Description:** This endpoint updates a specific category of application settings. The `key` field in the request body determines which setting category to update.

**Request:**
- **Method:** `PUT`
- **URL:** `http://localhost:3000/api/settings`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body (Example for 'information' key):**
  ```json
  {
    "key": "information",
    "bakeryName": "Updated Bakery Name",
    "phone": "(111) 222-3333"
  }
  ```
- **Body (Example for 'businessHours' key):**
  ```json
  {
    "key": "businessHours",
    "data": [
      { "day": "Monday", "isOpen": true, "open": "08:00", "close": "19:00" },
      { "day": "Tuesday", "isOpen": true, "open": "08:00", "close": "19:00" }
      // ... other days
    ]
  }
  ```
- **Body (Example for 'notifications' key):**
  ```json
  {
    "key": "notifications",
    "dailySalesSummary": true
  }
  ```
- **Body (Example for 'vatAndTax' key):**
  ```json
  {
    "key": "vatAndTax",
    "taxRate": 20
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "success": true,
  "data": {
    "bakeryName": "Updated Bakery Name",
    "phone": "(111) 222-3333"
    // ... updated fields for the specific key
  }
}
```

### `POST /api/settings/reasons` - Create a new adjustment reason

**Description:** This endpoint creates a new adjustment reason.

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/settings/reasons`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "name": "Damaged Goods",
    "description": "Goods that were damaged in transit or in the store"
  }
  ```

**Successful Response (Status: 201 Created):**
```json
{
  "id": 1,
  "name": "Damaged Goods",
  "description": "Goods that were damaged in transit or in the store",
  "createdAt": "2025-10-08T11:38:09.673Z",
  "updatedAt": "2025-10-08T11:38:09.673Z"
}
```

### `GET /api/settings/reasons` - Get all adjustment reasons

**Description:** This endpoint retrieves all adjustment reasons.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/settings/reasons`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
[
  {
    "id": 1,
    "name": "Damaged Goods",
    "description": "Goods that were damaged in transit or in the store",
    "createdAt": "2025-10-08T11:38:09.673Z",
    "updatedAt": "2025-10-08T11:38:09.673Z"
  },
  {
    "id": 2,
    "name": "Stock Correction",
    "description": "Manual correction of stock levels",
    "createdAt": "2025-10-08T11:38:16.397Z",
    "updatedAt": "2025-10-08T11:38:16.397Z"
  },
  {
    "id": 3,
    "name": "Expired Stock",
    "description": "Stock that has passed its expiration date",
    "createdAt": "2025-10-08T11:38:24.270Z",
    "updatedAt": "2025-10-08T11:38:24.270Z"
  }
]
```

### `PATCH /api/settings/reasons/{id}` - Update an adjustment reason

**Description:** This endpoint updates an adjustment reason.

**Request:**
- **Method:** `PATCH`
- **URL:** `http://localhost:3000/api/settings/reasons/1`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "name": "Damaged Stock"
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "id": 1,
  "name": "Damaged Stock",
  "description": "Goods that were damaged in transit or in the store",
  "createdAt": "2025-10-08T11:38:09.673Z",
  "updatedAt": "2025-10-08T11:38:37.463Z"
}
```

### `DELETE /api/settings/reasons/{id}` - Delete an adjustment reason

**Description:** This endpoint deletes an adjustment reason.

**Request:**
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/api/settings/reasons/3`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 204 No Content):**



## Reporting Module

### `GET /api/reports/sales` - Get sales report

**Description:** This endpoint retrieves a report of all sales. It can be filtered by a date range.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/reports/sales`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Query Parameters:**
  - `startDate` (optional): The start date of the date range to filter by.
  - `endDate` (optional): The end date of the date range to filter by.

**Example URL with Query Parameters:**
`http://localhost:3000/api/reports/sales?startDate=2025-09-01&endDate=2025-09-30`

**Successful Response (Status: 200 OK):**
```json
{
  "data": {
    "sales": [
      {
        "id": 1,
        "customerId": null,
        "soldById": 1,
        "isCredit": false,
        "creditDueDate": null,
        "total": 35000,
        "status": "completed",
        "createdAt": "2025-09-25T15:00:00.000Z",
        "updatedAt": "2025-09-25T15:00:00.000Z",
        "items": [
          {
            "id": 1,
            "saleId": 1,
            "productId": 1,
            "quantity": 10,
            "price": 500,
            "notes": null,
            "product": {
              "id": 1,
              "name": "Maandazi",
              "description": null,
              "price": 500,
              "createdAt": "2025-09-25T15:00:00.000Z",
              "updatedAt": "2025-09-25T15:00:00.000Z",
              "createdById": 1,
              "updatedById": null,
              "image": null,
              "instructions": "",
              "prepTime": null,
              "quantity": 0,
              "batchSize": 1,
              "status": "active"
            }
          },
          {
            "id": 2,
            "saleId": 1,
            "productId": 2,
            "quantity": 20,
            "price": 1500,
            "notes": null,
            "product": {
              "id": 2,
              "name": "white bread",
              "description": null,
              "price": 1500,
              "createdAt": "2025-09-25T15:00:00.000Z",
              "updatedAt": "2025-09-25T15:00:00.000Z",
              "createdById": 1,
              "updatedById": null,
              "image": null,
              "instructions": "",
              "prepTime": null,
              "quantity": 0,
              "batchSize": 1,
              "status": "active"
            }
          }
        ],
        "customer": null
      }
    ],
    "totalSales": 35000,
    "creditOutstanding": 0
  }
}
```

### `GET /api/reports/purchases` - Get purchases report

**Description:** This endpoint retrieves a report of all purchases. It can be filtered by a date range.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/reports/purchases`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Query Parameters:**
  - `startDate` (optional): The start date of the date range to filter by.
  - `endDate` (optional): The end date of the date range to filter by.

**Example URL with Query Parameters:**
`http://localhost:3000/api/reports/purchases?startDate=2025-09-01&endDate=2025-09-30`

**Successful Response (Status: 200 OK):**
```json
{
  "data": {
    "totalPurchases": 1295000,
    "bySupplier": {
      "mduma": {
        "totalPurchases": 175000
      },
      "machange": {
        "totalPurchases": 1120000
      }
    },
    "byItem": {
      "Vanilla": {
        "totalCost": 100000,
        "totalQuantity": 10
      },
      "Yeast": {
        "totalCost": 75000,
        "totalQuantity": 15
      },
      "Baking Powder": {
        "totalCost": 10000,
        "totalQuantity": 5
      },
      "Paper Bags": {
        "totalCost": 30000,
        "totalQuantity": 30
      },
      "Chocolate": {
        "totalCost": 1000000,
        "totalQuantity": 40
      },
      "Oven Gloves": {
        "totalCost": 50000,
        "totalQuantity": 10
      },
      "Flour": {
        "totalCost": 30000,
        "totalQuantity": 10
      }
    }
  }
}
```

### `GET /api/reports/inventory` - Get inventory report

**Description:** This endpoint retrieves a report of all inventory. It can be filtered by a date range.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/reports/inventory`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Query Parameters:**
  - `startDate` (optional): The start date of the date range to filter by.
  - `endDate` (optional): The end date of the date range to filter by.

**Example URL with Query Parameters:**
`http://localhost:3000/api/reports/inventory?startDate=2025-09-01&endDate=2025-09-30`

**Successful Response (Status: 200 OK):**
```json
{
  "data": {
    "totalItems": 17,
    "lowQuantity": [],
    "totalValue": 0,
    "byCategory": {}
  }
}
```

### `GET /api/reports/production` - Get production report

**Description:** This endpoint retrieves a report of all production. It can be filtered by a date range.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/reports/production`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Query Parameters:**
  - `startDate` (optional): The start date of the date range to filter by.
  - `endDate` (optional): The end date of the date range to filter by.

**Example URL with Query Parameters:**
`http://localhost:3000/api/reports/production?startDate=2025-09-01&endDate=2025-09-30`

**Successful Response (Status: 200 OK):**
```json
{
  "data": {
    "totalProduced": 148,
    "totalCost": 54715,
    "production": [
      {
        "Date": "2025-09-25",
        "Item Name": "Maandazi",
        "Quantity": 100,
        "Ingredients Used": "Flour, Sugar, Yeast",
        "Cost": 30000,
        "Produced By": "John Doe"
      },
      {
        "Date": "2025-09-25",
        "Item Name": "white bread",
        "Quantity": 48,
        "Ingredients Used": "Flour, Sugar, Yeast, Salt",
        "Cost": 24715,
        "Produced By": "Jane Doe"
      }
    ]
  }
}
```



REPORTS
1. Sales Module Reports
•	Sales Report (by date range). done
•	Customer Sales Report. done
2. Purchases Module Reports
•	Purchases Report (by date range). done
•	Supplier-wise Purchases. done ish
•	Ingredient Purchase Trend (flour, sugar, etc.). done
3. Inventory Module Reports
•	Current Stock Levels (Raw Materials, Supplies).
•	Low Stock Alert Report.
•	Stock Adjustment Report (with reasons).
•	Finished Goods Summary (what was produced daily).
4. Production Module Reports
•	Daily Production Batches Report (by date range).
•	Ingredient Usage Report (how much flour, sugar used in baking).
5. Accounting Module Reports
•	Income & Expense Report.
•	Profit/Loss Report
•	Expense Breakdown (rent, electricity, salaries).

## User Management

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

### `POST /api/users` - Create a new user

**Description:** This endpoint creates a new user. This is intended to be used by an authenticated user with the appropriate permissions (e.g., an admin). It requires a `roleId` to assign an existing role to the user.

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/users`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <ADMIN_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "email": "cashier@example.com",
    "password": "password123",
    "name": "Cashier User",
    "roleId": 2
  }
  ```

**Successful Response (Status: 201 Created):**
```json
{
  "id": 3,
  "email": "cashier@example.com",
  "name": "Cashier User",
  "createdAt": "2025-10-02T12:47:00.364Z",
  "updatedAt": "2025-10-02T12:47:00.364Z",
  "password": "$2b$10$l4bwXpv/TPPAvgzOqjZX1ecmOfgsRIBB4DuEY0a2kKQN6ltF7Br..",
  "status": "active",
  "refreshToken": null,
  "refreshTokenExpiresAt": null,
  "roleId": 2,
  "role": {
    "id": 2,
    "name": "cashier",
    "description": null,
    "permissions": ["view:sales", "create:sales", "update:sales"]
  }
}
```

### `GET /api/users` - Get all users

**Description:** This endpoint retrieves a list of all users.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/users`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
[
  {
    "id": 1,
    "email": "admin@example.com",
    "name": "Admin User",
    "createdAt": "2025-10-02T12:26:42.214Z",
    "updatedAt": "2025-10-02T12:27:08.243Z",
    "password": "$2b$10$jJ7CKakaPDRYRDVA07QJYeCPk/Znr2NtxaVfysOYLk484Za5Xlc8S",
    "status": "active",
    "refreshToken": "$2b$10$jJ7CKakaPDRYRDVA07QJYeCPk/Znr2NtxaVfysOYLk484Za5Xlc8S",
    "refreshTokenExpiresAt": "2025-10-09T12:27:08.243Z",
    "roleId": 1,
    "role": {
      "id": 1,
      "name": "admin",
      "description": null,
      "permissions": ["all"]
    }
  },
  {
    "id": 3,
    "email": "cashier@example.com",
    "name": "Cashier User",
    "createdAt": "2025-10-02T12:47:00.364Z",
    "updatedAt": "2025-10-02T12:47:00.364Z",
    "password": "$2b$10$l4bwXpv/TPPAvgzOqjZX1ecmOfgsRIBB4DuEY0a2kKQN6ltF7Br..",
    "status": "active",
    "refreshToken": null,
    "refreshTokenExpiresAt": null,
    "roleId": 2,
    "role": {
      "id": 2,
      "name": "cashier",
      "description": null,
      "permissions": ["view:sales", "create:sales", "update:sales"]
    }
  }
]
```

### `GET /api/users/{id}` - Get a single user

**Description:** This endpoint retrieves a single user by their ID.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/users/3`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
{
  "id": 3,
  "email": "cashier@example.com",
  "name": "Cashier User",
  "createdAt": "2025-10-02T12:47:00.364Z",
  "updatedAt": "2025-10-02T12:47:00.364Z",
  "password": "$2b$10$l4bwXpv/TPPAvgzOqjZX1ecmOfgsRIBB4DuEY0a2kKQN6ltF7Br..",
  "status": "active",
  "refreshToken": null,
  "refreshTokenExpiresAt": null,
  "roleId": 2,
  "role": {
    "id": 2,
    "name": "cashier",
    "description": null,
    "permissions": ["view:sales", "create:sales", "update:sales"]
  }
}
```

### `PUT /api/users/{id}` - Update a user

**Description:** This endpoint updates a user's information, including their role. To change the role, provide a `roleId`.

**Request:**
- **Method:** `PUT`
- **URL:** `http://localhost:3000/api/users/3`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <ADMIN_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "name": "Cashier User Updated",
    "roleId": 1
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "id": 3,
  "email": "cashier@example.com",
  "name": "Cashier User Updated",
  "createdAt": "2025-10-02T12:47:00.364Z",
  "updatedAt": "2025-10-02T12:55:00.000Z",
  "password": "$2b$10$l4bwXpv/TPPAvgzOqjZX1ecmOfgsRIBB4DuEY0a2kKQN6ltF7Br..",
  "status": "active",
  "refreshToken": null,
  "refreshTokenExpiresAt": null,
  "roleId": 1,
  "role": {
    "id": 1,
    "name": "admin",
    "description": null,
    "permissions": ["all"]
  }
}
```

### `DELETE /api/users/{id}` - Delete a user

**Description:** This endpoint deletes a user by their ID.

**Request:**
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/api/users/3`
- **Headers:**
  - `Authorization: Bearer <ADMIN_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
{
  "message": "User deleted successfully"
}
```

## User Role Management

### `POST /api/users/roles` - Create a new role

**Description:** This endpoint creates a new user role.

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/users/roles`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <ADMIN_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "name": "cashier",
    "description": "Cashier role with limited permissions",
    "permissions": ["view:sales", "create:sales", "update:sales"]
  }
  ```

**Successful Response (Status: 201 Created):**
```json
{
  "id": 2,
  "name": "cashier",
  "description": "Cashier role with limited permissions",
    "permissions": ["view:sales", "create:sales", "update:sales"]
}
```

### `GET /api/users/roles` - Get all roles

**Description:** This endpoint retrieves a list of all user roles.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/users/roles`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
[
  {
    "id": 1,
    "name": "admin",
    "description": null,
    "permissions": ["all"]
  },
  {
    "id": 2,
    "name": "cashier",
    "description": "Cashier role with limited permissions",
    "permissions": ["view:sales", "create:sales", "update:sales"]
  }
]
```

### `GET /api/users/roles/{id}` - Get a single role

**Description:** This endpoint retrieves a single user role by its ID.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/users/roles/2`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
{
  "id": 2,
  "name": "cashier",
  "description": "Cashier role with limited permissions",
    "permissions": ["view:sales", "create:sales", "update:sales"]
}
```

### `PUT /api/users/roles/{id}` - Update a role

**Description:** This endpoint updates a user role's information.

**Request:**
- **Method:** `PUT`
- **URL:** `http://localhost:3000/api/users/roles/2`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <ADMIN_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "name": "Cashier Updated",
    "permissions": ["view:sales"]
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "id": 2,
  "name": "Cashier Updated",
  "description": "Cashier role with limited permissions",
  "permissions": ["view:sales"]
}
```

### `DELETE /api/users/roles/{id}` - Delete a role

**Description:** This endpoint deletes a user role by its ID.

**Request:**
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/api/users/roles/2`
- **Headers:**
  - `Authorization: Bearer <ADMIN_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
{
  "message": "Role deleted successfully"
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
  "lowStockRawMaterials": [
    {
      "id": 1,
      "name": "Flour",
      "minLevel": 10
    }
  ],
  "lowStockSupplies": [],
  "outOfStockItems": 0
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
