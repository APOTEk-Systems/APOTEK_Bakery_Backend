
# API Requests and Responses

This document outlines the expected requests and responses for various API modules.

---

## Authentication Module

### `POST /api/auth/register` - Register a new user

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/register`
- **Headers:**
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "name": "testuser4",
    "email": "test4@example.com",
    "password": "password123"
  }
  ```

**Successful Response (Status: 201 Created):**
```json
{
  "id": 60001,
  "email": "test4@example.com"
}
```

### `POST /api/auth/login` - Login a user

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/login`
- **Headers:**
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "email": "test4@example.com",
    "password": "password123"
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "user": {
    "id": 60001,
    "email": "test4@example.com",
    "role": "admin",
    "permissions": ["all"]
  },
  "token": "<YOUR_JWT_TOKEN>"
}
```
Note: The refresh token is set as a secure HTTP-only cookie named 'refreshToken' with 7-day expiry.

### `POST /api/auth/refresh-token` - Refresh Access Token

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/refresh-token`
- **Headers:**
  - `Content-Type: application/json`
- **Body:** (No body required)

**Note:** The refresh token is read from the 'refreshToken' HTTP-only cookie.

**Successful Response (Status: 200 OK):**
```json
{
  "user": {
    "id": 60001,
    "email": "test4@example.com",
    "role": "admin",
    "permissions": ["all"]
  },
  "token": "<YOUR_NEW_JWT_TOKEN>"
}
```
Note: A new refresh token is set as a secure HTTP-only cookie named 'refreshToken' with 7-day expiry.

### `POST /api/auth/reset-password` - Reset User Password (Admin Only)

**Description:** This endpoint allows an administrator to reset a user's password directly. It requires authentication with a token that has `write:users` permission.

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/reset-password`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <ADMIN_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "email": "test6@example.com",
    "newPassword": "newpassword123"
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "message": "Password reset successfully"
}
```

### `PUT /api/auth/change-password` - Change User Password (Authenticated User)

**Description:** This endpoint allows a logged-in user to change their own password. It requires the user to provide their current password for verification.

**Request:**
- **Method:** `PUT`
- **URL:** `http://localhost:3000/api/auth/change-password`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "currentPassword": "newpassword123",
    "newPassword": "anothernewpassword"
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "message": "Password changed successfully"
}
```

**Error Response (Status: 400 Bad Request) - Incorrect Current Password:**
```json
{
  "message": "Incorrect current password"
}
```

---

## User Module

### `GET /api/users` - Get all users

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/users`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
[
  {
    "id": 60001,
    "email": "test4@example.com",
    "name": "testuser4",
    "role": "admin",
    "permissions": ["all"],
    "status": "active",
    "createdAt": "2025-09-12T09:34:17.906Z",
    "updatedAt": "2025-09-12T09:39:03.366Z"
  }
]
```

---

## Roles and Permissions

### Adding a Cashier

To add a new user with the `cashier` role, you can use the `POST /api/users` endpoint. The request body should include the user's name, email, password, role, and a list of permissions.

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/users`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <ADMIN_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "name": "Cashier User",
    "email": "cashier@example.com",
    "password": "password123",
    "role": "cashier",
    "permissions": [
      "read:sales",
      "write:sales",
      "read:customers",
      "write:customers",
      "read:products",
      "read:inventory",
      "read:purchases",
      "write:purchases",
      "read:production",
      "write:production"
    ]
  }
  ```

### List of Permissions

The following is a list of all available permissions in the system:

- `read:users`
- `write:users`
- `delete:users`
- `read:settings`
- `write:settings`
- `read:sales`
- `write:sales`
- `delete:sales`
- `read:reports`
- `read:purchases`
- `write:purchases`
- `delete:purchases`
- `read:products`
- `write:products`
- `delete:products`
- `read:production`
- `write:production`
- `read:inventory`
- `write:inventory`
- `delete:inventory`
- `read:customers`
- `write:customers`
- `delete:customers`
- `read:expenses`
- `write:expenses`
- `delete:expenses`

---

## Customer Module

### `POST /api/customers` - Create a new customer

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/customers`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "name": "Credit Customer",
    "email": "credit@example.com",
    "isCredit": true
  }
  ```

**Successful Response (Status: 201 Created):**
```json
{
  "id": 30001,
  "name": "Credit Customer",
  "email": "credit@example.com",
  "phone": null,
  "address": null,
  "status": "active",
  "isCredit": true,
  "creditLimit": null,
  "currentCredit": null,
  "loyaltyPoints": null,
  "birthday": null,
  "notes": null,
  "createdAt": "2025-09-12T12:06:36.382Z",
  "updatedAt": "2025-09-12T12:06:36.382Z",
  "createdById": 60001,
  "updatedById": 60001
}
```

### `GET /api/customers` - Get all customers

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/customers`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
[
  {
    "id": 1,
    "name": "Test Customer",
    "email": "customer@example.com",
    "phone": "1234567890",
    "address": null,
    "status": "active",
    "isCredit": false,
    "creditLimit": null,
    "currentCredit": null,
    "loyaltyPoints": null,
    "birthday": null,
    "notes": null,
    "createdAt": "2025-09-12T10:15:29.115Z",
    "updatedAt": "2025-09-12T10:15:29.115Z",
    "createdById": 120005,
    "updatedById": 120005
  },
  {
    "id": 30001,
    "name": "Credit Customer",
    "email": "credit@example.com",
    "phone": null,
    "address": null,
    "status": "active",
    "isCredit": true,
    "creditLimit": null,
    "currentCredit": null,
    "loyaltyPoints": null,
    "birthday": null,
    "notes": null,
    "createdAt": "2025-09-12T12:06:36.382Z",
    "updatedAt": "2025-09-12T12:06:36.382Z",
    "createdById": 60001,
    "updatedById": 60001
}
]
```

### `GET /api/customers/:id` - Get a single customer by ID

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/customers/30001`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
{
  "id": 30001,
  "name": "Updated Credit Customer",
  "email": "credit@example.com",
  "phone": null,
  "address": null,
  "status": "active",
  "isCredit": true,
  "creditLimit": null,
  "currentCredit": null,
  "loyaltyPoints": null,
  "birthday": null,
  "notes": null,
  "createdAt": "2025-09-12T12:06:36.382Z",
  "updatedAt": "2025-09-12T12:32:41.421Z",
  "createdById": 60001,
  "updatedById": 60001
}
```

### `PUT /api/customers/:id` - Update a customer by ID

**Request:**
- **Method:** `PUT`
- **URL:** `http://localhost:3000/api/customers/30001`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "name": "Updated Credit Customer"
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "id": 30001,
  "name": "Updated Credit Customer",
  "email": "credit@example.com",
  "phone": null,
  "address": null,
  "status": "active",
  "isCredit": true,
  "creditLimit": null,
  "currentCredit": null,
  "loyaltyPoints": null,
  "birthday": null,
  "notes": null,
  "createdAt": "2025-09-12T12:06:36.382Z",
  "updatedAt": "2025-09-12T12:32:41.421Z",
  "createdById": 60001,
  "updatedById": 60001
}
```

### `DELETE /api/customers/:id` - Delete a customer by ID

**Request:**
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/api/customers/60001`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 204 No Content):**
(No response body)

