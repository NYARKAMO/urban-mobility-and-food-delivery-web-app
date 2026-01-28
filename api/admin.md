# Admin API Documentation

## Base URL
```
GET/POST http://localhost:3000/api/admin
```

## Authentication
All admin endpoints require JWT authentication with admin role.

---

## Authentication Endpoints

### Admin Login
```http
POST /admin/auth/login
```

**Request Body:**
```json
{
  "email": "admin@swiftride.com",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": "admin_001",
      "email": "admin@swiftride.com",
      "name": "Admin User",
      "role": "admin",
      "permissions": ["read_all", "write_all", "delete_all"]
    }
  },
  "message": "Login successful"
}
```

### Admin Logout
```http
POST /admin/auth/logout
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

### Get Dashboard Statistics
```http
GET /admin/dashboard/stats
Authorization: Bearer <token>
```

**Query Parameters:**
- `period` (optional): day, week, month, year - Default: day

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "totalUsers": 5432,
    "totalDrivers": 892,
    "totalRestaurants": 156,
    "totalRides": 28934,
    "totalOrders": 45821,
    "totalRevenue": 1245670.50,
    "activeRides": 124,
    "activeOrders": 287,
    "activeDrivers": 623,
    "activeRestaurants": 142
  }
}
```

### Get Dashboard Charts Data
```http
GET /admin/dashboard/charts
Authorization: Bearer <token>
```

