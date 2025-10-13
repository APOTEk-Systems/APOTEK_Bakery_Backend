# API Endpoints Documentation

This document outlines the RESTful API endpoints for the Pastry Pros Suite application. The API is designed to support the frontend modules, providing CRUD operations for key entities. All endpoints use JSON for requests and responses. Base URL: `http://localhost:3000/api/v1` (adjust for production).

## Authentication and Headers
- All endpoints (except `/auth/login` and `/auth/register`) require a JWT token in the `Authorization` header: `Bearer <token>`.
- Content-Type: `application/json` for POST/PUT requests.
- Error responses: `{ error: "message", status: 4xx/5xx }`.
- Success responses: `{ success: true, data: {...}, message: "optional" }` with HTTP 200/201.
- Audit Logging: All mutations (POST/PUT/DELETE) are automatically audit-logged with user ID, action, timestamp, and affected entity for compliance and tracking.
- User Tracking: Standardized across entities (except Users and Settings): All use `createdBy` (auto-set on create) and `updatedBy` (auto-set on update). Business-specific fields (e.g., `approvedBy`, `receivedBy`, `producedBy`) are added only where relevant for transparency without redundancy. For example, in Sales, `soldBy` serves as `createdBy` since creation implies selling.

## Users & Role Management
Handles user authentication, creation, and permission assignments. Roles are limited to 'admin' and 'cashier', but permissions are granular (e.g., cashiers can have custom subsets like view:sales but not create:inventory, update:inventory). No data-level user tracking on Users entities.

### Authentication Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/auth/login` | Authenticate user and return JWT. | `{ "email": "string", "password": "string" }` | `{ "token": "string", "user": { "id": "uuid", "name": "string", "email": "string", "role": "admin/cashier", "permissions": ["string[]"] } }` |
| POST | `/auth/register` | Register new user (admin only). | `{ "name": "string", "email": "string", "password": "string", "role": "admin/cashier" }` | `{ "success": true, "user": { ... } }` |
| POST | `/auth/logout` | Invalidate token (client-side). | None | `{ "success": true }` |
| POST | `/auth/refresh` | Refresh JWT token. | `{ "refreshToken": "string" }` | `{ "token": "string" }` |

### Users Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/users` | List all users (paginated, searchable). Query: `?page=1&limit=10&search=term` | None | `{ "data": [ { "id": "uuid", "name": "string", "email": "string", "role": "admin/cashier", "permissions": ["view:sales", "create:products", "update:products"], "status": "active/inactive", "createdAt": "date" } ], "total": number, "page": number }` |
| GET | `/users/:id` | Get user by ID. | None | `{ "data": { ...user fields... } }` |
| POST | `/users` | Create new user. | `{ "name": "string", "email": "string", "password": "string", "role": "admin/cashier", "permissions"?: ["string[]"] }` | `{ "success": true, "data": { ...user without password... } }` |
| PUT | `/users/:id` | Update user. | Partial: `{ "name"?: "string", "email"?: "string", "role"?: "admin/cashier", "permissions"?: ["string[]"], "status"?: "string" }` (password requires oldPassword) | `{ "success": true, "data": { ...updated user... } }` |
| DELETE | `/users/:id` | Delete user (soft delete). | None | `{ "success": true }` |

### Roles & Permissions Endpoints
Roles are predefined ('admin' with all permissions, 'cashier' with base + custom). Permissions are enforced via middleware.

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/roles` | List available roles and their default permissions. | None | `{ "data": [ { "role": "admin", "defaultPermissions": ["all"] }, { "role": "cashier", "defaultPermissions": ["view:sales", "create:sales", "update:sales"] } ] }` |
| PUT | `/users/:id/permissions` | Update user-specific permissions (for granular cashier access). | `{ "permissions": ["view:customers", "create:inventory", "update:inventory"] }` | `{ "success": true, "data": { "permissions": ["string[]"] } }` |

## Customers Module
Manages customer data for sales and orders. Supports credit customers with limits. Uses createdBy/updatedBy.

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/customers` | List customers (search by name/email). Query: `?search=term&isCredit=true&page=1` | None | `{ "data": [ { "id": "uuid", "name": "string", "email": "string", "phone": "string", "address": "string", "status": "active/inactive", "isCredit": boolean, "creditLimit": number, "currentCredit": number, "loyaltyPoints": number, "birthday": "date", "notes": "string", "createdBy": "uuid", "updatedBy": "uuid", "createdAt": "date", "updatedAt": "date" } ], "total": number }` |
| GET | `/customers/:id` | Get customer details. | None | `{ "data": { ...customer... } }` |
| POST | `/customers` | Create customer (auto-sets createdBy). | `{ "name": "string", "email": "string", "phone"?: "string", "address"?: "string", "isCredit"?: boolean, "creditLimit"?: number, "birthday"?: "date", "loyaltyPoints"?: number, "notes"?: "string" }` | `{ "success": true, "data": { ...customer... } }` |
| PUT | `/customers/:id` | Update customer (auto-sets updatedBy). | Partial fields as above. | `{ "success": true, "data": { ... } }` |
| DELETE | `/customers/:id` | Delete customer. | None | `{ "success": true }` |
| PUT | `/customers/:id/loyalty` | Update loyalty points (auto-sets updatedBy). | `{ "points": number, "action": "add/subtract" }` | `{ "success": true, "data": { "loyaltyPoints": number, "updatedBy": "uuid" } }` |
| PUT | `/customers/:id/credit` | Update credit balance (auto-sets updatedBy). | `{ "amount": number, "action": "add/subtract" }` | `{ "success": true, "data": { "currentCredit": number, "updatedBy": "uuid" } }` |