---

## Sales Module

### `POST /api/sales` - Create a Credit Sale

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/sales`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "customerId": 30001,
    "isCredit": true,
    "total": 31.98,
    "items": [
      {
        "productId": 30001,
        "quantity": 2,
        "price": 15.99
      }
    ]
  }
  ```

**Successful Response (Status: 201 Created):**
```json
{
  "id": 60001,
  "customerId": 30001,
  "soldById": 60001,
  "isCredit": true,
  "creditDueDate": null,
  "total": 31.98,
  "status": "completed",
  "createdAt": "2025-09-12T12:33:30.412Z",
  "updatedAt": "2025-09-12T12:33:30.412Z",
  "items": [
    {
      "id": 60001,
      "saleId": 60001,
      "productId": 30001,
      "quantity": 2,
      "price": 15.99,
      "notes": null
    }
  ]
}
```

### `GET /api/sales` - Get all sales

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/sales`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
[
  {
    "id": 30001,
    "customerId": 30001,
    "soldById": 60001,
    "isCredit": true,
    "creditDueDate": null,
    "total": 31.98,
    "status": "completed",
    "createdAt": "2025-09-12T12:08:29.521Z",
    "updatedAt": "2025-09-12T12:08:29.521Z",
    "items": [
      {
        "id": 30001,
        "saleId": 30001,
        "productId": 30001,
        "quantity": 2,
        "price": 15.99,
        "notes": null
      }
    ]
  }
]
```

### `GET /api/sales/:id` - Get a single sale by ID

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/sales/30001`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
{
  "id": 30001,
  "customerId": 30001,
  "soldById": 60001,
  "isCredit": true,
  "creditDueDate": null,
  "total": 31.98,
  "status": "completed",
  "createdAt": "2025-09-12T12:08:29.521Z",
  "updatedAt": "2025-09-12T12:08:29.521Z"
}
```

### `PUT /api/sales/:id` - Update a sale by ID

**Request:**
- **Method:** `PUT`
- **URL:** `http://localhost:3000/api/sales/30001`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "status": "pending"
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "id": 30001,
  "customerId": 30001,
  "soldById": 60001,
  "isCredit": true,
  "creditDueDate": null,
  "total": 31.98,
  "status": "pending",
  "createdAt": "2025-09-12T12:08:29.521Z",
  "updatedAt": "2025-09-12T12:23:00.173Z"
}
```

### `DELETE /api/sales/:id` - Delete a sale by ID

**Request:**
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/api/sales/60001`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 204 No Content):**
(No response body)