**Query Parameters:**
- `type`: daily, weekly, monthly
- `metric`: revenue, orders, rides, users

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "labels": ["Jan 1", "Jan 2", "Jan 3", ...],
    "datasets": [
      {
        "label": "Revenue",
        "data": [2500, 3200, 2800, ...],
        "color": "#ec1304"
      }
    ]
  }
}
```

---

## User Management Endpoints

### Get All Users
```http
GET /admin/users
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Default: 1
- `limit` (optional): Default: 20
- `search` (optional): Search by name/email
- `status` (optional): active, inactive, banned

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "users": [
      {
        "id": "user_001",
        "name": "Nadine Patricia",
        "email": "nadine@mail.com",
        "phone": "+237 650 123 456",
        "status": "active",
        "createdAt": "2026-01-15T10:00:00Z",
        "totalRides": 45,
        "totalOrders": 67,
        "walletBalance": 12400,
        "rating": 4.8
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5432,
      "pages": 272
    }
  }
}
```

### Get User Details
```http
GET /admin/users/:userId
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": "user_001",
    "name": "Nadine Patricia",
    "email": "nadine@mail.com",
    "phone": "+237 650 123 456",
    "address": "Douala, Cameroon",
    "profilePhoto": "https://...",
    "status": "active",
    "createdAt": "2026-01-15T10:00:00Z",
    "rideHistory": [
      {
        "id": "ride_001",
        "date": "2026-01-20T15:30:00Z",
        "driver": "Alex Rodriguez",
        "amount": 5000,
        "status": "completed"
      }
    ],
    "foodOrders": [
      {
        "id": "order_001",
        "restaurant": "Pasta Palace",
        "amount": 12500,
        "status": "delivered"
      }
    ],
    "walletBalance": 12400,
    "rewards": 320,
    "rating": 4.8
  }
}
```

### Update User Status
```http
PUT /admin/users/:userId/status
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "active|inactive|banned",
  "reason": "User reason (optional)"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "User status updated successfully"
}
```

### Delete User
```http
DELETE /admin/users/:userId
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "message": "User deleted successfully"
}
```

---

## Driver Management Endpoints

### Get All Drivers
```http
GET /admin/drivers
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Default: 1
- `limit` (optional): Default: 20
- `status` (optional): active, inactive, banned, pending
- `search` (optional): Search by name/email

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "drivers": [
      {
        "id": "driver_001",
        "name": "Alex Rodriguez",
        "email": "driver@swiftride.com",
        "phone": "+237 600 123 456",
        "status": "active",
        "rating": 4.8,
        "totalRides": 456,
        "totalEarnings": 2345670.50,
        "vehicle": {
          "type": "car",
          "make": "Toyota",
          "model": "Camry",
          "year": 2020,
          "licensePlate": "ABC 123"
        },
        "documents": {
          "licenseVerified": true,
          "insuranceVerified": true,
          "backgroundCheckVerified": true
        },
        "joinedAt": "2025-06-10T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 892,
      "pages": 45
    }
  }
}
```

### Get Driver Details
```http
GET /admin/drivers/:driverId
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": "driver_001",
    "name": "Alex Rodriguez",
    "email": "driver@swiftride.com",
    "phone": "+237 600 123 456",
    "address": "Douala, Cameroon",
    "status": "active",
    "rating": 4.8,
    "totalRides": 456,
    "totalEarnings": 2345670.50,
    "bankAccount": {
      "accountNumber": "****1234",
      "bankName": "Standard Chartered",
      "accountHolder": "Alex Rodriguez"
    },
    "vehicle": {
      "id": "vehicle_001",
      "type": "car",
      "make": "Toyota",
      "model": "Camry",
      "year": 2020,
      "licensePlate": "ABC 123",
      "vin": "ABC123456789",
      "color": "White",
      "seats": 4
    },
    "documents": {
      "driverLicense": {
        "number": "DL123456789",
        "expiryDate": "2028-06-10",
        "verified": true
      },
      "insurance": {
        "policyNumber": "INS123456",
        "expiryDate": "2027-06-10",
        "verified": true
      },
      "backgroundCheck": {
        "status": "verified",
        "date": "2025-06-10"
      }
    },
    "recentRides": [
      {
        "id": "ride_001",
        "passenger": "Nadine Patricia",
        "pickupLocation": "Bonanjo",
        "dropoffLocation": "Douala Port",
        "distance": 8.5,
        "duration": 18,
        "fare": 5000,
        "rating": 5,
        "status": "completed",
        "timestamp": "2026-01-20T15:30:00Z"
      }
    ],
    "joinedAt": "2025-06-10T10:00:00Z"
  }
}
```

### Verify Driver Documents
```http
POST /admin/drivers/:driverId/verify
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "documents": {
    "driverLicense": true,
    "insurance": true,
    "backgroundCheck": true
  },
  "notes": "All documents verified"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Driver documents verified successfully"
}
```

### Suspend/Ban Driver
```http
PUT /admin/drivers/:driverId/ban
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "suspended|banned",
  "reason": "Driver violated terms of service",
  "duration": 30
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Driver suspended successfully"
}
```

---

## Restaurant Management Endpoints

### Get All Restaurants
```http
GET /admin/restaurants
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Default: 1
- `limit` (optional): Default: 20
- `status` (optional): active, inactive, pending, suspended
- `search` (optional): Search by name

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "restaurants": [
      {
        "id": "rest_001",
        "name": "Pasta Palace",
        "owner": "Mario Rossi",
        "email": "restaurant@swiftride.com",
        "phone": "+237 700 123 456",
        "cuisine": "Italian",
        "rating": 4.7,
        "totalOrders": 2345,
        "totalRevenue": 567890.50,
        "commissionRate": 10,
        "status": "active",
        "joinedAt": "2025-08-15T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "pages": 8
    }
  }
}
```

### Get Restaurant Details
```http
GET /admin/restaurants/:restaurantId
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": "rest_001",
    "name": "Pasta Palace",
    "owner": "Mario Rossi",
    "email": "restaurant@swiftride.com",
    "phone": "+237 700 123 456",
    "address": "123 Main Street, Douala",
    "city": "Douala",
    "cuisine": "Italian",
    "rating": 4.7,
    "totalOrders": 2345,
    "totalRevenue": 567890.50,
    "commissionRate": 10,
    "status": "active",
    "menuItemsCount": 48,
    "documents": {
      "businessLicense": {
        "verified": true,
        "expiryDate": "2027-06-10"
      },
      "foodSafety": {
        "verified": true,
        "expiryDate": "2026-12-20"
      }
    },
    "bankAccount": {
      "accountNumber": "****5678",
      "bankName": "UBA"
    },
    "recentOrders": [
      {
        "id": "order_001",
        "customer": "Nadine Patricia",
        "items": ["Margherita Pizza", "Garlic Bread"],
        "amount": 35.97,
        "commission": 3.60,
        "status": "delivered",
        "timestamp": "2026-01-20T19:45:00Z"
      }
    ],
    "joinedAt": "2025-08-15T10:00:00Z"
  }
}
```

### Verify Restaurant Documents
```http
POST /admin/restaurants/:restaurantId/verify
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "documents": {
    "businessLicense": true,
    "foodSafety": true
  },
  "notes": "All documents verified"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Restaurant documents verified successfully"
}
```

### Suspend/Ban Restaurant
```http
PUT /admin/restaurants/:restaurantId/ban
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "suspended|banned",
  "reason": "Quality of service issues",
  "duration": 30
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Restaurant suspended successfully"
}
```

---

## Ride Management Endpoints

### Get All Rides
```http
GET /admin/rides
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Default: 1
- `limit` (optional): Default: 20
- `status` (optional): pending, ongoing, completed, cancelled
- `dateFrom` (optional): YYYY-MM-DD
- `dateTo` (optional): YYYY-MM-DD

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "rides": [
      {
        "id": "ride_001",
        "driver": "Alex Rodriguez",
        "passenger": "Nadine Patricia",
        "pickupLocation": "Bonanjo",
        "dropoffLocation": "Douala Port",
        "distance": 8.5,
        "duration": 18,
        "fare": 5000,
        "rating": 5,
        "status": "completed",
        "timestamp": "2026-01-20T15:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 28934,
      "pages": 1447
    }
  }
}
```

### Get Ride Details
```http
GET /admin/rides/:rideId
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": "ride_001",
    "driver": {
      "id": "driver_001",
      "name": "Alex Rodriguez",
      "rating": 4.8
    },
    "passenger": {
      "id": "user_001",
      "name": "Nadine Patricia",
      "rating": 4.9
    },
    "pickupLocation": {
      "address": "Bonanjo, Douala",
      "latitude": 4.0511,
      "longitude": 9.7679,
      "timestamp": "2026-01-20T15:10:00Z"
    },
    "dropoffLocation": {
      "address": "Douala Port, Douala",
      "latitude": 4.0418,
      "longitude": 9.7522,
      "timestamp": "2026-01-20T15:28:00Z"
    },
    "distance": 8.5,
    "duration": 18,
    "fare": 5000,
    "paymentMethod": "wallet",
    "rating": 5,
    "review": "Excellent driver, very professional",
    "status": "completed",
    "createdAt": "2026-01-20T15:10:00Z",
    "completedAt": "2026-01-20T15:28:00Z"
  }
}
```

---

## Order Management Endpoints

### Get All Orders
```http
GET /admin/orders
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Default: 1
- `limit` (optional): Default: 20
- `status` (optional): pending, preparing, ready, out_for_delivery, delivered, cancelled
- `restaurantId` (optional): Filter by restaurant

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "orders": [
      {
        "id": "order_001",
        "customer": "Nadine Patricia",
        "restaurant": "Pasta Palace",
        "items": ["Margherita Pizza × 2", "Garlic Bread"],
        "amount": 35.97,
        "status": "delivered",
        "timestamp": "2026-01-20T19:45:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45821,
      "pages": 2291
    }
  }
}
```

### Get Order Details
```http
GET /admin/orders/:orderId
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": "order_001",
    "customer": {
      "id": "user_001",
      "name": "Nadine Patricia",
      "phone": "+237 650 123 456"
    },
    "restaurant": {
      "id": "rest_001",
      "name": "Pasta Palace"
    },
    "items": [
      {
        "id": "item_001",
        "name": "Margherita Pizza",
        "quantity": 2,
        "price": 12.99,
        "subtotal": 25.98
      },
      {
        "id": "item_002",
        "name": "Garlic Bread",
        "quantity": 1,
        "price": 5.99,
        "subtotal": 5.99
      }
    ],
    "subtotal": 31.97,
    "deliveryFee": 3.99,
    "tax": 0,
    "total": 35.96,
    "deliveryAddress": "Douala, Cameroon",
    "specialInstructions": "No onions please",
    "status": "delivered",
    "paymentMethod": "wallet",
    "createdAt": "2026-01-20T19:45:00Z",
    "deliveredAt": "2026-01-20T20:15:00Z"
  }
}
```

---

## Financial Management Endpoints

### Get Revenue Report
```http
GET /admin/financial/revenue
Authorization: Bearer <token>
```

**Query Parameters:**
- `period` (optional): daily, weekly, monthly, yearly
- `startDate` (optional): YYYY-MM-DD
- `endDate` (optional): YYYY-MM-DD

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "totalRevenue": 1245670.50,
    "ridesRevenue": 847560.75,
    "foodRevenue": 398109.75,
    "breakdown": [
      {
        "date": "2026-01-20",
        "rides": 25000,
        "food": 18500,
        "total": 43500
      }
    ]
  }
}
```

