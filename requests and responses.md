## Sales Module

### `GET /api/sales` - Get all sales

**Description:** This endpoint retrieves a paginated list of all sales. It can be filtered by a date range, credit status, and sale status.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/sales?page=1&limit=5&startDate=2025-09-01&endDate=2025-09-30`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
{
  "sales": [
    {
      "id": 49,
      "customerId": null,
      "soldById": 2,
      "isCredit": false,
      "creditDueDate": null,
      "total": 2000,
      "status": "completed",
      "createdAt": "2025-09-29T23:03:44.716Z",
      "updatedAt": "2025-09-29T23:03:44.716Z",
      "items": [
        {
          "id": 64,
          "saleId": 49,
          "productId": 1,
          "quantity": 1,
          "price": 500,
          "notes": null
        },
        {
          "id": 65,
          "saleId": 49,
          "productId": 2,
          "quantity": 1,
          "price": 1500,
          "notes": null
        }
      ],
      "customer": null
    }
  ],
  "total": 49,
  "totalPages": 10,
  "currentPage": 1
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
- **URL:** `http://localhost:3000/api/reports/sales?startDate=2025-09-01&endDate=2025-09-30`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

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
- **URL:** `http://localhost:3000/api/reports/purchases?startDate=2025-09-01&endDate=2025-09-30`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

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
- **URL:** `http://localhost:3000/api/reports/inventory?startDate=2025-09-01&endDate=2025-09-30`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

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
- **URL:** `http://localhost:3000/api/reports/production?startDate=2025-09-01&endDate=2025-09-30`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
{
  "data": {
    "totalProduced": 148,
    "byProduct": {
      "Maandazi": {
        "totalProduced": 100,
        "totalCost": 30000
      },
      "white bread": {
        "totalProduced": 48,
        "totalCost": 24715
      }
    },
    "totalCost": 54715,
    "efficiency": 0
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
    "permissions": ["read:sales", "write:sales"]
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
      "permissions": ["read:sales", "write:sales"]
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
    "permissions": ["read:sales", "write:sales"]
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
    "permissions": ["read:sales", "write:sales"]
  }
  ```

**Successful Response (Status: 201 Created):**
```json
{
  "id": 2,
  "name": "cashier",
  "description": "Cashier role with limited permissions",
  "permissions": ["read:sales", "write:sales"]
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
    "permissions": ["read:sales", "write:sales"]
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
  "permissions": ["read:sales", "write:sales"]
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
    "permissions": ["read:sales"]
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "id": 2,
  "name": "Cashier Updated",
  "description": "Cashier role with limited permissions",
  "permissions": ["read:sales"]
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