---

## Product Module

### `POST /api/products` - Create a new product

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/products`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "name": "Croissant",
    "price": 2.5,
    "instructions": [
      "Mix ingredients",
      "Knead dough",
      "Let it rise",
      "Bake at 180C"
    ],
    "productRecipes": [
      {
        "inventoryItemId": 1,
        "amountRequired": 0.2
      },
      {
        "inventoryItemId": 3,
        "amountRequired": 0.1
      },
      {
        "inventoryItemId": 4,
        "amountRequired": 0.01
      },
      {
        "inventoryItemId": 5,
        "amountRequired": 0.005
      },
      {
        "inventoryItemId": 6,
        "amountRequired": 0.15
      },
      {
        "inventoryItemId": 2,
        "amountRequired": 0.05
      }
    ]
  }
  ```

**Successful Response (Status: 201 Created):**
```json
{
  "id": 1,
  "name": "Croissant",
  "description": null,
  "price": 2.5,
  "prepTime": null,
  "instructions": [
    "Mix ingredients",
    "Knead dough",
    "Let it rise",
    "Bake at 180C"
  ],
  "quantity": 0,
  "image": null,
  "status": "active",
  "createdAt": "2025-09-13T11:45:44.099Z",
  "updatedAt": "2025-09-13T11:45:44.099Z",
  "createdById": 1,
  "updatedById": 1,
  "productRecipes": [
    {
      "id": 1,
      "productId": 1,
      "inventoryItemId": 1,
      "amountRequired": 0.2,
      "inventoryItem": {
        "id": 1,
        "name": "Wheat Flour",
        "currentQuantity": 100,
        "unit": "kg",
        "minLevel": 20,
        "maxLevel": 500,
        "cost": 2.5,
        "status": "in-stock",
        "createdAt": "2025-09-13T11:37:47.531Z",
        "updatedAt": "2025-09-13T11:37:47.531Z",
        "createdById": 1,
        "updatedById": null
      }
    },
    {
      "id": 6,
      "productId": 1,
      "inventoryItemId": 2,
      "amountRequired": 0.05,
      "inventoryItem": {
        "id": 2,
        "name": "Sugar",
        "currentQuantity": 80,
        "unit": "kg",
        "minLevel": 10,
        "maxLevel": 200,
        "cost": 1.8,
        "status": "in-stock",
        "createdAt": "2025-09-13T11:37:49.991Z",
        "updatedAt": "2025-09-13T11:37:49.991Z",
        "createdById": 1,
        "updatedById": null
      }
    },
    {
      "id": 2,
      "productId": 1,
      "inventoryItemId": 3,
      "amountRequired": 0.1,
      "inventoryItem": {
        "id": 3,
        "name": "Butter",
        "currentQuantity": 50,
        "unit": "kg",
        "minLevel": 5,
        "maxLevel": 100,
        "cost": 4,
        "status": "in-stock",
        "createdAt": "2025-09-13T11:37:51.627Z",
        "updatedAt": "2025-09-13T11:37:51.627Z",
        "createdById": 1,
        "updatedById": null
      }
    },
    {
      "id": 3,
      "productId": 1,
      "inventoryItemId": 4,
      "amountRequired": 0.01,
      "inventoryItem": {
        "id": 4,
        "name": "Yeast",
        "currentQuantity": 30,
        "unit": "kg",
        "minLevel": 5,
        "maxLevel": 50,
        "cost": 0.5,
        "status": "in-stock",
        "createdAt": "2025-09-13T11:37:53.264Z",
        "updatedAt": "2025-09-13T11:37:53.264Z",
        "createdById": 1,
        "updatedById": null
      }
    },
    {
      "id": 4,
      "productId": 1,
      "inventoryItemId": 5,
      "amountRequired": 0.005,
      "inventoryItem": {
        "id": 5,
        "name": "Salt",
        "currentQuantity": 40,
        "unit": "kg",
        "minLevel": 5,
        "maxLevel": 100,
        "cost": 0.8,
        "status": "in-stock",
        "createdAt": "2025-09-13T11:37:54.902Z",
        "updatedAt": "2025-09-13T11:37:54.902Z",
        "createdById": 1,
        "updatedById": null
      }
    },
    {
      "id": 5,
      "productId": 1,
      "inventoryItemId": 6,
      "amountRequired": 0.15,
      "inventoryItem": {
        "id": 6,
        "name": "Milk",
        "currentQuantity": 60,
        "unit": "L",
        "minLevel": 10,
        "maxLevel": 200,
        "cost": 1.2,
        "status": "in-stock",
        "createdAt": "2025-09-13T11:37:56.385Z",
        "updatedAt": "2025-09-13T11:37:56.385Z",
        "createdById": 1,
        "updatedById": null
      }
    }
  ]
}
```

