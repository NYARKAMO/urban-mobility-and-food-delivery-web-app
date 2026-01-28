# Restaurant API Documentation

## Base URL
```
GET/POST http://localhost:3000/api/restaurants
```

## Authentication
All restaurant endpoints require JWT authentication with restaurant role.

---

## Authentication Endpoints

### Restaurant Registration
```http
POST /restaurants/auth/register
```

**Request Body:**
```json
{
  "ownerFirstName": "John",
  "ownerLastName": "Doe",
  "ownerEmail": "john@restaurant.com",
  "ownerPhone": "+237 650 123 456",
  "restaurantName": "Le Gourmet Cafe",
  "cuisineType": "French",
  "deliveryRadius": 10,
  "street": "123 Boulevard de la Liberté",
  "city": "Douala",
  "postalCode": "2700",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "restaurantId": "rest_001",
    "email": "john@restaurant.com",
    "restaurantName": "Le Gourmet Cafe"
  },
  "message": "Registration successful. Please verify your business documents."
}
```

### Restaurant Login
```http
POST /restaurants/auth/login
```

**Request Body:**
```json
{
  "email": "john@restaurant.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "restaurant": {
      "id": "rest_001",
      "email": "john@restaurant.com",
      "name": "Le Gourmet Cafe",
      "status": "active"
    }
  },
  "message": "Login successful"
}
```

### Restaurant Logout
```http
POST /restaurants/auth/logout
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Logout successful"
}
```

---

## Dashboard Endpoints

### Get Restaurant Dashboard
```http
GET /restaurants/dashboard
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "restaurantId": "rest_001",
    "name": "Le Gourmet Cafe",
    "status": "open",
    "rating": 4.6,
    "totalOrders": 2345,
    "totalEarnings": 1234567.50,
    "todaysEarnings": 8900,
    "todaysOrders": 34,
    "recentOrders": [
      {
        "id": "order_001",
        "customer": "Nadine Patricia",
        "items": 3,
        "total": 12500,
        "status": "delivered",
        "timestamp": "2026-01-20T15:30:00Z"
      }
    ],
    "stats": {
      "acceptanceRate": 98.5,
      "cancellationRate": 1.2,
      "averageRating": 4.6,
      "completedOrders": 2345,
      "preparationTime": 22
    }
  }
}
```

---

## Profile Endpoints

### Get Restaurant Profile
```http
GET /restaurants/profile
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": "rest_001",
    "name": "Le Gourmet Cafe",
    "description": "Authentic French Cuisine",
    "cuisineType": "French",
    "phone": "+237 650 123 456",
    "email": "john@restaurant.com",
    "address": "123 Boulevard de la Liberté, Douala",
    "city": "Douala",
    "postalCode": "2700",
    "deliveryRadius": 10,
    "logo": "https://...",
    "coverPhoto": "https://...",
    "rating": 4.6,
    "totalReviews": 456,
    "joinedDate": "2025-06-10T10:00:00Z",
    "operatingHours": {
      "monday": {"open": "09:00", "close": "22:00"},
      "tuesday": {"open": "09:00", "close": "22:00"},
      "wednesday": {"open": "09:00", "close": "22:00"},
      "thursday": {"open": "09:00", "close": "22:00"},
      "friday": {"open": "09:00", "close": "23:00"},
      "saturday": {"open": "10:00", "close": "23:00"},
      "sunday": {"open": "10:00", "close": "22:00"}
    }
  }
}
```

### Update Restaurant Profile
```http
PUT /restaurants/profile
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "description": "Authentic French Cuisine",
  "deliveryRadius": 10,
  "operatingHours": {
    "monday": {"open": "09:00", "close": "22:00"},
    "tuesday": {"open": "09:00", "close": "22:00"}
  },
  "logo": "base64_image_data",
  "coverPhoto": "base64_image_data"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Profile updated successfully"
}
```

### Update Bank Details
```http
PUT /restaurants/profile/bank-details
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "accountHolder": "Le Gourmet Cafe",
  "accountNumber": "1234567890",
  "bankName": "Standard Chartered Bank",
  "swiftCode": "SCBLCMCM",
  "branchCode": "001"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Bank details updated successfully"
}
```

---

## Menu Management Endpoints

### Get Menu Categories
```http
GET /restaurants/menu/categories
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "categories": [
      {
        "id": "cat_001",
        "name": "Appetizers",
        "description": "Start your meal",
        "itemCount": 12,
        "displayOrder": 1
      },
      {
        "id": "cat_002",
        "name": "Main Courses",
        "description": "Our signature dishes",
        "itemCount": 25,
        "displayOrder": 2
      }
    ]
  }
}
```

### Create Menu Category
```http
POST /restaurants/menu/categories
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Desserts",
  "description": "Sweet treats",
  "displayOrder": 5
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "id": "cat_003",
    "name": "Desserts",
    "description": "Sweet treats"
  },
  "message": "Category created successfully"
}
```

