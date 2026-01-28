# Users (Customers) API Documentation

## Base URL
```
GET/POST http://localhost:3000/api/users
```

## Authentication
User endpoints support both authenticated and unauthenticated requests where applicable.

---

## Authentication Endpoints

### User Signup
```http
POST /users/auth/signup
```

**Request Body:**
```json
{
  "firstName": "Nadine",
  "lastName": "Patricia",
  "email": "nadine@email.com",
  "phone": "+237 650 123 456",
  "password": "securepassword123",
  "confirmPassword": "securepassword123",
  "acceptTerms": true
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "userId": "user_001",
    "email": "nadine@email.com",
    "name": "Nadine Patricia"
  },
  "message": "Signup successful. Please verify your email."
}
```

### User Login
```http
POST /users/auth/login
```

**Request Body:**
```json
{
  "email": "nadine@email.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_001",
      "email": "nadine@email.com",
      "name": "Nadine Patricia",
      "phone": "+237 650 123 456"
    }
  },
  "message": "Login successful"
}
```

### User Logout
```http
POST /users/auth/logout
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Logout successful"
}
```

### Forgot Password
```http
POST /users/auth/forgot-password
```

**Request Body:**
```json
{
  "email": "nadine@email.com"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Password reset link sent to your email"
}
```

### Reset Password
```http
POST /users/auth/reset-password/:token
```

**Request Body:**
```json
{
  "password": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Password reset successful"
}
```

### Verify Email
```http
POST /users/auth/verify-email/:token
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Email verified successfully"
}
```

---

## Profile Endpoints

### Get User Profile
```http
GET /users/profile
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": "user_001",
    "firstName": "Nadine",
    "lastName": "Patricia",
    "email": "nadine@email.com",
    "phone": "+237 650 123 456",
    "profilePhoto": "https://...",
    "joinedDate": "2025-06-10T10:00:00Z",
    "accountStatus": "verified",
    "totalRides": 245,
    "totalOrders": 456,
    "averageRating": 4.8
  }
}
```

### Update User Profile
```http
PUT /users/profile
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "Nadine",
  "lastName": "Patricia",
  "phone": "+237 650 123 456",
  "profilePhoto": "base64_image_data",
  "dateOfBirth": "1990-05-15"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Profile updated successfully"
}
```

### Change Password
```http
PUT /users/profile/password
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Password changed successfully"
}
```

---

## Address Management Endpoints

### Get Saved Addresses
```http
GET /users/addresses
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "addresses": [
      {
        "id": "addr_001",
        "label": "Home",
        "street": "123 Rue de la Liberté",
        "city": "Douala",
        "postalCode": "2700",
        "latitude": 4.0511,
        "longitude": 9.7679,
        "isDefault": true,
        "instructions": "Gate on the left side"
      },
      {
        "id": "addr_002",
        "label": "Office",
        "street": "456 Business Avenue",
        "city": "Douala",
        "postalCode": "2700",
        "latitude": 4.0418,
        "longitude": 9.7522,
        "isDefault": false
      }
    ]
  }
}
```

### Add New Address
```http
POST /users/addresses
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "label": "Home",
  "street": "123 Rue de la Liberté",
  "city": "Douala",
  "postalCode": "2700",
  "latitude": 4.0511,
  "longitude": 9.7679,
  "instructions": "Gate on the left side",
  "isDefault": true
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "id": "addr_001",
    "label": "Home"
  },
  "message": "Address added successfully"
}
```

### Update Address
```http
PUT /users/addresses/:addressId
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "label": "Home",
  "street": "123 New Street",
  "city": "Douala",
  "instructions": "Gate on the right side"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Address updated successfully"
}
```

### Delete Address
```http
DELETE /users/addresses/:addressId
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Address deleted successfully"
}
```

### Set Default Address
```http
POST /users/addresses/:addressId/set-default
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Default address updated"
}
```

---

## Ride Booking Endpoints