## Products Module
Handles product catalog for sales and inventory. Products include recipes (ingredients and instructions), managed here as static attributes. When updating products (PUT), if quantity is provided in the request, it updates the product's quantity (stock). Change from "stock" to "quantity" for consistency. Production leverages this module for recipe reference and quantity updates. Tracks createdBy/updatedBy.

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/products` | List products (filter by category/quantity). Query: `?category=bakery&lowQuantity=true` | None | `{ "data": [ { "id": "uuid", "name": "string", "description": "string", "price": number, "prepTime": number, "ingredients": [{ "name": "string", "amount": "string", "cost": number }], "instructions": ["string[]"], "quantity": number, "image": "string", "status": "active/inactive", "createdBy": "uuid", "updatedBy": "uuid", "createdAt": "date", "updatedAt": "date" } ], "total": number }` |
| GET | `/products/:id` | Get product details (includes recipe). | None | `{ "data": { ...product... } }` |
| POST | `/products` | Create product (auto-sets createdBy; defines recipe and initial quantity but no deduction). | Full fields as above (includes ingredients/instructions for recipe, quantity for initial). | `{ "success": true, "data": { ... } }` |
| PUT | `/products/:id` | Update product (auto-sets updatedBy; updates recipe/quantity if provided – no deduction). | Partial fields (quantity?: number for update). | `{ "success": true, "data": { ... } }` |
| DELETE | `/products/:id` | Delete product. | None | `{ "success": true }` |
| PUT | `/products/:id/quantity` | Manual quantity update (auto-sets updatedBy; for direct adjustments). | `{ "quantity": number, "action": "add/subtract" }` | `{ "success": true, "data": { "quantity": number, "updatedBy": "uuid" } }` |

## Sales Module
Records sales transactions, including credit for credit customers. Uses soldBy as createdBy (since creation = selling). Deducts from product quantity on sale.

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/sales` | List sales (filter by date/status/customer). Query: `?status=completed&dateFrom=YYYY-MM-DD&customerId=uuid` | None | `{ "data": [ { "id": "uuid", "customerId": "uuid", "soldBy": "uuid", "isCredit": boolean, "creditDueDate": "date"?, "items": [{ "productId": "uuid", "quantity": number, "price": number, "notes": "string" }], "total": number, "status": "pending/completed/cancelled", "date": "date", "payment": { "amount": number, "method": "cash/card/credit" }, "updatedBy": "uuid", "createdAt": "date", "updatedAt": "date" } ], "total": number }` |
| GET | `/sales/:id` | Get sale details. | None | `{ "data": { ...sale... } }` |
| POST | `/sales` | Create sale (auto-sets soldBy as createdBy; deducts quantity from product). | `{ "customerId": "uuid", "isCredit"?: boolean, "creditDueDate"?: "date", "items": [...], "total": number, "payment": {...} }` | `{ "success": true, "data": { ...sale... } }` |
| PUT | `/sales/:id` | Update sale (auto-sets updatedBy). | Partial. | `{ "success": true, "data": { ... } }` |
| DELETE | `/sales/:id` | Cancel sale (reverses quantity deduction). | None | `{ "success": true }` |
| PUT | `/sales/:id/payment` | Record partial payment for credit sales (auto-sets updatedBy). | `{ "amount": number, "method": "string" }` | `{ "success": true, "data": { "remaining": number, "updatedBy": "uuid" } }` |

## Purchases Module
Handles purchase orders and goods receiving. Uses createdBy/updatedBy; approvedBy for approvals; receivedBy for receiving.

