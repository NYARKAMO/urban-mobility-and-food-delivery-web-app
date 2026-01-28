# SwiftRide Database Schema

## Overview
This document outlines the complete database schema for the SwiftRide platform, including all tables, columns, data types, constraints, and relationships.

---

## Core Tables

### 1. Users (Customers)
Stores customer/user account information.

```sql
CREATE TABLE users (
  id VARCHAR(50) PRIMARY KEY,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  profilePhoto VARCHAR(500),
  dateOfBirth DATE,
  address VARCHAR(255),
  city VARCHAR(50),
  postalCode VARCHAR(20),
  accountStatus ENUM('active', 'suspended', 'deleted') DEFAULT 'active',
  emailVerified BOOLEAN DEFAULT false,
  phoneVerified BOOLEAN DEFAULT false,
  totalRides INT DEFAULT 0,
  totalOrders INT DEFAULT 0,
  averageRating DECIMAL(3,2),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  lastLogin TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_phone (phone),
  INDEX idx_accountStatus (accountStatus)
);
```

### 2. Drivers
Stores driver account and vehicle information.

```sql
CREATE TABLE drivers (
  id VARCHAR(50) PRIMARY KEY,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  profilePhoto VARCHAR(500),
  address VARCHAR(255),
  city VARCHAR(50),
  accountStatus ENUM('pending', 'active', 'suspended', 'banned', 'deleted') DEFAULT 'pending',
  isOnline BOOLEAN DEFAULT false,
  isAvailable BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0,
  totalRides INT DEFAULT 0,
  totalEarnings DECIMAL(15,2) DEFAULT 0,
  bankAccountNumber VARCHAR(50),
  bankName VARCHAR(100),
  bankSwiftCode VARCHAR(20),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  lastLogin TIMESTAMP,
  documentVerificationDate TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_status (accountStatus),
  INDEX idx_isAvailable (isAvailable)
);
```

### 3. Vehicles
Stores driver vehicle information.

```sql
CREATE TABLE vehicles (
  id VARCHAR(50) PRIMARY KEY,
  driverId VARCHAR(50) NOT NULL,
  type ENUM('car', 'bike') NOT NULL,
  make VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  year INT NOT NULL,
  color VARCHAR(50),
  licensePlate VARCHAR(20) UNIQUE NOT NULL,
  vin VARCHAR(50),
  seats INT DEFAULT 4,
  registrationExpiry DATE,
  insuranceExpiry DATE,
  registrationVerified BOOLEAN DEFAULT false,
  insuranceVerified BOOLEAN DEFAULT false,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (driverId) REFERENCES drivers(id) ON DELETE CASCADE,
  INDEX idx_driverId (driverId),
  INDEX idx_licensePlate (licensePlate)
);
```

### 4. Restaurants
Stores restaurant business information.

```sql
CREATE TABLE restaurants (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  cuisineType VARCHAR(50),
  ownerFirstName VARCHAR(100) NOT NULL,
  ownerLastName VARCHAR(100) NOT NULL,
  ownerEmail VARCHAR(100) UNIQUE NOT NULL,
  ownerPhone VARCHAR(20) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(50) NOT NULL,
  postalCode VARCHAR(20),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  deliveryRadius INT DEFAULT 5,
  minOrderValue DECIMAL(10,2) DEFAULT 0,
  accountStatus ENUM('pending', 'active', 'suspended', 'banned', 'deleted') DEFAULT 'pending',
  logo VARCHAR(500),
  coverPhoto VARCHAR(500),
  rating DECIMAL(3,2) DEFAULT 0,
  totalOrders INT DEFAULT 0,
  totalEarnings DECIMAL(15,2) DEFAULT 0,
  bankAccountNumber VARCHAR(50),
  bankName VARCHAR(100),
  bankSwiftCode VARCHAR(20),
  commissionRate DECIMAL(5,2) DEFAULT 10,
  isOpen BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_status (accountStatus),
  INDEX idx_cuisineType (cuisineType),
  SPATIAL INDEX idx_location (latitude, longitude)
);
```

### 5. Restaurant Operating Hours
Stores restaurant opening/closing times by day.

