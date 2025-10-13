# Permissions

This document outlines the permissions used in the Pastry Pros Suite application.

## Global Permissions

- `all`: Grants unrestricted access to all features and settings. This permission should be reserved for administrators.

## Users & Role Management

- `view:users`: Allows viewing the list of users and their details.
- `create:users`: Allows adding user information.
- `update:users`: Allows editing user information.
- `delete:users`: Allows deleting users.
- `manage:roles`: Allows managing user roles and their permissions.

## Customers

- `view:customers`: Allows viewing the list of customers and their details.
- `create:customers`: Allows adding customer information.
- `update:customers`: Allows editing customer information.
- `delete:customers`: Allows deleting customers.
- `update:credit`: Allows updating a customer's credit balance.

## Products

- `view:products`: Allows viewing the list of products and their details.
- `create:products`: Allows adding product information, including recipes.
- `update:products`: Allows editing product information, including recipes.
- `delete:products`: Allows deleting products.
- `update:quantity`: Allows manually adjusting the quantity of a product.

## Sales

- `view:sales`: Allows viewing the list of sales and their details.
- `create:sales`: Allows adding sales records.
- `update:sales`: Allows editing sales records.
- `delete:sales`: Allows canceling sales.
- `update:payment`: Allows recording payments for sales.

## Purchases

- `view:purchases`: Allows viewing the list of purchase orders and their details.
- `create:purchases`: Allows adding purchase orders.
- `update:purchases`: Allows editing purchase orders.
- `approve:purchases`: Allows approving or denying purchase orders.
- `receive:goods`: Allows recording the receipt of goods from a purchase order.

## Inventory

- `view:inventory`: Allows viewing the list of inventory items and their details.
- `create:inventory`: Allows adding inventory items.
- `update:inventory`: Allows editing inventory items.
- `delete:inventory`: Allows deleting inventory items.
- `adjust:inventory`: Allows manually adjusting the quantity of an inventory item.

## Inventory Adjustments

- `view:adjustments`: Allows viewing the list of inventory adjustments and their details.
- `create:adjustments`: Allows adding new inventory adjustments.
- `update:adjustments`: Allows editing new inventory adjustments.

## Accounting

- `view:expenses`: Allows viewing the list of expenses and their details.
- `create:expenses`: Allows adding expenses.
- `update:expenses`: Allows editing expenses.
- `approve:expenses`: Allows approving or paying expenses.
- `delete:expenses`: Allows deleting expenses.
- `view:reports`: Allows generating and viewing financial reports.

## Production

- `view:production`: Allows viewing the list of production runs and their details.
- `create:production`: Allows adding production runs.
- `update:production`: Allows editing production runs.
- `delete:production`: Allows deleting production runs.

## Reporting

- `view:reports`: Allows generating and viewing all reports.
- `view:audit`: Allows viewing the audit log.

## Settings

- `view:settings`: Allows viewing the application settings.
- `update:settings`: Allows updating the application settings.

## Dashboard

- `view:salesDashboard`: Allows viewing the sales summary on the dashboard.
- `view:purchasesDashboard`: Allows viewing the purchases summary on the dashboard.
- `view:inventoryDashboard`: Allows viewing the inventory summary on the dashboard.
- `view:accountingDashboard`: Allows viewing the accounting summary on the dashboard.

## Suppliers

- `view:suppliers`: Allows viewing the list of suppliers and their details.
- `create:suppliers`: Allows adding supplier information.
- `update:suppliers`: Allows editing supplier information.
- `delete:suppliers`: Allows deleting suppliers.