### Purchase Orders

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/purchases/orders` | List POs (paginated, filter by status and date). Query: `?page=1&limit=10&status=pending&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` | None | `{ "data": { "purchaseOrders": [ { "id": "uuid", "supplier": "string", "items": [{ "item": "string", "quantity": number, "unit": "string", "unitCost": number }], "totalCost": number, "status": "pending/approved/denied", "notes": "string", "date": "date", "createdBy": "uuid", "approvedBy"?: "uuid", "updatedBy": "uuid", "createdAt": "date", "updatedAt": "date" } ], "total": number } }` |
| POST | `/purchases/orders` | Create PO (auto-sets createdBy). | Full. | `{ "success": true, "data": { ... } }` |
| PUT | `/purchases/orders/:id` | Update PO (auto-sets updatedBy). | Partial. | `{ "success": true, "data": { ... } }` |
| PUT | `/purchases/orders/:id/status` | Approve/deny PO (auto-sets approvedBy). | `{ "status": "approved/denied", "notes"?: "string" }` | `{ "success": true, "data": { "status": "string", "approvedBy": "uuid" } }` |

### Goods Receiving

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/purchases/receiving` | List goods receipts (paginated, filter by status and date). Query: `?page=1&limit=10&status=partial&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` | None | `{ "data": { "goodsReceipts": [ { "id": "uuid", "poId": "uuid", "supplierName": "string", "total": number, "receivedQuantity": number, "unit": "string", "status": "partial/full/rejected", "receivedDate": "date", "notes": "string", "receivedBy": "uuid", "createdBy": "uuid", "updatedBy": "uuid", "createdAt": "date", "updatedAt": "date" } ], "total": number } }` |
| POST | `/purchases/receiving` | Record receipt (auto-sets receivedBy as createdBy; adds to inventory quantity). | `{ "poId": "uuid", "receivedQuantity": number, "unit": "string", "notes"?: "string" }` | `{ "success": true, "data": { ... } }` |
| PUT | `/purchases/receiving/:id` | Update receipt (auto-sets updatedBy). | Partial. | `{ "success": true, "data": { ... } }` |

## Inventory Module
Tracks quantity levels for raw ingredients/materials. Uses createdBy/updatedBy.

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/inventory` | List items (filter low quantity or type). Query: `?low=true&type=raw_material` | None | `{ "data": [ { "id": "uuid", "name": "string", "supplier": "string", "currentQuantity": number, "minLevel": number, "maxLevel": number, "cost": number, "type": "string", "status": "in-stock/low/out-of-stock", "createdBy": "uuid", "updatedBy": "uuid", "createdAt": "date", "updatedAt": "date" } ] }` |
| GET | `/inventory/:id` | Get item. | None | `{ "data": { ... } }` |
| POST | `/inventory` | Add item (auto-sets createdBy). | Full fields. | `{ "success": true, "data": { ... } }` |
| PUT | `/inventory/:id` | Update item (auto-sets updatedBy). | Partial. | `{ "success": true, "data": { ... } }` |
| PUT | `/inventory/:id/quantity` | Adjust quantity (auto-sets updatedBy; for manual changes). | `{ "quantity": number, "action": "add/subtract", "reason"?: "string" }` | `{ "success": true, "data": { "currentQuantity": number, "updatedBy": "uuid" } }` |
| DELETE | `/inventory/:id` | Remove item. | None | `{ "success": true }` |

## Inventory Adjustments Module
Handles manual inventory adjustments for wastage or other reasons.

| Method | Endpoint | Description | Request Body | Response |
|---|---|---|---|---|
| GET | `/adjustments` | List adjustments (filter by date or type). Query: `?date=YYYY-MM-DD&type=raw_material` | None | `{ "data": [ { "id": "uuid", "inventoryItemId": "uuid", "amount": number, "reason": "string", "createdAt": "date", "createdBy": { ... } } ] }` |
| POST | `/adjustments` | Create a new inventory adjustment. | `{ "inventoryItemId": "uuid", "amount": number, "reason": "string" }` | `{ "success": true, "data": { "adjustment": { ... }, "inventoryItem": { ... } } }` |

## Accounting Module
Manages expenses and financial records. Uses createdBy/updatedBy; approvedBy for approvals.

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/accounting/expenses` | List expenses (by category/date). Query: `?category=supplies&dateFrom=YYYY-MM-DD` | None | `{ "data": [ { "id": "uuid", "amount": number, "category": "string", "date": "date", "status": "pending/approved/paid", "notes": "string", "createdBy": "uuid", "approvedBy"?: "uuid", "updatedBy": "uuid", "createdAt": "date", "updatedAt": "date" } ], "summary": { "total": number, "byCategory": {} } }` |
| GET | `/accounting/expenses/:id` | Get expense. | None | `{ "data": { ... } }` |
| POST | `/accounting/expenses` | Add expense (auto-sets createdBy). | Full. | `{ "success": true, "data": { ... } }` |
| PUT | `/accounting/expenses/:id` | Update expense (auto-sets updatedBy). | Partial. | `{ "success": true, "data": { ... } }` |
| PUT | `/accounting/expenses/:id/status` | Approve/pay expense (auto-sets approvedBy). | `{ "status": "string" }` | `{ "success": true, "data": { "status": "string", "approvedBy": "uuid" } }` |
| DELETE | `/accounting/expenses/:id` | Delete expense. | None | `{ "success": true }` |
| GET | `/accounting/reports` | Generate basic financial reports. Query: `?period=month&year=2025` | None | `{ "data": { "income": number, "expenses": number, "profit": number, "breakdown": {} } }` |

