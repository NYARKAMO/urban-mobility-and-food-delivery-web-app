# Driver API Documentation

## Base URL
```
GET/POST http://localhost:3000/api/drivers
```

## Authentication
All driver endpoints require JWT authentication with driver role.

---

## Authentication Endpoints

### Driver Registration
```http
POST /drivers/auth/register
```

**Request Body:**
```json
{
  "firstName": "Alex",
  "lastName": "Rodriguez",
  "email": "driver@swiftride.com",
  "phone": "+237 600 123 456",
  "password": "securepassword123",
  "vehicleType": "car",
  "vehicleMake": "Toyota",
  "vehicleModel": "Camry",
  "vehicleYear": 2020,
  "licensePlate": "ABC 123"
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "driverId": "driver_001",
    "email": "driver@swiftride.com",
    "name": "Alex Rodriguez"
  },
  "message": "Registration successful. Please verify your documents."
}
```

### Driver Login
```http
POST /drivers/auth/login
```

**Request Body:**
```json
{
  "email": "driver@swiftride.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "driver": {
      "id": "driver_001",
      "email": "driver@swiftride.com",
      "name": "Alex Rodriguez",
      "status": "active"
    }
  },
  "message": "Login successful"
}
```

### Driver Logout
```http
POST /drivers/auth/logout
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

### Get Driver Dashboard
```http
GET /drivers/dashboard
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "driverId": "driver_001",
    "name": "Alex Rodriguez",
    "status": "online",
    "rating": 4.8,
    "totalRides": 456,
    "totalEarnings": 2345670.50,
    "todaysEarnings": 5200,
    "todaysRides": 12,
    "recentRides": [
      {
        "id": "ride_001",
        "passenger": "Nadine Patricia",
        "pickupLocation": "Bonanjo",
        "dropoffLocation": "Douala Port",
        "rideType": "standard",
        "vehicleType": "car",
        "distance": 8.5,
        "duration": 18,
        "fare": 5000,
        "rating": 5,
        "status": "completed",
        "timestamp": "2026-01-20T15:30:00Z"
      }
    ],
    "stats": {
      "acceptanceRate": 96.5,
      "cancellationRate": 2.1,
      "averageRating": 4.8,
      "completedRides": 456,
      "totalHours": 1245
    }
  }
}
```

---

## Profile Endpoints

### Get Driver Profile
```http
GET /drivers/profile
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": "driver_001",
    "firstName": "Alex",
    "lastName": "Rodriguez",
    "email": "driver@swiftride.com",
    "phone": "+237 600 123 456",
    "vehicleType": "car",
    "profilePhoto": "https://...",
    "address": "Douala, Cameroon",
    "joinedDate": "2025-06-10T10:00:00Z",
    "rating": 4.8,
    "totalRides": 456,
    "status": "active"
  }
}
```

### Update Driver Profile
```http
PUT /drivers/profile
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "Alex",
  "lastName": "Rodriguez",
  "phone": "+237 600 123 456",
  "address": "New Address, Douala",
  "profilePhoto": "base64_image_data"
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
PUT /drivers/profile/password
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

## Vehicle Management Endpoints

### Get Vehicle Details
```http
GET /drivers/vehicle
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": "vehicle_001",
    "type": "car",
    "make": "Toyota",
    "model": "Camry",
    "year": 2020,
    "licensePlate": "ABC 123",
    "vin": "ABC123456789",
    "color": "White",
    "seats": 4,
    "insurance": {
      "policyNumber": "INS123456",
      "expiryDate": "2027-06-10",
      "verified": true
    },
    "registration": {
      "expiryDate": "2027-06-10",
      "verified": true
    }
  }
}
```

### Update Vehicle Details
```http
PUT /drivers/vehicle
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "type": "car",
  "make": "Toyota",
  "model": "Camry",
  "year": 2020,
  "licensePlate": "ABC 123",
  "vin": "ABC123456789",
  "color": "White",
  "seats": 4
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Vehicle details updated successfully"
}
```

### Upload Vehicle Documents
```http
POST /drivers/vehicle/documents
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `documentType`: registration, insurance, inspection
- `file`: Binary file data

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "documentId": "doc_001",
    "type": "registration",
    "uploadedAt": "2026-01-27T12:00:00Z",
    "status": "pending_verification"
  },
  "message": "Document uploaded successfully"
}
```

---

## Ride Management Endpoints

### Get Available Rides
```http
GET /drivers/rides/available
Authorization: Bearer <token>
```