### `GET /api/products` - Get all products

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
    "name": "Test Product",
    "description": null,
    "price": 10.99,
    "prepTime": null,
    "instructions": [],
    "quantity": 0,
    "image": null,
    "status": "active",
    "createdAt": "2025-09-12T10:21:23.526Z",
    "updatedAt": "2025-09-12T10:21:23.526Z",
    "createdById": 120005,
    "updatedById": 120005
  },
  {
    "id": 2,
    "name": "Test Product",
    "description": null,
    "price": 10.99,
    "prepTime": null,
    "instructions": [],
    "quantity": 0,
    "image": null,
    "status": "active",
    "createdAt": "2025-09-12T10:23:33.387Z",
    "updatedAt": "2025-09-12T10:23:33.387Z",
    "createdById": 120005,
    "updatedById": 120005
  },
  {
    "id": 30001,
    "name": "New Product",
    "description": null,
    "price": 15.99,
    "instructions": [
      "Step 1: Mix ingredients",
      "Step 2: Bake for 30 minutes",
      "Step 3: Enjoy!"
    ],
    "quantity": 0,
    "image": null,
    "status": "active",
    "createdAt": "2025-09-12T11:06:11.905Z",
    "updatedAt": "2025-09-12T11:06:11.905Z",
    "createdById": 120005,
    "updatedById": 120005
  },
  {
    "id": 60001,
    "name": "Chocolate Chip Cookies",
    "description": null,
    "price": 12.5,
    "prepTime": null,
    "instructions": [
      "Preheat oven to 375°F",
      "Cream butter and sugars",
      "Add eggs and vanilla",
      "Combine dry ingredients",
      "Stir in chocolate chips",
      "Drop onto baking sheets",
      "Bake for 10-12 minutes"
    ],
    "quantity": 0,
    "image": null,
    "status": "active",
    "createdAt": "2025-09-12T12:38:10.327Z",
    "updatedAt": "2025-09-12T12:38:10.327Z",
    "createdById": 60001,
    "updatedById": 60001
  }
]
```

### `GET /api/products/:id` - Get a single product by ID

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/products/60001`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
{
  "id": 60001,
  "name": "Chocolate Chip Cookies",
  "description": null,
  "price": 12.5,
  "prepTime": null,
  "instructions": [
    "Preheat oven to 375°F",
    "Cream butter and sugars",
    "Add eggs and vanilla",
    "Combine dry ingredients",
    "Stir in chocolate chips",
    "Drop onto baking sheets",
    "Bake for 10-12 minutes"
  ],
  "quantity": 0,
  "image": null,
  "status": "active",
  "createdAt": "2025-09-12T12:38:10.327Z",
  "updatedAt": "2025-09-12T12:38:10.327Z",
  "createdById": 60001,
  "updatedById": 60001
}
```

### `PUT /api/products/:id` - Update a product by ID

**Request:**
- **Method:** `PUT`
- **URL:** `http://localhost:3000/api/products/60001`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "price": 13.00,
    "instructions": [
      "Preheat oven to 375°F",
      "Cream butter and sugars",
      "Add eggs and vanilla",
      "Combine dry ingredients",
      "Stir in chocolate chips",
      "Drop onto baking sheets",
      "Bake for 10-12 minutes",
      "Let cool before serving"
    ]
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "id": 60001,
  "name": "Chocolate Chip Cookies",
  "description": null,
  "price": 13,
  "prepTime": null,
  "instructions": [
    "Preheat oven to 375°F",
    "Cream butter and sugars",
    "Add eggs and vanilla",
    "Combine dry ingredients",
    "Stir in chocolate chips",
    "Drop onto baking sheets",
    "Bake for 10-12 minutes",
    "Let cool before serving"
  ],
  "quantity": 0,
  "image": null,
  "status": "active",
  "createdAt": "2025-09-12T12:38:10.327Z",
  "updatedAt": "2025-09-12T12:38:28.716Z",
  "createdById": 60001,
  "updatedById": 60001
}
```

### `DELETE /api/products/:id` - Delete a product by ID

**Request:**
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/api/products/60001`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 204 No Content):**
(No response body)

---

## Supplier Module

### `POST /api/suppliers` - Create a new supplier

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/suppliers`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "name": "New Supplier Co.",
    "contactInfo": "John Doe, 555-1234"
  }
  ```

**Successful Response (Status: 201 Created):**
```json
{
  "id": 1,
  "name": "New Supplier Co.",
  "contactInfo": "John Doe, 555-1234",
  "createdAt": "2025-09-12T12:43:45.780Z",
  "updatedAt": "2025-09-12T12:43:45.780Z"
}
```

### `GET /api/suppliers` - Get all suppliers

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/suppliers`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
[
  {
    "id": 1,
    "name": "New Supplier Co.",
    "contactInfo": "John Doe, 555-1234",
    "createdAt": "2025-09-12T12:43:45.780Z",
    "updatedAt": "2025-09-12T12:43:45.780Z"
  }
]
```