```sql
CREATE TABLE restaurantOperatingHours (
  id VARCHAR(50) PRIMARY KEY,
  restaurantId VARCHAR(50) NOT NULL,
  dayOfWeek ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday') NOT NULL,
  openTime TIME NOT NULL,
  closeTime TIME NOT NULL,
  isClosed BOOLEAN DEFAULT false,
  FOREIGN KEY (restaurantId) REFERENCES restaurants(id) ON DELETE CASCADE,
  UNIQUE KEY unique_restaurant_day (restaurantId, dayOfWeek),
  INDEX idx_restaurantId (restaurantId)
);
```

### 6. Menu Categories
Stores food menu categories for restaurants.

```sql
CREATE TABLE menuCategories (
  id VARCHAR(50) PRIMARY KEY,
  restaurantId VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  displayOrder INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurantId) REFERENCES restaurants(id) ON DELETE CASCADE,
  INDEX idx_restaurantId (restaurantId)
);
```

### 7. Menu Items
Stores individual food items for restaurants.

```sql
CREATE TABLE menuItems (
  id VARCHAR(50) PRIMARY KEY,
  restaurantId VARCHAR(50) NOT NULL,
  categoryId VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image VARCHAR(500),
  preparationTime INT,
  isAvailable BOOLEAN DEFAULT true,
  isVegetarian BOOLEAN DEFAULT false,
  isVegan BOOLEAN DEFAULT false,
  isSpicy BOOLEAN DEFAULT false,
  calories INT,
  portions INT DEFAULT 1,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurantId) REFERENCES restaurants(id) ON DELETE CASCADE,
  FOREIGN KEY (categoryId) REFERENCES menuCategories(id) ON DELETE CASCADE,
  INDEX idx_restaurantId (restaurantId),
  INDEX idx_categoryId (categoryId),
  INDEX idx_isAvailable (isAvailable)
);
```

### 8. User Addresses
Stores saved delivery addresses for customers.

```sql
CREATE TABLE userAddresses (
  id VARCHAR(50) PRIMARY KEY,
  userId VARCHAR(50) NOT NULL,
  label VARCHAR(50),
  street VARCHAR(255) NOT NULL,
  city VARCHAR(50) NOT NULL,
  postalCode VARCHAR(20),
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  instructions TEXT,
  isDefault BOOLEAN DEFAULT false,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_isDefault (isDefault),
  SPATIAL INDEX idx_location (latitude, longitude)
);
```

---

## Ride Management Tables

### 9. Rides
Stores ride booking information.

```sql
CREATE TABLE rides (
  id VARCHAR(50) PRIMARY KEY,
  rideNumber VARCHAR(20) UNIQUE NOT NULL,
  userId VARCHAR(50) NOT NULL,
  driverId VARCHAR(50),
  rideType ENUM('standard', 'premium') NOT NULL,
  vehicleType ENUM('car', 'bike') NOT NULL,
  pickupLatitude DECIMAL(10,8) NOT NULL,
  pickupLongitude DECIMAL(11,8) NOT NULL,
  pickupAddress VARCHAR(255) NOT NULL,
  dropoffLatitude DECIMAL(10,8) NOT NULL,
  dropoffLongitude DECIMAL(11,8) NOT NULL,
  dropoffAddress VARCHAR(255) NOT NULL,
  distance DECIMAL(8,2),
  estimatedDuration INT,
  actualDuration INT,
  baseFare DECIMAL(10,2),
  distanceFare DECIMAL(10,2),
  surgeFare DECIMAL(10,2) DEFAULT 0,
  totalFare DECIMAL(10,2) NOT NULL,
  platformFee DECIMAL(10,2),
  tips DECIMAL(10,2) DEFAULT 0,
  paymentMethod ENUM('card', 'wallet', 'cash') NOT NULL,
  status ENUM('pending', 'searching', 'accepted', 'arrived', 'in_progress', 'completed', 'cancelled') NOT NULL,
  cancellationReason VARCHAR(255),
  cancelledBy ENUM('user', 'driver', 'system'),
  specialRequests TEXT,
  scheduledTime TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  acceptedAt TIMESTAMP,
  arrivedAt TIMESTAMP,
  startedAt TIMESTAMP,
  completedAt TIMESTAMP,
  cancelledAt TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (driverId) REFERENCES drivers(id) ON DELETE SET NULL,
  INDEX idx_userId (userId),
  INDEX idx_driverId (driverId),
  INDEX idx_status (status),
  INDEX idx_createdAt (createdAt),
  SPATIAL INDEX idx_pickupLocation (pickupLatitude, pickupLongitude)
);
```