## Production Module
Tracks bakery production runs for finished products. This module leverages the Products module by using its recipe (ingredients and instructions) to calculate deductions and automatically updates the product's quantity with the produced amount. Recipes are managed in Products; Production only references them for operational calculations. Deductions from inventory occur exclusively here. Uses producedBy as createdBy. Tracks updatedBy for updates.

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/production` | List production runs (filter by date/product). Query: `?productId=uuid&dateFrom=YYYY-MM-DD` | None | `{ "data": [ { "id": "uuid", "productId": "uuid", "quantityProduced": number, "date": "date", "producedBy": "uuid", "ingredientsDeducted": [{ "ingredient": "string", "amountDeducted": number }], "cost": number, "notes": "string", "updatedBy": "uuid", "createdAt": "date", "updatedAt": "date" } ], "total": number }` |
| GET | `/production/:id` | Get production run details. | None | `{ "data": { ...run... } }` |
| POST | `/production` | Create production run (auto-sets producedBy as createdBy). System: 1. Fetches recipe from Products. 2. Calculates ingredient needs * quantity. 3. Deducts from inventory. 4. Adds quantity to product's quantity in Products. 5. Logs audit. | `{ "productId": "uuid", "quantity": number, "notes"?: "string" }` | `{ "success": true, "data": { ...run..., "ingredientsDeducted": [...], "productQuantityUpdated": { "oldQuantity": number, "newQuantity": number } } }` |
| PUT | `/production/:id` | Update production run (auto-sets updatedBy). | Partial. | `{ "success": true, "data": { ... } }` |
| DELETE | `/production/:id` | Delete production run (reverses deductions and quantity update). | None | `{ "success": true }` |

## Reporting Module
Provides aggregated reports for business insights.

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/reports/sales` | Sales report (daily/monthly totals, by product/customer). Query: `?period=month&startDate=YYYY-MM-DD` | None | `{ "data": { "totalSales": number, "byProduct": [{ "productId": "uuid", "total": number }], "byCustomer": [{ "customerId": "uuid", "total": number }], "creditOutstanding": number } }` |
| GET | `/reports/inventory` | Inventory report (quantity levels, low alerts, valuation). Query: `?includeValue=true` | None | `{ "data": { "totalItems": number, "lowQuantity": [...], "totalValue": number, "byCategory": {} } }` |
| GET | `/reports/customers` | Customer report (loyalty, credit status, purchase history). Query: `?top=10` | None | `{ "data": { "topCustomers": [...], "creditRisks": [...], "loyaltySummary": { "totalPoints": number } } }` |
| GET | `/reports/financial` | Financial overview (P&L, cash flow). Query: `?period=quarter` | None | `{ "data": { "revenue": number, "expenses": number, "netProfit": number, "cashFlow": number } }` |
| GET | `/reports/production` | Production report (output, costs, efficiency). Query: `?period=month` | None | `{ "data": { "totalProduced": number, "byProduct": [...], "totalCost": number, "efficiency": number } }` |
| GET | `/reports/audit` | Audit log report (user actions). Query: `?userId=uuid&fromDate=YYYY-MM-DD&action=create:po` | None | `{ "data": [ { "id": "uuid", "userId": "uuid", "userName": "string", "action": "string", "entityId": "uuid", "timestamp": "date", "details": "string" } ], "total": number }` |

## Settings Module
Application-wide configurations. No data-level user tracking.

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/settings` | Get all settings. | None | `{ "data": { "theme": "string", "currency": "string", "taxRate": number, "businessName": "string", ... } }` |
| PUT | `/settings` | Update settings (admin only). | Partial fields. | `{ "success": true, "data": { ...updated... } }` |

## Audit Logging
- Automatic: Every mutation logs { userId, userName, action, entityId, timestamp, details } to a secure table.
- Data-Level Tracking: Uses standardized createdBy/updatedBy + specific fields (e.g., approvedBy, receivedBy, producedBy) where business context adds value.
- Access: Via `/reports/audit`.
- Retention: 1 year.