### `PUT /api/suppliers/:id` - Update a supplier by ID

**Request:**
- **Method:** `PUT`
- **URL:** `http://localhost:3000/api/suppliers/1`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "contactInfo": "Jane Smith, 555-5678"
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "id": 1,
  "name": "New Supplier Co.",
  "contactInfo": "Jane Smith, 555-5678",
  "createdAt": "2025-09-12T12:43:45.780Z",
  "updatedAt": "2025-09-12T12:43:58.393Z"
}
```

### `GET /api/suppliers/:id/po` - Get purchase orders by supplier ID

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/suppliers/1/po`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
[
  {
    "id": 30001,
    "supplierId": 1,
    "totalCost": 50,
    "status": "pending",
    "notes": null,
    "createdAt": "2025-09-12T12:52:33.970Z",
    "updatedAt": "2025-09-12T12:52:33.970Z",
    "createdById": 60001,
    "approvedById": null
  }
]
```

### `DELETE /api/suppliers/:id` - Delete a supplier by ID

**Request:**
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/api/suppliers/2`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 204 No Content):**
(No response body)

---

## Purchase Module

### `POST /api/purchases/orders` - Create a new purchase order

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
    "totalCost": 25,
    "items": [
      {
        "inventoryItemId": 1,
        "quantity": 10
      }
    ]
  }
  ```

**Successful Response (Status: 201 Created):**
```json
{
  "id": 1,
  "supplierId": 1,
  "totalCost": 25,
  "status": "pending",
  "notes": null,
  "createdAt": "2025-09-13T13:30:42.945Z",
  "updatedAt": "2025-09-13T13:30:42.945Z",
  "createdById": 1,
  "approvedById": null,
  "items": [
    {
      "id": 1,
      "purchaseOrderId": 1,
      "inventoryItemId": 1,
      "quantity": 10
    }
  ]
}
```

### `GET /api/purchases/orders` - Get all purchase orders

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/purchases/orders`
- **Query Parameters:**  
  - `status` *(optional, string)* → filter recieved goods by status:  
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
[
  {
    "id": 30001,
    "supplierId": 1,
    "totalCost": 50,
    "status": "pending",
    "notes": null,
    "createdAt": "2025-09-12T12:52:33.970Z",
    "updatedAt": "2025-09-12T12:52:33.970Z",
    "createdById": 60001,
    "approvedById": null,
    "items": [
      {
        "id": 30001,
        "purchaseOrderId": 30001,
        "inventoryItemId": 1,
        "quantity": 100,
        "unit": "kg",
        "unitCost": 0.5
      }
    ],
    "goodsReceipts": []
  }
]
```

### `GET /api/purchases/orders/:id` - Get a single purchase order by ID

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
  "totalCost": 25,
  "status": "pending",
  "notes": null,
  "createdAt": "2025-09-13T13:30:42.945Z",
  "updatedAt": "2025-09-13T13:30:42.945Z",
  "createdById": 1,
  "approvedById": null
}
```

### `PUT /api/purchases/orders/:id` - Update a purchase order by ID

**Request:**
- **Method:** `PUT`
- **URL:** `http://localhost:3000/api/purchases/orders/1`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "status": "approved",
    "approvedById": 1
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "id": 1,
  "supplierId": 1,
  "totalCost": 25,
  "status": "approved",
  "notes": null,
  "createdAt": "2025-09-13T13:30:42.945Z",
  "updatedAt": "2025-09-13T13:30:42.945Z",
  "createdById": 1,
  "approvedById": 1
}
```

### `DELETE /api/purchases/orders/:id` - Delete a purchase order by ID

**Request:**
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/api/purchases/orders/2`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 204 No Content):**
(No response body)

---

## Goods Receipt Module

### `POST /api/purchases/receiving` - Create a new goods receipt

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
  "receivedQuantity": 10,
  "status": "pending",
  "receivedDate": "2025-09-13T13:33:19.610Z",
  "notes": null,
  "createdById": 1
}
```

### `GET /api/purchases/receiving` - Get all goods receipts

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/purchases/receiving`
- **Query Parameters:**  
  - `status` *(optional, string)* → filter recieved goods by status:  
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
[
  {
    "id": 2,
    "purchaseOrderId": 1,
    "receivedQuantity": 10,
    "status": "pending",
    "receivedDate": "2025-09-13T13:33:19.610Z",
    "notes": null,
    "createdById": 1
  }
]
```

### `GET /api/purchases/receiving/:id` - Get a single goods receipt by ID

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/purchases/receiving/2`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
{
  "id": 2,
  "purchaseOrderId": 1,
  "receivedQuantity": 10,
  "status": "pending",
  "receivedDate": "2025-09-13T13:33:19.610Z",
  "notes": null,
  "createdById": 1
}
```

### `PUT /api/purchases/receiving/:id` - Update a goods receipt by ID

**Request:**
- **Method:** `PUT`
- **URL:** `http://localhost:3000/api/purchases/receiving/2`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "status": "completed"
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "id": 2,
  "purchaseOrderId": 1,
  "receivedQuantity": 10,
  "status": "completed",
  "receivedDate": "2025-09-13T13:33:19.610Z",
  "notes": null,
  "createdById": 1
}
```

### `DELETE /api/purchases/receiving/:id` - Delete a goods receipt by ID

**Request:**
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/api/purchases/receiving/1`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 204 No Content):**
(No response body)