### 10. Ride Tracking
Stores real-time driver location during rides.

```sql
CREATE TABLE rideTracking (
  id VARCHAR(50) PRIMARY KEY,
  rideId VARCHAR(50) NOT NULL,
  driverId VARCHAR(50) NOT NULL,
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  speed DECIMAL(5,2),
  heading INT,
  accuracy DECIMAL(5,2),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (rideId) REFERENCES rides(id) ON DELETE CASCADE,
  FOREIGN KEY (driverId) REFERENCES drivers(id) ON DELETE CASCADE,
  INDEX idx_rideId (rideId),
  INDEX idx_timestamp (timestamp),
  SPATIAL INDEX idx_location (latitude, longitude)
);
```

---

## Food Ordering Tables

### 11. Food Orders
Stores food order information.

```sql
CREATE TABLE foodOrders (
  id VARCHAR(50) PRIMARY KEY,
  orderNumber VARCHAR(20) UNIQUE NOT NULL,
  userId VARCHAR(50) NOT NULL,
  restaurantId VARCHAR(50) NOT NULL,
  driverId VARCHAR(50),
  deliveryAddressId VARCHAR(50) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  deliveryFee DECIMAL(10,2),
  platformFee DECIMAL(10,2),
  tax DECIMAL(10,2),
  tips DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  paymentMethod ENUM('card', 'wallet', 'cash') NOT NULL,
  status ENUM('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled', 'refunded') NOT NULL,
  specialInstructions TEXT,
  cancellationReason VARCHAR(255),
  estimatedDeliveryTime INT,
  actualDeliveryTime INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  confirmedAt TIMESTAMP,
  preparingAt TIMESTAMP,
  readyAt TIMESTAMP,
  deliveredAt TIMESTAMP,
  cancelledAt TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (restaurantId) REFERENCES restaurants(id) ON DELETE SET NULL,
  FOREIGN KEY (driverId) REFERENCES drivers(id) ON DELETE SET NULL,
  FOREIGN KEY (deliveryAddressId) REFERENCES userAddresses(id) ON DELETE RESTRICT,
  INDEX idx_userId (userId),
  INDEX idx_restaurantId (restaurantId),
  INDEX idx_status (status),
  INDEX idx_createdAt (createdAt)
);
```

### 12. Food Order Items
Stores individual items in a food order.

```sql
CREATE TABLE foodOrderItems (
  id VARCHAR(50) PRIMARY KEY,
  orderId VARCHAR(50) NOT NULL,
  menuItemId VARCHAR(50) NOT NULL,
  itemName VARCHAR(100) NOT NULL,
  itemPrice DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL,
  specialInstructions TEXT,
  subtotal DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (orderId) REFERENCES foodOrders(id) ON DELETE CASCADE,
  FOREIGN KEY (menuItemId) REFERENCES menuItems(id) ON DELETE RESTRICT,
  INDEX idx_orderId (orderId)
);
```

---

## Payment & Wallet Tables

### 13. Payment Methods
Stores customer payment methods.

```sql
CREATE TABLE paymentMethods (
  id VARCHAR(50) PRIMARY KEY,
  userId VARCHAR(50) NOT NULL,
  type ENUM('card', 'mobile_money', 'bank_transfer') NOT NULL,
  provider VARCHAR(50),
  cardBrand VARCHAR(20),
  cardLastFour VARCHAR(4),
  cardHolderName VARCHAR(100),
  cardExpiryMonth INT,
  cardExpiryYear INT,
  mobileNumber VARCHAR(20),
  bankAccountNumber VARCHAR(50),
  bankName VARCHAR(100),
  isDefault BOOLEAN DEFAULT false,
  isVerified BOOLEAN DEFAULT false,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_isDefault (isDefault)
);
```