### Get Commission Report
```http
GET /admin/financial/commissions
Authorization: Bearer <token>
```

**Query Parameters:**
- `period` (optional): daily, weekly, monthly
- `status` (optional): pending, paid

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "totalCommissions": 124567.05,
    "pendingCommissions": 45670.25,
    "paidCommissions": 78896.80,
    "byRestaurant": [
      {
        "restaurantId": "rest_001",
        "name": "Pasta Palace",
        "commission": 12456.70,
        "status": "pending"
      }
    ]
  }
}
```

### Process Payout
```http
POST /admin/financial/payouts
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "restaurantId": "rest_001",
  "amount": 12456.70,
  "paymentMethod": "bank_transfer",
  "notes": "Monthly payout"
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "payoutId": "payout_001",
    "amount": 12456.70,
    "restaurant": "Pasta Palace",
    "status": "processed",
    "timestamp": "2026-01-27T12:00:00Z"
  },
  "message": "Payout processed successfully"
}
```

---

## Analytics Endpoints

### Get Analytics
```http
GET /admin/analytics
Authorization: Bearer <token>
```

**Query Parameters:**
- `metric`: users, drivers, restaurants, rides, orders
- `period`: daily, weekly, monthly, yearly

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "metric": "users",
    "period": "monthly",
    "data": [
      {
        "date": "2026-01-01",
        "newUsers": 142,
        "activeUsers": 5320,
        "totalUsers": 5432
      }
    ],
    "summary": {
      "trend": "upward",
      "percentageChange": 8.5
    }
  }
}
```

---

## Support Management Endpoints

### Get Support Tickets
```http
GET /admin/support/tickets
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): open, resolved, closed

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "tickets": [
      {
        "id": "ticket_001",
        "subject": "Driver not found",
        "category": "ride_issue",
        "priority": "high",
        "status": "open",
        "userId": "user_001",
        "createdAt": "2026-01-27T10:00:00Z"
      }
    ]
  }
}
```

### Resolve Ticket
```http
PUT /admin/support/tickets/:ticketId
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "resolved",
  "resolution": "Refund issued to customer",
  "notes": "Driver issue resolved"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Ticket resolved successfully"
}
```