---

## Inventory Module

### `POST /api/inventory` - Create a new inventory item

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/inventory`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "name": "Flour - All Purpose",
    "currentQuantity": 100,
    "minLevel": 10,
    "maxLevel": 200,
    "unit":"kg",
    "cost": 0.50,
    "type": "raw_material"
  }
  ```

**Successful Response (Status: 201 Created):**
```json
{
  "id": 1,
  "name": "Flour - All Purpose",
  "currentQuantity": 100,
  "minLevel": 10,
  "maxLevel": 200,
  "cost": 0.5,
  "status": "in-stock",
  "type": "raw_material",
  "createdAt": "2025-09-12T12:49:02.671Z",
  "updatedAt": "2025-09-12T12:49:02.671Z",
  "createdById": 60001,
  "updatedById": 60001
}
```


### **`GET /api/inventory`** – Fetch inventory items  

Retrieves all inventory items, optionally filtered by `type`.  

---

### **Request**  

- **Method:** `GET`  
- **URL:** `http://localhost:3000/api/inventory`  
- **Query Parameters:**  
  - `type` *(optional, string)* → filter by item type:  
    - `raw_material` → items used in recipes (flour, sugar, yeast, etc.)  
    - `supplies` → non-recipe items (packaging, frying oil, cleaning supplies, etc.)  
  
- **Headers:**  
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`  

---

### **Successful Response (200 OK)**  

```json
[
  {
    "id": 1,
    "name": "Flour - All Purpose",
    "currentQuantity": 100,
    "minLevel": 10,
    "maxLevel": 200,
    "unit": "kg",
    "cost": 0.5,
    "status": "in-stock",
    "type": "raw_material",
    "createdAt": "2025-09-12T12:49:02.671Z",
    "updatedAt": "2025-09-12T12:49:02.671Z",
    "createdById": 60001,
    "updatedById": 60001
  }
]
```
### `GET /api/inventory/:id` - Get a single inventory item by ID

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/inventory/1`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
{
  "id": 1,
  "name": "Flour - All Purpose",
  "currentQuantity": 100,
  "minLevel": 10,
  "maxLevel": 200,
  "cost": 0.5,
  "status": "in-stock",
  "type": "raw_material",
  "createdAt": "2025-09-12T12:49:02.671Z",
  "updatedAt": "2025-09-12T12:49:02.671Z",
  "createdById": 60001,
  "updatedById": 60001
}
```

### `PUT /api/inventory/:id` - Update an inventory item by ID

**Request:**
- **Method:** `PUT`
- **URL:** `http://localhost:3000/api/inventory/1`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "currentQuantity": 150
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "id": 1,
  "name": "Flour - All Purpose",
  "currentQuantity": 150,
  "minLevel": 10,
  "maxLevel": 200,
  "cost": 0.5,
  "status": "in-stock",
  "type": "raw_material",
  "createdAt": "2025-09-12T12:49:02.671Z",
  "updatedAt": "2025-09-12T13:38:07.653Z",
  "createdById": 60001,
  "updatedById": 60001
}
```

### `DELETE /api/inventory/:id` - Delete an inventory item by ID

**Request:**
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/api/inventory/30001`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 204 No Content):**
(No response body)

---

## Inventory Adjustments Module

### `POST /api/adjustments` - Create a new inventory adjustment

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
    "amount": -10,
    "reason": "Wastage"
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "adjustment": {
    "id": 1,
    "inventoryItemId": 1,
    "amount": -10,
    "reason": "Wastage",
    "createdAt": "2025-09-15T16:00:00.000Z",
    "createdById": 1
  },
  "inventoryItem": {
    "id": 1,
    "name": "Flour - All Purpose",
    "currentQuantity": 90,
    "unit": "kg",
    "minLevel": 10,
    "maxLevel": 200,
    "cost": 0.5,
    "type": "raw_material",
    "status": "in-stock",
    "createdAt": "2025-09-12T12:49:02.671Z",
    "updatedAt": "2025-09-15T16:00:00.000Z",
    "createdById": 60001,
    "updatedById": 1
  }
}
```

---

## Production Module

### `POST /api/production` - Create a new production run

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
    "quantityProduced": 100,
    "producedById": 1
  }
  ```