### 14. Wallet
Stores customer wallet balance and information.

```sql
CREATE TABLE wallet (
  id VARCHAR(50) PRIMARY KEY,
  userId VARCHAR(50) UNIQUE NOT NULL,
  balance DECIMAL(15,2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'XAF',
  totalAdded DECIMAL(15,2) DEFAULT 0,
  totalSpent DECIMAL(15,2) DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_userId (userId)
);
```

### 15. Wallet Transactions
Stores wallet transaction history.

```sql
CREATE TABLE walletTransactions (
  id VARCHAR(50) PRIMARY KEY,
  walletId VARCHAR(50) NOT NULL,
  userId VARCHAR(50) NOT NULL,
  type ENUM('ride', 'food_order', 'wallet_topup', 'refund', 'admin_adjustment') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description VARCHAR(255),
  relatedId VARCHAR(50),
  balanceBefore DECIMAL(15,2),
  balanceAfter DECIMAL(15,2),
  status ENUM('completed', 'pending', 'failed') DEFAULT 'completed',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (walletId) REFERENCES wallet(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_walletId (walletId),
  INDEX idx_userId (userId),
  INDEX idx_createdAt (createdAt)
);
```

### 16. Transactions
Stores all platform transactions (rides, orders, payouts).

```sql
CREATE TABLE transactions (
  id VARCHAR(50) PRIMARY KEY,
  type ENUM('ride', 'food_order', 'driver_payout', 'restaurant_payout', 'wallet_topup', 'refund') NOT NULL,
  relatedId VARCHAR(50),
  amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'XAF',
  fromType ENUM('user', 'driver', 'restaurant') NOT NULL,
  fromId VARCHAR(50) NOT NULL,
  toType ENUM('user', 'driver', 'restaurant', 'platform') NOT NULL,
  toId VARCHAR(50),
  platformFee DECIMAL(15,2) DEFAULT 0,
  status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  paymentMethod VARCHAR(50),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completedAt TIMESTAMP,
  INDEX idx_type (type),
  INDEX idx_status (status),
  INDEX idx_fromId (fromId),
  INDEX idx_createdAt (createdAt)
);
```

---

## Rating & Review Tables

### 17. Ride Ratings
Stores customer ratings for completed rides.

```sql
CREATE TABLE rideRatings (
  id VARCHAR(50) PRIMARY KEY,
  rideId VARCHAR(50) UNIQUE NOT NULL,
  userId VARCHAR(50) NOT NULL,
  driverId VARCHAR(50) NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  cleanliness INT,
  driving INT,
  communication INT,
  tips DECIMAL(10,2),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (rideId) REFERENCES rides(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (driverId) REFERENCES drivers(id) ON DELETE CASCADE,
  INDEX idx_driverId (driverId),
  INDEX idx_createdAt (createdAt)
);
```

### 18. Driver Ratings (from users)
Stores driver profile ratings.

```sql
CREATE TABLE driverRatings (
  id VARCHAR(50) PRIMARY KEY,
  driverId VARCHAR(50) NOT NULL,
  totalRatings INT DEFAULT 0,
  averageRating DECIMAL(3,2) DEFAULT 0,
  rating5Count INT DEFAULT 0,
  rating4Count INT DEFAULT 0,
  rating3Count INT DEFAULT 0,
  rating2Count INT DEFAULT 0,
  rating1Count INT DEFAULT 0,
  lastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (driverId) REFERENCES drivers(id) ON DELETE CASCADE,
  UNIQUE KEY unique_driver (driverId),
  INDEX idx_driverId (driverId)
);
```

### 19. Food Order Ratings
Stores customer ratings for food orders.

```sql
CREATE TABLE foodOrderRatings (
  id VARCHAR(50) PRIMARY KEY,
  orderId VARCHAR(50) UNIQUE NOT NULL,
  userId VARCHAR(50) NOT NULL,
  restaurantId VARCHAR(50) NOT NULL,
  foodQuality INT,
  packaging INT,
  delivery INT,
  overallRating INT NOT NULL CHECK (overallRating >= 1 AND overallRating <= 5),
  review TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (orderId) REFERENCES foodOrders(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (restaurantId) REFERENCES restaurants(id) ON DELETE CASCADE,
  INDEX idx_restaurantId (restaurantId),
  INDEX idx_createdAt (createdAt)
);
```