### Search Available Rides
```http
GET /users/rides/search
Authorization: Bearer <token>
```

**Query Parameters:**
- `pickupLatitude` (required): Pickup latitude
- `pickupLongitude` (required): Pickup longitude
- `dropoffLatitude` (required): Dropoff latitude
- `dropoffLongitude` (required): Dropoff longitude

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "distance": 8.5,
    "estimatedDuration": 18,
    "pricing": {
      "baseFare": 1000,
      "perKmRate": 300,
      "surgeMultiplier": 1,
      "estimatedFare": 3550
    },
    "availableRides": [
      {
        "type": "standard",
        "name": "SwiftRide Classic",
        "basePrice": 3550,
        "icon": "taxi"
      },
      {
        "type": "premium",
        "name": "SwiftRide Premium",
        "basePrice": 5325,
        "icon": "star"
      }
    ]
  }
}
```

### Book Ride
```http
POST /users/rides/book
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "rideType": "standard",
  "pickupLatitude": 4.0511,
  "pickupLongitude": 9.7679,
  "pickupAddress": "Bonanjo, Douala",
  "dropoffLatitude": 4.0418,
  "dropoffLongitude": 9.7522,
  "dropoffAddress": "Douala Port, Douala",
  "paymentMethod": "card",
  "scheduledTime": "2026-01-27T13:00:00Z",
  "specialRequests": "Please call when arriving"
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "rideId": "ride_001",
    "status": "searching",
    "estimatedFare": 3550,
    "estimatedPickupTime": 3,
    "rideType": "standard"
  },
  "message": "Ride request submitted. Finding driver..."
}
```

### Get Active Ride Details
```http
GET /users/rides/active
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "rideId": "ride_001",
    "status": "in_progress",
    "rideType": "standard",
    "driver": {
      "name": "Alex Rodriguez",
      "rating": 4.8,
      "profilePhoto": "https://...",
      "phone": "+237 600 123 456",
      "vehicleMake": "Toyota",
      "vehicleModel": "Camry",
      "licensePlate": "ABC 123"
    },
    "currentLocation": {
      "latitude": 4.0511,
      "longitude": 9.7679
    },
    "pickupLocation": {
      "address": "Bonanjo, Douala",
      "latitude": 4.0511,
      "longitude": 9.7679
    },
    "dropoffLocation": {
      "address": "Douala Port, Douala",
      "latitude": 4.0418,
      "longitude": 9.7522
    },
    "distance": 8.5,
    "estimatedArrival": 5,
    "fare": 3550,
    "pickupStatus": "arrived"
  }
}
```

### Rate Ride
```http
POST /users/rides/:rideId/rate
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "rating": 5,
  "review": "Excellent driver, very professional",
  "tips": 500,
  "categories": {
    "cleanliness": 5,
    "driving": 5,
    "communication": 4
  }
}
```

**Response (201):**
```json
{
  "status": "success",
  "message": "Rating submitted successfully"
}
```

### Cancel Ride
```http
POST /users/rides/:rideId/cancel
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "reason": "Driver is taking too long"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Ride cancelled successfully"
}
```

### Get Ride History
```http
GET /users/rides/history
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Default: 1
- `limit` (optional): Default: 20
- `status` (optional): completed, cancelled

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "rides": [
      {
        "id": "ride_001",
        "rideType": "standard",
        "driver": "Alex Rodriguez",
        "pickupLocation": "Bonanjo",
        "dropoffLocation": "Douala Port",
        "distance": 8.5,
        "duration": 18,
        "fare": 3550,
        "tips": 500,
        "rating": 5,
        "status": "completed",
        "timestamp": "2026-01-20T15:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 245,
      "pages": 13
    }
  }
}
```

### Get Ride Receipt
```http
GET /users/rides/:rideId/receipt
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "rideId": "ride_001",
    "rideType": "Standard",
    "driver": "Alex Rodriguez",
    "driverRating": 4.8,
    "vehicle": "Toyota Camry (ABC 123)",
    "date": "2026-01-20",
    "time": "15:30",
    "pickupLocation": "Bonanjo, Douala",
    "dropoffLocation": "Douala Port, Douala",
    "distance": 8.5,
    "duration": "18 minutes",
    "fareBreakdown": {
      "baseFare": 1000,
      "distanceFare": 2550,
      "surgeCharges": 0,
      "subtotal": 3550,
      "platformFee": 0,
      "tips": 500,
      "total": 4050
    },
    "paymentMethod": "Card",
    "status": "completed"
  }
}
```

---

## Food Ordering Endpoints

### Get Restaurants
```http
GET /users/restaurants
Authorization: Bearer <token>
```

**Query Parameters:**
- `latitude` (optional): User latitude for nearby restaurants
- `longitude` (optional): User longitude for nearby restaurants
- `search` (optional): Search restaurant name
- `cuisineType` (optional): Filter by cuisine
- `page` (optional): Default: 1
- `limit` (optional): Default: 20

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "restaurants": [
      {
        "id": "rest_001",
        "name": "Le Gourmet Cafe",
        "cuisineType": "French",
        "rating": 4.6,
        "reviewCount": 456,
        "logo": "https://...",
        "coverPhoto": "https://...",
        "minOrder": 2000,
        "deliveryTime": "30-45 mins",
        "deliveryFee": 1000,
        "distance": 2.5,
        "isOpen": true,
        "popularItems": 3
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 245,
      "pages": 13
    }
  }
}
```

