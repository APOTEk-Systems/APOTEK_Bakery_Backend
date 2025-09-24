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