### 20. Restaurant Ratings (aggregated)
Stores restaurant profile ratings.

```sql
CREATE TABLE restaurantRatings (
  id VARCHAR(50) PRIMARY KEY,
  restaurantId VARCHAR(50) NOT NULL,
  totalRatings INT DEFAULT 0,
  averageRating DECIMAL(3,2) DEFAULT 0,
  rating5Count INT DEFAULT 0,
  rating4Count INT DEFAULT 0,
  rating3Count INT DEFAULT 0,
  rating2Count INT DEFAULT 0,
  rating1Count INT DEFAULT 0,
  lastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurantId) REFERENCES restaurants(id) ON DELETE CASCADE,
  UNIQUE KEY unique_restaurant (restaurantId),
  INDEX idx_restaurantId (restaurantId)
);
```

---

## Support & Communication Tables

### 21. Support Tickets
Stores support ticket information.

```sql
CREATE TABLE supportTickets (
  id VARCHAR(50) PRIMARY KEY,
  ticketNumber VARCHAR(20) UNIQUE NOT NULL,
  userId VARCHAR(50),
  driverId VARCHAR(50),
  restaurantId VARCHAR(50),
  subject VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  description TEXT NOT NULL,
  status ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
  relatedRideId VARCHAR(50),
  relatedOrderId VARCHAR(50),
  assignedTo VARCHAR(50),
  attachments VARCHAR(500),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolvedAt TIMESTAMP,
  closedAt TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (driverId) REFERENCES drivers(id) ON DELETE SET NULL,
  FOREIGN KEY (restaurantId) REFERENCES restaurants(id) ON DELETE SET NULL,
  INDEX idx_userId (userId),
  INDEX idx_status (status),
  INDEX idx_priority (priority),
  INDEX idx_createdAt (createdAt)
);
```

### 22. Support Ticket Replies
Stores replies to support tickets.

```sql
CREATE TABLE supportTicketReplies (
  id VARCHAR(50) PRIMARY KEY,
  ticketId VARCHAR(50) NOT NULL,
  senderType ENUM('user', 'admin', 'driver', 'restaurant') NOT NULL,
  senderId VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  attachments VARCHAR(500),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ticketId) REFERENCES supportTickets(id) ON DELETE CASCADE,
  INDEX idx_ticketId (ticketId),
  INDEX idx_createdAt (createdAt)
);
```

---

## Payout Tables

### 23. Driver Payouts
Stores driver payout requests and history.

```sql
CREATE TABLE driverPayouts (
  id VARCHAR(50) PRIMARY KEY,
  driverId VARCHAR(50) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  status ENUM('pending', 'processing', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
  payoutMethod VARCHAR(50),
  bankAccount VARCHAR(50),
  requestedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expectedDate TIMESTAMP,
  completedAt TIMESTAMP,
  failureReason VARCHAR(255),
  FOREIGN KEY (driverId) REFERENCES drivers(id) ON DELETE CASCADE,
  INDEX idx_driverId (driverId),
  INDEX idx_status (status),
  INDEX idx_requestedAt (requestedAt)
);
```

### 24. Restaurant Payouts
Stores restaurant payout requests and history.

```sql
CREATE TABLE restaurantPayouts (
  id VARCHAR(50) PRIMARY KEY,
  restaurantId VARCHAR(50) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  status ENUM('pending', 'processing', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
  payoutMethod VARCHAR(50),
  bankAccount VARCHAR(50),
  requestedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expectedDate TIMESTAMP,
  completedAt TIMESTAMP,
  failureReason VARCHAR(255),
  FOREIGN KEY (restaurantId) REFERENCES restaurants(id) ON DELETE CASCADE,
  INDEX idx_restaurantId (restaurantId),
  INDEX idx_status (status),
  INDEX idx_requestedAt (requestedAt)
);
```

---

## Favorites Tables