**Successful Response (Status: 201 Created):**
```json
{
  "id": 30003,
  "productId": 1,
  "quantityProduced": 100,
  "date": "2025-09-13T12:17:36.014Z",
  "producedById": 1,
  "cost": 117.9,
  "notes": null,
  "createdAt": "2025-09-13T12:17:36.014Z",
  "updatedAt": "2025-09-13T12:17:36.014Z",
  "updatedById": 1,
  "status": "PENDING",
  "finalizedAt": null
}
```

### `GET /api/production` - Get all production runs

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/production`
- **Query Parameters (Optional):**
  - `date` (string, format: YYYY-MM-DD): Filter production runs by a specific date.
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
[
    {
        "id": 30003,
        "productId": 1,
        "quantityProduced": 90,
        "date": "2025-09-13T12:17:36.014Z",
        "producedById": 1,
        "cost": 106.11,
        "notes": null,
        "createdAt": "2025-09-13T12:17:36.014Z",
        "updatedAt": "2025-09-13T12:18:10.987Z",
        "updatedById": 1,
        "status": "PENDING",
        "finalizedAt": null,
        "product": {
            "id": 1,
            "name": "Croissant"
        },
        "producedBy": {
            "id": 1,
            "name": "admin"
        },
        "updatedBy": {
            "id": 1,
            "name": "admin"
        }
    }
]
```

### `PUT /api/production/:id` - Update a production run by ID

**Request:**
- **Method:** `PUT`
- **URL:** `http://localhost:3000/api/production/30003`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "quantityProduced": 90,
    "updatedById": 1
  }
  ```

**Successful Response (Status: 200 OK):**
```json
{
  "id": 30003,
  "productId": 1,
  "quantityProduced": 90,
  "date": "2025-09-13T12:17:36.014Z",
  "producedById": 1,
  "cost": 106.11,
  "notes": null,
  "createdAt": "2025-09-13T12:17:36.014Z",
  "updatedAt": "2025-09-13T12:18:10.987Z",
  "updatedById": 1,
  "status": "PENDING",
  "finalizedAt": null
}
```

### `GET /api/production/:id` - Get a single production run by ID

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/production/3`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK):**
```json
{
  "id": 3,
  "productId": 1,
  "quantityProduced": 20,
  "date": "2025-09-20T17:57:27.806Z",
  "producedById": 1,
  "cost": 7580,
  "notes": "Test production run",
  "createdAt": "2025-09-20T17:57:27.806Z",
  "updatedAt": "2025-09-20T17:57:27.806Z",
  "updatedById": 1,
  "finalizedAt": null,
  "status": "PENDING",
  "product": {
    "id": 1,
    "name": "Donut",
    "description": null,
    "price": 2500,
    "createdAt": "2025-09-19T08:57:05.388Z",
    "updatedAt": "2025-09-20T17:57:28.635Z",
    "createdById": 1,
    "updatedById": null,
    "image": null,
    "instructions": "[\"Mix flour, sugar, yeast, eggs, milk, butter\",\"Knead dough and let rise\",\"Shape into rings\",\"Fry in oil until golden\"]",
    "prepTime": null,
    "quantity": 20,
    "batchSize": 10,
    "status": "active"
  },
  "ingredientsDeducted": [
    {
      "name": "Butter",
      "amountDeducted": 0.1,
      "unit": "kg",
      "cost": 4000
    },
    {
      "name": "Flour",
      "amountDeducted": 0.5,
      "unit": "kg",
      "cost": 1500
    },
    {
      "name": "Sugar",
      "amountDeducted": 0.2,
      "unit": "kg",
      "cost": 600
    },
    {
      "name": "Yeast",
      "amountDeducted": 0.04,
      "unit": "g",
      "cost": 40
    },
    {
      "name": "Milk",
      "amountDeducted": 0.2,
      "unit": "L",
      "cost": 640
    },
    {
      "name": "Eggs",
      "amountDeducted": 2,
      "unit": "pcs",
      "cost": 800
    }
  ]
}
```

---


## Dashboard Module

### `GET /api/dashboard` - Get Dashboard Data

**Description:**
This endpoint retrieves dashboard data tailored to the user's role. Admins get a comprehensive overview of sales, purchases, inventory, and accounting, while cashiers get a summary of sales.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/dashboard`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