### Get Menu Items
```http
GET /restaurants/menu/items
Authorization: Bearer <token>
```

**Query Parameters:**
- `category` (optional): Filter by category
- `page` (optional): Default: 1
- `limit` (optional): Default: 20

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "id": "item_001",
        "name": "French Onion Soup",
        "description": "Classic French onion soup with melted cheese",
        "category": "Appetizers",
        "price": 3500,
        "currency": "XAF",
        "image": "https://...",
        "preparationTime": 10,
        "availability": true,
        "spicy": false,
        "vegetarian": true,
        "calories": 280
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "pages": 3
    }
  }
}
```

### Add Menu Item
```http
POST /restaurants/menu/items
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Beef Bourguignon",
  "description": "Tender beef in red wine sauce",
  "category": "Main Courses",
  "price": 8500,
  "preparationTime": 25,
  "image": "base64_image_data",
  "availability": true,
  "spicy": false,
  "vegetarian": false,
  "vegan": false,
  "calories": 450,
  "portions": 1
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "id": "item_002",
    "name": "Beef Bourguignon",
    "price": 8500
  },
  "message": "Menu item added successfully"
}
```

### Update Menu Item
```http
PUT /restaurants/menu/items/:itemId
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Beef Bourguignon",
  "price": 9000,
  "preparationTime": 25,
  "availability": true
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Menu item updated successfully"
}
```

### Delete Menu Item
```http
DELETE /restaurants/menu/items/:itemId
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Menu item deleted successfully"
}
```

### Toggle Item Availability
```http
POST /restaurants/menu/items/:itemId/toggle
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "availability": false,
  "reason": "Out of stock"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Item availability updated"
}
```

---

## Order Management Endpoints

### Get Pending Orders
```http
GET /restaurants/orders/pending
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "orders": [
      {
        "id": "order_001",
        "orderNumber": "ORD-20260127-001",
        "customer": {
          "name": "Nadine Patricia",
          "phone": "+237 650 123 456",
          "rating": 4.9
        },
        "items": [
          {
            "itemId": "item_001",
            "name": "French Onion Soup",
            "quantity": 2,
            "price": 3500,
            "specialInstructions": "Extra cheese"
          }
        ],
        "total": 7000,
        "deliveryAddress": "Bonanjo, Douala",
        "deliveryTime": "30-45 mins",
        "status": "pending",
        "requestedAt": "2026-01-27T12:00:00Z"
      }
    ]
  }
}
```

### Accept Order
```http
POST /restaurants/orders/:orderId/accept
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "estimatedPreparationTime": 25
}
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "orderId": "order_001",
    "status": "accepted",
    "estimatedReadyAt": "2026-01-27T12:25:00Z"
  },
  "message": "Order accepted successfully"
}
```

### Reject Order
```http
POST /restaurants/orders/:orderId/reject
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "reason": "Item out of stock"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Order rejected successfully"
}
```

### Update Order Status
```http
PUT /restaurants/orders/:orderId/status
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "preparing|ready|cancelled"
}
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "orderId": "order_001",
    "status": "ready"
  },
  "message": "Order status updated successfully"
}
```

### Get Order History
```http
GET /restaurants/orders/history
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Default: 1
- `limit` (optional): Default: 20
- `status` (optional): completed, cancelled, rejected
- `startDate` (optional): YYYY-MM-DD
- `endDate` (optional): YYYY-MM-DD

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "orders": [
      {
        "id": "order_001",
        "orderNumber": "ORD-20260127-001",
        "customer": "Nadine Patricia",
        "items": 3,
        "total": 12500,
        "status": "completed",
        "rating": 5,
        "review": "Excellent food and fast delivery",
        "timestamp": "2026-01-20T15:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 2345,
      "pages": 118
    }
  }
}
```

### Get Order Details
```http
GET /restaurants/orders/:orderId
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": "order_001",
    "orderNumber": "ORD-20260127-001",
    "customer": {
      "name": "Nadine Patricia",
      "phone": "+237 650 123 456",
      "email": "nadine@email.com",
      "address": "Bonanjo, Douala"
    },
    "items": [
      {
        "itemId": "item_001",
        "name": "French Onion Soup",
        "quantity": 2,
        "price": 3500,
        "subtotal": 7000,
        "specialInstructions": "Extra cheese"
      }
    ],
    "subtotal": 12000,
    "deliveryFee": 1000,
    "tax": 500,
    "total": 13500,
    "status": "completed",
    "timeline": {
      "orderedAt": "2026-01-20T15:00:00Z",
      "acceptedAt": "2026-01-20T15:05:00Z",
      "readyAt": "2026-01-20T15:30:00Z",
      "deliveredAt": "2026-01-20T15:45:00Z"
    }
  }
}
```

---

## Earnings Endpoints

### Get Earnings Summary
```http
GET /restaurants/earnings/summary
Authorization: Bearer <token>
```

**Query Parameters:**
- `period` (optional): today, week, month, year

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "period": "month",
    "totalEarnings": 1234567.50,
    "thisMonth": 234500.75,
    "thisWeek": 52100.30,
    "today": 8900,
    "breakdown": {
      "completedOrders": 2345,
      "totalRevenue": 2654300,
      "platformFee": 265430,
      "netEarnings": 2388870,
      "commissionRate": 10
    }
  }
}
```