### 25. Favorite Restaurants
Stores user favorite restaurants.

```sql
CREATE TABLE favoriteRestaurants (
  id VARCHAR(50) PRIMARY KEY,
  userId VARCHAR(50) NOT NULL,
  restaurantId VARCHAR(50) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (restaurantId) REFERENCES restaurants(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_restaurant (userId, restaurantId),
  INDEX idx_userId (userId)
);
```

### 26. Favorite Locations
Stores user favorite pickup/dropoff locations for rides.

```sql
CREATE TABLE favoriteLocations (
  id VARCHAR(50) PRIMARY KEY,
  userId VARCHAR(50) NOT NULL,
  label VARCHAR(50),
  address VARCHAR(255) NOT NULL,
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  SPATIAL INDEX idx_location (latitude, longitude)
);
```

---

## Verification & Document Tables

### 27. Driver Documents
Stores driver verification documents.

```sql
CREATE TABLE driverDocuments (
  id VARCHAR(50) PRIMARY KEY,
  driverId VARCHAR(50) NOT NULL,
  documentType ENUM('license', 'insurance', 'registration', 'inspection', 'background_check') NOT NULL,
  documentNumber VARCHAR(100),
  documentUrl VARCHAR(500) NOT NULL,
  expiryDate DATE,
  status ENUM('pending', 'verified', 'rejected', 'expired') DEFAULT 'pending',
  rejectionReason VARCHAR(255),
  uploadedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  verifiedAt TIMESTAMP,
  FOREIGN KEY (driverId) REFERENCES drivers(id) ON DELETE CASCADE,
  INDEX idx_driverId (driverId),
  INDEX idx_status (status)
);
```

### 28. Restaurant Documents
Stores restaurant verification documents.

```sql
CREATE TABLE restaurantDocuments (
  id VARCHAR(50) PRIMARY KEY,
  restaurantId VARCHAR(50) NOT NULL,
  documentType ENUM('business_license', 'health_permit', 'food_safety', 'tax_id', 'registration') NOT NULL,
  documentNumber VARCHAR(100),
  documentUrl VARCHAR(500) NOT NULL,
  expiryDate DATE,
  status ENUM('pending', 'verified', 'rejected', 'expired') DEFAULT 'pending',
  rejectionReason VARCHAR(255),
  uploadedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  verifiedAt TIMESTAMP,
  FOREIGN KEY (restaurantId) REFERENCES restaurants(id) ON DELETE CASCADE,
  INDEX idx_restaurantId (restaurantId),
  INDEX idx_status (status)
);
```

---

## Analytics & Metrics Tables

### 29. Daily Analytics
Stores daily platform metrics.

```sql
CREATE TABLE dailyAnalytics (
  id VARCHAR(50) PRIMARY KEY,
  date DATE UNIQUE NOT NULL,
  totalRides INT DEFAULT 0,
  totalFoodOrders INT DEFAULT 0,
  totalRevenue DECIMAL(15,2) DEFAULT 0,
  totalPlatformFee DECIMAL(15,2) DEFAULT 0,
  totalDriverEarnings DECIMAL(15,2) DEFAULT 0,
  totalRestaurantEarnings DECIMAL(15,2) DEFAULT 0,
  newUsers INT DEFAULT 0,
  newDrivers INT DEFAULT 0,
  newRestaurants INT DEFAULT 0,
  activeUsers INT DEFAULT 0,
  activeDrivers INT DEFAULT 0,
  INDEX idx_date (date)
);
```

### 30. Popular Menu Items
Stores popularity metrics for menu items.

```sql
CREATE TABLE popularMenuItems (
  id VARCHAR(50) PRIMARY KEY,
  menuItemId VARCHAR(50) NOT NULL,
  restaurantId VARCHAR(50) NOT NULL,
  ordersThisMonth INT DEFAULT 0,
  ordersThisWeek INT DEFAULT 0,
  totalOrders INT DEFAULT 0,
  averageRating DECIMAL(3,2),
  lastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (menuItemId) REFERENCES menuItems(id) ON DELETE CASCADE,
  FOREIGN KEY (restaurantId) REFERENCES restaurants(id) ON DELETE CASCADE,
  INDEX idx_restaurantId (restaurantId),
  INDEX idx_ordersThisMonth (ordersThisMonth)
);
```