**Successful Response (Status: 200 OK) - Admin Role:**
```json
{
  "salesSummary": {
    "dailySales": 0,
    "weeklySales": 10.8,
    "topSellingProducts": [
      {
        "_sum": {
          "quantity": 4
        },
        "productId": 90001,
        "productName": "Croissant"
      }
    ]
  },
  "purchaseSummary": {
    "dailySpend": 0,
    "weeklySpend": 171.5,
    "recentPurchases": [
      {
        "id": 60004,
        "supplierId": 1,
        "totalCost": 32,
        "status": "approved",
        "notes": null,
        "createdAt": "2025-09-16T11:28:11.784Z",
        "updatedAt": "2025-09-16T11:28:26.752Z",
        "createdById": 1,
        "approvedById": null
      }
    ],
    "pendingPayments": 171.5
  },
  "inventorySummary": {
    "lowStockAlerts": [],
    "recentStockUpdates": [
      {
        "id": 3,
        "inventoryItemId": 2,
        "amount": -5,
        "reason": "Wastage",
        "createdAt": "2025-09-15T18:56:07.919Z",
        "createdById": 1
      }
    ],
    "ingredientOverview": [
      {
        "id": 1,
        "name": "Wheat Flour",
        "currentQuantity": 90,
        "unit": "kg",
        "minLevel": 20,
        "maxLevel": 500,
        "cost": 2.5,
        "type": "raw_material",
        "status": "in-stock",
        "createdAt": "2025-09-13T11:37:47.531Z",
        "updatedAt": "2025-09-16T13:36:44.374Z",
        "createdById": 1,
        "updatedById": null
      }
    ]
  },
  "accountingSummary": {
    "incomeVsExpenses": {
      "monthlyIncome": 10.8,
      "monthlyExpenses": 0,
      "weeklyIncome": 10.8,
      "weeklyExpenses": 0
    },
    "allTimeUnpaidSales": 8.1,
    "monthlyProfitLoss": [
      {
        "month": "April",
        "profit": 0
      },
      {
        "month": "May",
        "profit": 0
      },
      {
        "month": "June",
        "profit": 0
      },
      {
        "month": "July",
        "profit": 0
      },
      {
        "month": "August",
        "profit": 0
      },
      {
        "month": "September",
        "profit": 10.8
      }
    ]
  },
  "customerSummary": {
    "totalCustomers": 5,
    "newCustomersThisWeek": 5
  }
}
```

**Successful Response (Status: 200 OK) - Cashier Role:**
```json
{
  "salesSummary": {
    "dailySales": 0,
    "weeklySales": 10.8,
    "topSellingProducts": [
      {
        "_sum": {
          "quantity": 4
        },
        "productId": 90001,
        "productName": "Croissant"
      }
    ]
  }
}
```
---

## Accounting Module

### `POST /api/accounting/expenses` - Create a new expense

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/accounting/expenses`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body:**
  ```json
  {
    "amount": 120.50,
    "category": "Utilities",
    "date": "2025-09-17T10:00:00Z",
    "notes": "Monthly electricity bill"
  }
  ```

**Successful Response (Status: 201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "amount": 120.50,
    "category": "Utilities",
    "date": "2025-09-17T10:00:00.000Z",
    "notes": "Monthly electricity bill",
    "status": "complete",
    "createdAt": "2025-09-17T10:00:00.000Z",
    "updatedAt": "2025-09-17T10:00:00.000Z",
    "createdById": <USER_ID>
  }
}
```

### `GET /api/accounting/reports` - Get Comprehensive Accounting Report

**Description:** This endpoint provides a comprehensive accounting report, including total expenses, total raw material cost, total supplies cost, and a daily breakdown of expenses, raw materials, and supplies.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/accounting/reports`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Query Parameters:**
  - `dateFrom` (string, format: YYYY-MM-DD, optional): Start date for the report period.
  - `dateTo` (string, format: YYYY-MM-DD, optional): End date for the report period.

**Successful Response (Status: 200 OK):**
```json
{
  "data": {
    "income": 0,
    "totalExpenses": 1500.00,
    "totalRawMaterialCost": 500.00,
    "totalSuppliesCost": 200.00,
    "dailyBreakdown": [
      { "cat": "electricity", "total": 100.00, "date": "2025-09-05" },
      { "cat": "raw_materials", "total": 250.00, "date": "2025-09-05" },
      { "cat": "supplies", "total": 100.00, "date": "2025-09-05" },
      { "cat": "rent", "total": 500.00, "date": "2025-09-10" },
      { "cat": "raw_materials", "total": 250.00, "date": "2025-09-12" },
      { "cat": "supplies", "total": 100.00, "date": "2025-09-12" },
      { "cat": "salaries", "total": 900.00, "date": "2025-09-15" }
    ],
    "profit": 0,
    "breakdown": {}
  }
}
```

### `GET /api/accounting/expenses/summary` - Get Expense Summary

**Description:** This endpoint provides a summary of expenses, grouped by category, and the overall total expenses for a given period.

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/accounting/expenses/summary`
- **Headers:**
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Query Parameters:**
  - `dateFrom` (string, format: YYYY-MM-DD, optional): Start date for the summary period.
  - `dateTo` (string, format: YYYY-MM-DD, optional): End date for the summary period.

**Successful Response (Status: 200 OK):**
```json
{
  "data": {
    "summaryByCategory": {
      "electricity": 100.00,
      "rent": 500.00,
      "salaries": 900.00
    },
    "totalExpenses": 1500.00
  }
}
```