### Get Restaurant Details
```http
GET /users/restaurants/:restaurantId
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
    "rating": 4.6,
    "reviewCount": 456,
    "logo": "https://...",
    "coverPhoto": "https://...",
    "phone": "+237 650 123 456",
    "address": "123 Boulevard de la Liberté, Douala",
    "minOrder": 2000,
    "deliveryTime": "30-45 mins",
    "deliveryFee": 1000,
    "distance": 2.5,
    "isOpen": true,
    "operatingHours": {
      "monday": {"open": "09:00", "close": "22:00"},
      "tuesday": {"open": "09:00", "close": "22:00"}
    },
    "menu": [
      {
        "categoryId": "cat_001",
        "categoryName": "Appetizers",
        "items": [
          {
            "id": "item_001",
            "name": "French Onion Soup",
            "description": "Classic French onion soup with melted cheese",
            "price": 3500,
            "image": "https://...",
            "preparationTime": 10,
            "vegetarian": true,
            "spicy": false
          }
        ]
      }
    ]
  }
}
```

### Get Menu Items
```http
GET /users/restaurants/:restaurantId/menu
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
        "image": "https://...",
        "preparationTime": 10,
        "rating": 4.8,
        "reviewCount": 123,
        "vegetarian": true,
        "spicy": false
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

### Add Item to Cart
```http
POST /users/cart/items
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "restaurantId": "rest_001",
  "itemId": "item_001",
  "quantity": 2,
  "specialInstructions": "Extra cheese, no onions"
}
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "cartId": "cart_001",
    "itemCount": 3,
    "subtotal": 8500
  },
  "message": "Item added to cart"
}
```

### Get Cart
```http
GET /users/cart
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "cartId": "cart_001",
    "restaurantId": "rest_001",
    "restaurantName": "Le Gourmet Cafe",
    "items": [
      {
        "itemId": "item_001",
        "name": "French Onion Soup",
        "quantity": 2,
        "price": 3500,
        "subtotal": 7000,
        "specialInstructions": "Extra cheese, no onions"
      }
    ],
    "subtotal": 7000,
    "deliveryFee": 1000,
    "tax": 350,
    "total": 8350,
    "minOrderMet": true
  }
}
```

### Update Cart Item
```http
PUT /users/cart/items/:itemId
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "quantity": 3,
  "specialInstructions": "Extra cheese"
}
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "cartId": "cart_001",
    "itemCount": 4,
    "subtotal": 10500
  }
}
```

### Remove Item from Cart
```http
DELETE /users/cart/items/:itemId
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Item removed from cart"
}
```

### Clear Cart
```http
DELETE /users/cart
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Cart cleared successfully"
}
```

### Place Food Order
```http
POST /users/orders
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "cartId": "cart_001",
  "restaurantId": "rest_001",
  "deliveryAddressId": "addr_001",
  "paymentMethod": "card",
  "specialInstructions": "Deliver to reception desk",
  "tips": 500
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "orderId": "order_001",
    "orderNumber": "ORD-20260127-001",
    "status": "confirmed",
    "estimatedDelivery": "40-55 mins",
    "total": 8850
  },
  "message": "Order placed successfully"
}
```

### Get Active Orders
```http
GET /users/orders/active
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
        "restaurant": "Le Gourmet Cafe",
        "items": 3,
        "total": 8350,
        "status": "preparing",
        "estimatedDelivery": "2026-01-27T13:40:00Z",
        "orderedAt": "2026-01-27T12:50:00Z"
      }
    ]
  }
}
```

### Get Order History
```http
GET /users/orders/history
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Default: 1
- `limit` (optional): Default: 20
- `status` (optional): completed, cancelled

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "orders": [
      {
        "id": "order_001",
        "orderNumber": "ORD-20260127-001",
        "restaurant": "Le Gourmet Cafe",
        "items": 3,
        "total": 8350,
        "status": "completed",
        "rating": 4.5,
        "timestamp": "2026-01-20T13:40:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 456,
      "pages": 23
    }
  }
}
```

### Get Order Details
```http
GET /users/orders/:orderId
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": "order_001",
    "orderNumber": "ORD-20260127-001",
    "restaurant": {
      "id": "rest_001",
      "name": "Le Gourmet Cafe",
      "rating": 4.6
    },
    "items": [
      {
        "itemId": "item_001",
        "name": "French Onion Soup",
        "quantity": 2,
        "price": 3500,
        "subtotal": 7000
      }
    ],
    "deliveryAddress": "123 Rue de la Liberté, Douala",
    "subtotal": 7000,
    "deliveryFee": 1000,
    "tax": 350,
    "tips": 500,
    "total": 8850,
    "status": "delivered",
    "timeline": {
      "orderedAt": "2026-01-20T12:50:00Z",
      "acceptedAt": "2026-01-20T12:55:00Z",
      "readyAt": "2026-01-20T13:20:00Z",
      "deliveredAt": "2026-01-20T13:40:00Z"
    },
    "rating": 4.5,
    "review": "Food was delicious and delivered on time"
  }
}
```

### Rate Order
```http
POST /users/orders/:orderId/rate
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "rating": 5,
  "review": "Excellent food and fast delivery",
  "categories": {
    "foodQuality": 5,
    "packaging": 4,
    "delivery": 5
  }
}
```

**Response (201):**
```json
{
  "status": "success",
  "message": "Rating submitted successfully"
}
```

### Cancel Order
```http
POST /users/orders/:orderId/cancel
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "reason": "Change of plans"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Order cancelled successfully"
}
```

---

## Favorites Endpoints

### Get Favorite Restaurants
```http
GET /users/favorites/restaurants
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "restaurants": [
      {
        "id": "rest_001",
        "name": "Le Gourmet Cafe",
        "cuisineType": "French",
        "rating": 4.6,
        "logo": "https://..."
      }
    ]
  }
}
```

### Add Favorite Restaurant
```http
POST /users/favorites/restaurants/:restaurantId
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Restaurant added to favorites"
}
```

### Remove Favorite Restaurant
```http
DELETE /users/favorites/restaurants/:restaurantId
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Restaurant removed from favorites"
}
```

### Get Favorite Locations
```http
GET /users/favorites/locations
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "locations": [
      {
        "id": "loc_001",
        "label": "Work",
        "address": "456 Business Avenue",
        "latitude": 4.0418,
        "longitude": 9.7522
      }
    ]
  }
}
```

### Add Favorite Location
```http
POST /users/favorites/locations
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "label": "Work",
  "address": "456 Business Avenue",
  "latitude": 4.0418,
  "longitude": 9.7522
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "id": "loc_001"
  }
}
```

---

## Payment Methods Endpoints

### Get Payment Methods
```http
GET /users/payment-methods
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "paymentMethods": [
      {
        "id": "card_001",
        "type": "card",
        "brand": "Visa",
        "lastFour": "4242",
        "expiryMonth": 12,
        "expiryYear": 2028,
        "isDefault": true
      },
      {
        "id": "momo_001",
        "type": "mobile_money",
        "provider": "Orange Money",
        "phone": "+237 650 123 456",
        "isDefault": false
      }
    ],
    "wallet": {
      "balance": 5000,
      "currency": "XAF"
    }
  }
}
```

### Add Payment Method
```http
POST /users/payment-methods
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "type": "card",
  "cardNumber": "4242424242424242",
  "expiryMonth": 12,
  "expiryYear": 2028,
  "cvv": "123",
  "cardholderName": "Nadine Patricia",
  "isDefault": false
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "id": "card_001",
    "brand": "Visa",
    "lastFour": "4242"
  },
  "message": "Payment method added successfully"
}
```

### Update Payment Method
```http
PUT /users/payment-methods/:paymentMethodId
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "isDefault": true
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Payment method updated successfully"
}
```

### Delete Payment Method
```http
DELETE /users/payment-methods/:paymentMethodId
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Payment method deleted successfully"
}
```

---

## Wallet Endpoints

### Get Wallet Balance
```http
GET /users/wallet
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "balance": 15000,
    "currency": "XAF",
    "lastUpdated": "2026-01-27T12:00:00Z"
  }
}
```

### Add Funds to Wallet
```http
POST /users/wallet/add-funds
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "amount": 10000,
  "paymentMethodId": "card_001"
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "transactionId": "txn_001",
    "amount": 10000,
    "newBalance": 25000,
    "status": "completed"
  },
  "message": "Funds added to wallet"
}
```

### Get Wallet Transaction History
```http
GET /users/wallet/transactions
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Default: 1
- `limit` (optional): Default: 20

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "transactions": [
      {
        "id": "txn_001",
        "type": "ride",
        "description": "Ride to Douala Port",
        "amount": 3550,
        "timestamp": "2026-01-20T15:30:00Z",
        "status": "completed"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 234,
      "pages": 12
    }
  }
}
```

---

## Support Endpoints

### Submit Support Ticket
```http
POST /users/support/tickets
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "subject": "Driver didn't arrive",
  "category": "ride_issue",
  "priority": "high",
  "description": "The driver cancelled after 10 minutes",
  "orderId": "ride_001",
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
GET /users/support/tickets
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
        "subject": "Driver didn't arrive",
        "status": "open",
        "priority": "high",
        "createdAt": "2026-01-27T12:00:00Z"
      }
    ]
  }
}
```

---

## Preferences & Settings Endpoints

### Get User Preferences
```http
GET /users/preferences
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "notifications": {
      "rideUpdates": true,
      "orderUpdates": true,
      "promotionalOffers": true,
      "weeklyDeals": false
    },
    "preferences": {
      "language": "en",
      "currency": "XAF",
      "timezone": "UTC+1"
    },
    "privacySettings": {
      "profileVisibility": "public",
      "shareLocation": true,
      "showReviews": true
    }
  }
}
```

### Update User Preferences
```http
PUT /users/preferences
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "notifications": {
    "rideUpdates": true,
    "orderUpdates": true
  },
  "preferences": {
    "language": "en"
  }
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Preferences updated successfully"
}
```