---

## Settings & Preferences Tables

### 31. User Preferences
Stores user notification and privacy settings.

```sql
CREATE TABLE userPreferences (
  id VARCHAR(50) PRIMARY KEY,
  userId VARCHAR(50) UNIQUE NOT NULL,
  notificationRideUpdates BOOLEAN DEFAULT true,
  notificationOrderUpdates BOOLEAN DEFAULT true,
  notificationPromotions BOOLEAN DEFAULT true,
  notificationWeeklyDeals BOOLEAN DEFAULT false,
  preferredLanguage VARCHAR(10) DEFAULT 'en',
  preferredCurrency VARCHAR(3) DEFAULT 'XAF',
  timezone VARCHAR(50) DEFAULT 'UTC+1',
  profileVisibility ENUM('public', 'private') DEFAULT 'public',
  shareLocation BOOLEAN DEFAULT true,
  showReviews BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_userId (userId)
);
```

### 32. Driver Preferences
Stores driver notification and availability settings.

```sql
CREATE TABLE driverPreferences (
  id VARCHAR(50) PRIMARY KEY,
  driverId VARCHAR(50) UNIQUE NOT NULL,
  notificationNewRides BOOLEAN DEFAULT true,
  notificationRideUpdates BOOLEAN DEFAULT true,
  notificationPromotions BOOLEAN DEFAULT true,
  notificationWeeklyReports BOOLEAN DEFAULT false,
  preferredLanguage VARCHAR(10) DEFAULT 'en',
  timezone VARCHAR(50) DEFAULT 'UTC+1',
  autoAcceptRides BOOLEAN DEFAULT false,
  rideNotificationSound BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (driverId) REFERENCES drivers(id) ON DELETE CASCADE,
  INDEX idx_driverId (driverId)
);
```

### 33. Restaurant Preferences
Stores restaurant notification and operational settings.

```sql
CREATE TABLE restaurantPreferences (
  id VARCHAR(50) PRIMARY KEY,
  restaurantId VARCHAR(50) UNIQUE NOT NULL,
  notificationNewOrders BOOLEAN DEFAULT true,
  notificationOrderUpdates BOOLEAN DEFAULT true,
  notificationPromotions BOOLEAN DEFAULT true,
  notificationWeeklyReports BOOLEAN DEFAULT true,
  preferredLanguage VARCHAR(10) DEFAULT 'en',
  timezone VARCHAR(50) DEFAULT 'UTC+1',
  autoAcceptOrders BOOLEAN DEFAULT false,
  minOrderValue DECIMAL(10,2) DEFAULT 0,
  orderNotificationSound BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurantId) REFERENCES restaurants(id) ON DELETE CASCADE,
  INDEX idx_restaurantId (restaurantId)
);
```

---

## Delivery Zones Table

### 34. Restaurant Delivery Zones
Stores delivery zones and fees for restaurants.

```sql
CREATE TABLE restaurantDeliveryZones (
  id VARCHAR(50) PRIMARY KEY,
  restaurantId VARCHAR(50) NOT NULL,
  zoneName VARCHAR(100) NOT NULL,
  deliveryFee DECIMAL(10,2) NOT NULL,
  estimatedDeliveryTime INT,
  enabled BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurantId) REFERENCES restaurants(id) ON DELETE CASCADE,
  INDEX idx_restaurantId (restaurantId)
);
```

---

## Admin Tables

### 35. Admin Users
Stores admin user accounts.

```sql
CREATE TABLE adminUsers (
  id VARCHAR(50) PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  firstName VARCHAR(100),
  lastName VARCHAR(100),
  role ENUM('superadmin', 'admin', 'moderator', 'support') NOT NULL,
  permissions JSON,
  isActive BOOLEAN DEFAULT true,
  lastLogin TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);
```

### 36. Admin Activity Log
Stores admin actions for audit purposes.