**Query Parameters:**
- `latitude` (required): Current latitude
- `longitude` (required): Current longitude
- `radius` (optional): Search radius in km (Default: 5)

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "availableRides": [
      {
        "id": "ride_req_001",
        "passenger": {
          "name": "Nadine Patricia",
          "rating": 4.9,
          "profilePhoto": "https://..."
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
        "estimatedFare": 5000,
        "requestedAt": "2026-01-27T12:00:00Z",
        "expiresAt": "2026-01-27T12:05:00Z"
      }
    ]
  }
}
```

### Accept Ride
```http
POST /drivers/rides/accept
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "rideId": "ride_req_001"
}
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "rideId": "ride_001",
    "passenger": {
      "name": "Nadine Patricia",
      "phone": "+237 650 123 456",
      "rating": 4.9
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
    "fare": 5000,
    "status": "accepted"
  },
  "message": "Ride accepted successfully"
}
```

### Get Active Ride Details
```http
GET /drivers/rides/active
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "rideId": "ride_001",
    "passenger": {
      "name": "Nadine Patricia",
      "phone": "+237 650 123 456",
      "rating": 4.9,
      "profilePhoto": "https://..."
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
    "currentLocation": {
      "latitude": 4.0511,
      "longitude": 9.7679,
      "timestamp": "2026-01-27T12:00:00Z"
    },
    "distance": 8.5,
    "fare": 5000,
    "status": "in_progress",
    "pickupStatus": "arrived"
  }
}
```

### Update Location
```http
POST /drivers/location/update
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "latitude": 4.0511,
  "longitude": 9.7679
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Location updated successfully"
}
```

### Complete Ride
```http
POST /drivers/rides/:rideId/complete
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "dropoffLatitude": 4.0418,
  "dropoffLongitude": 9.7522,
  "actualFare": 5000
}
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "rideId": "ride_001",
    "fare": 5000,
    "earnings": 4000,
    "platformFee": 1000,
    "status": "completed"
  },
  "message": "Ride completed successfully"
}
```

### Cancel Ride
```http
POST /drivers/rides/:rideId/cancel
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "reason": "Passenger didn't show up"
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
GET /drivers/rides/history
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
        "vehicleType": "car",
        "passenger": "Nadine Patricia",
        "pickupLocation": "Bonanjo",
        "dropoffLocation": "Douala Port",
        "distance": 8.5,
        "duration": 18,
        "fare": 5000,
        "earnings": 4000,
        "rating": 5,
        "status": "completed",
        "timestamp": "2026-01-20T15:30:00Z"
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

---

## Earnings Endpoints

### Get Earnings Summary
```http
GET /drivers/earnings/summary
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
    "totalEarnings": 2345670.50,
    "thisMonth": 145600.75,
    "thisWeek": 32450.50,
    "today": 5200,
    "ridesFare": 142300,
    "bonuses": 3300.75,
    "breakdown": {
      "completedRides": 456,
      "averagePerRide": 312.28,
      "totalHours": 98,
      "averagePerHour": 1485.71
    }
  }
}
```

### Get Earnings Details
```http
GET /drivers/earnings/details
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
    "earnings": [
      {
        "rideId": "ride_001",
        "date": "2026-01-20",
        "fare": 5000,
        "platformFee": 1000,
        "earnings": 4000,
        "passenger": "Nadine Patricia",
        "status": "completed"
      }
    ]
  }
}
```

### Get Payouts
```http
GET /drivers/payouts
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
        "amount": 45670.25,
        "status": "pending",
        "requestedAt": "2026-01-20T10:00:00Z",
        "expectedDate": "2026-01-27T00:00:00Z"
      }
    ],
    "bankDetails": {
      "accountNumber": "****1234",
      "bankName": "Standard Chartered",
      "accountHolder": "Alex Rodriguez"
    }
  }
}
```

### Request Payout
```http
POST /drivers/payouts/request
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "amount": 45670.25
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "payoutId": "payout_002",
    "amount": 45670.25,
    "status": "pending",
    "expectedDate": "2026-02-03T00:00:00Z"
  },
  "message": "Payout request submitted successfully"
}
```

---

## Rating Endpoints

### Get Driver Ratings
```http
GET /drivers/ratings
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "averageRating": 4.8,
    "totalReviews": 456,
    "ratingDistribution": {
      "5: 380,
      "4": 60,
      "3": 12,
      "2": 3,
      "1": 1
    },
    "recentReviews": [
      {
        "rideId": "ride_001",
        "passenger": "Nadine Patricia",
        "rating": 5,
        "review": "Excellent driver, very professional",
        "date": "2026-01-20T15:30:00Z"
      }
    ]
  }
}
```

---

## Status Management Endpoints

### Toggle Online Status
```http
POST /drivers/status/toggle
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "online|offline"
}
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "currentStatus": "online"
  },
  "message": "Status updated successfully"
}
```

### Set Availability
```http
POST /drivers/availability
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "available": true,
  "reason": "On break"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Availability updated successfully"
}
```

---

## Support Endpoints

### Submit Support Ticket
```http
POST /drivers/support/tickets
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "subject": "App is crashing",
  "category": "technical_issue",
  "priority": "high",
  "description": "The app crashes when accepting rides",
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
GET /drivers/support/tickets
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
        "subject": "App is crashing",
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

### Get Driver Settings
```http
GET /drivers/settings
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "notifications": {
      "newRides": true,
      "rideUpdates": true,
      "promotionalOffers": true,
      "weeklyReports": false
    },
    "preferences": {
      "language": "en",
      "currency": "XAF",
      "timezone": "UTC+1"
    },
    "privacySettings": {
      "profileVisibility": "public",
      "shareLocation": true
    }
  }
}
```

### Update Driver Settings
```http
PUT /drivers/settings
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "notifications": {
    "newRides": true,
    "rideUpdates": true
  },
  "preferences": {
    "language": "en",
    "currency": "XAF"
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