### Get Revenue Analytics
```http
GET /restaurants/earnings/analytics
Authorization: Bearer <token>
```

**Query Parameters:**
- `startDate` (optional): YYYY-MM-DD
- `endDate` (optional): YYYY-MM-DD

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "dailyRevenue": [
      {
        "date": "2026-01-27",
        "orders": 34,
        "revenue": 156800,
        "platformFee": 15680,
        "netEarnings": 141120
      }
    ],
    "topItems": [
      {
        "itemId": "item_001",
        "name": "French Onion Soup",
        "orders": 456,
        "revenue": 1596000
      }
    ]
  }
}
```

### Get Payouts
```http
GET /restaurants/payouts
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): pending, processed, failed

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "payouts": [
      {
        "id": "payout_001",
        "amount": 234500.75,
        "status": "pending",
        "requestedAt": "2026-01-20T10:00:00Z",
        "expectedDate": "2026-02-03T00:00:00Z"
      }
    ],
    "bankDetails": {
      "accountNumber": "****1234",
      "bankName": "Standard Chartered",
      "accountHolder": "Le Gourmet Cafe"
    }
  }
}
```

### Request Payout
```http
POST /restaurants/payouts/request
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "amount": 234500.75
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "payoutId": "payout_002",
    "amount": 234500.75,
    "status": "pending",
    "expectedDate": "2026-02-03T00:00:00Z"
  },
  "message": "Payout request submitted successfully"
}
```

---

## Rating & Reviews Endpoints

### Get Restaurant Ratings
```http
GET /restaurants/ratings
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "averageRating": 4.6,
    "totalReviews": 456,
    "ratingDistribution": {
      "5": 320,
      "4": 100,
      "3": 25,
      "2": 8,
      "1": 3
    },
    "recentReviews": [
      {
        "orderId": "order_001",
        "customer": "Nadine Patricia",
        "rating": 5,
        "review": "Excellent food and fast delivery",
        "date": "2026-01-20T15:45:00Z"
      }
    ]
  }
}
```

---

## Delivery Management Endpoints

### Get Delivery Zones
```http
GET /restaurants/delivery/zones
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "zones": [
      {
        "id": "zone_001",
        "name": "Zone 1 - Douala Center",
        "deliveryTime": "30-45 mins",
        "deliveryFee": 1000,
        "enabled": true
      }
    ]
  }
}
```

### Update Delivery Zones
```http
PUT /restaurants/delivery/zones
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "zones": [
    {
      "name": "Zone 1 - Douala Center",
      "deliveryTime": "30-45 mins",
      "deliveryFee": 1000,
      "enabled": true
    }
  ]
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Delivery zones updated successfully"
}
```

---

## Support Endpoints

### Submit Support Ticket
```http
POST /restaurants/support/tickets
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "subject": "Payment processing delay",
  "category": "payment",
  "priority": "high",
  "description": "Haven't received payment for orders from last week",
  "attachments": ["screenshot_url"]
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "ticketId": "ticket_001",
    "status": "open",
    "createdAt": "2026-01-27T12:00:00Z"
  },
  "message": "Ticket submitted successfully"
}
```

### Get Support Tickets
```http
GET /restaurants/support/tickets
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "tickets": [
      {
        "id": "ticket_001",
        "subject": "Payment processing delay",
        "status": "open",
        "priority": "high",
        "createdAt": "2026-01-27T12:00:00Z"
      }
    ]
  }
}
```

---

## Settings Endpoints

### Get Restaurant Settings
```http
GET /restaurants/settings
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "notifications": {
      "newOrders": true,
      "orderUpdates": true,
      "promotionalOffers": true,
      "weeklyReports": true
    },
    "preferences": {
      "language": "en",
      "currency": "XAF",
      "timezone": "UTC+1",
      "orderNotificationSound": true
    },
    "businessSettings": {
      "autoAcceptOrders": false,
      "minOrderValue": 2000,
      "seasonalClosure": []
    }
  }
}
```

### Update Restaurant Settings
```http
PUT /restaurants/settings
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "notifications": {
    "newOrders": true,
    "orderUpdates": true
  },
  "preferences": {
    "language": "en",
    "orderNotificationSound": true
  },
  "businessSettings": {
    "autoAcceptOrders": false,
    "minOrderValue": 2000
  }
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Settings updated successfully"
}
```