```sql
CREATE TABLE adminActivityLog (
  id VARCHAR(50) PRIMARY KEY,
  adminId VARCHAR(50) NOT NULL,
  action VARCHAR(255) NOT NULL,
  targetType VARCHAR(50),
  targetId VARCHAR(50),
  details JSON,
  ipAddress VARCHAR(45),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (adminId) REFERENCES adminUsers(id) ON DELETE CASCADE,
  INDEX idx_adminId (adminId),
  INDEX idx_createdAt (createdAt)
);
```

---

## Key Relationships

```
Users (1:N) Food Orders
Users (1:N) Rides
Users (1:N) UserAddresses
Users (1:1) Wallet
Users (1:N) PaymentMethods
Users (1:N) FavoriteRestaurants
Users (1:N) FavoriteLocations
Users (1:N) RideRatings
Users (1:N) FoodOrderRatings
Users (1:N) SupportTickets
Users (1:1) UserPreferences

Drivers (1:1) Vehicles
Drivers (1:N) Rides
Drivers (1:N) FoodOrders (delivery)
Drivers (1:N) DriverDocuments
Drivers (1:N) RideRatings
Drivers (1:1) DriverRatings
Drivers (1:N) RideTracking
Drivers (1:N) DriverPayouts
Drivers (1:1) DriverPreferences

Restaurants (1:N) MenuCategories
Restaurants (1:N) MenuItems
Restaurants (1:N) FoodOrders
Restaurants (1:N) RestaurantOperatingHours
Restaurants (1:N) RestaurantDocuments
Restaurants (1:1) RestaurantRatings
Restaurants (1:N) FoodOrderRatings
Restaurants (1:N) RestaurantPayouts
Restaurants (1:1) RestaurantPreferences
Restaurants (1:N) RestaurantDeliveryZones

Rides (1:N) RideTracking
Rides (1:1) RideRatings

MenuCategories (1:N) MenuItems

FoodOrders (1:N) FoodOrderItems
FoodOrders (1:1) FoodOrderRatings

Wallet (1:N) WalletTransactions

SupportTickets (1:N) SupportTicketReplies
```

---

## Indexes Summary

### Performance Critical Indexes
- User authentication: `users(email)`, `drivers(email)`, `restaurants(email)`
- Status lookups: `rides(status)`, `foodOrders(status)`, `supportTickets(status)`
- Time-based queries: `rides(createdAt)`, `foodOrders(createdAt)`, `transactions(createdAt)`
- Location-based queries: `userAddresses(latitude,longitude)`, `restaurants(latitude,longitude)`
- User data retrieval: `rides(userId)`, `foodOrders(userId)`, `userAddresses(userId)`

### Spatial Indexes
- Location searches: `userAddresses(latitude,longitude)`, `favoriteLocations(latitude,longitude)`, `restaurants(latitude,longitude)`, `rideTracking(latitude,longitude)`

---

## Data Types Reference

| Type | Usage | Example |
|------|-------|---------|
| VARCHAR(n) | Variable strings | Names, emails, addresses |
| INT | Whole numbers | Counts, years, age |
| DECIMAL(15,2) | Money amounts | Prices, earnings, fees |
| DECIMAL(3,2) | Ratings | 4.85 (3 total digits, 2 decimals) |
| DECIMAL(10,8) | GPS coordinates | Latitude/longitude |
| BOOLEAN | True/false | isOnline, isVerified |
| DATE | Dates only | Expiry dates, birthdates |
| TIMESTAMP | Date and time | Created/updated timestamps |
| ENUM | Fixed options | Status values, roles |
| TEXT | Large text | Reviews, descriptions |
| JSON | Complex data | Permissions, metadata |

---

## Conventions

1. **ID Format**: All primary keys use `VARCHAR(50)` with format `{table}_001`, `user_123`, etc.
2. **Soft Deletes**: Critical data uses status ENUM instead of hard deletes
3. **Timestamps**: All tables have `createdAt` and `updatedAt` timestamps (except tracking tables)
4. **Naming**: Tables use camelCase, columns use camelCase, SQL keywords in UPPERCASE
5. **Foreign Keys**: ON DELETE behavior depends on data importance
6. **Decimal Precision**: Monetary amounts use `DECIMAL(15,2)` for XAF currency

