# SwiftRide Database Schema - PostgreSQL

## Overview
This document outlines the complete database schema for the SwiftRide platform using PostgreSQL, including all tables, columns, data types, constraints, and relationships. PostgreSQL is recommended for its superior ACID compliance, spatial query support, and advanced features.

---

## Setup Instructions

### Required Extensions
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "postgis_topology";
```

---

## Custom Enum Types

```sql
-- User account statuses
CREATE TYPE user_status AS ENUM ('active', 'suspended', 'deleted');

-- Driver statuses
CREATE TYPE driver_status AS ENUM ('pending', 'active', 'suspended', 'banned', 'deleted');

-- Account statuses
CREATE TYPE account_status AS ENUM ('pending', 'active', 'suspended', 'banned', 'deleted');

-- Ride types
CREATE TYPE ride_type AS ENUM ('standard', 'premium');

-- Vehicle types
CREATE TYPE vehicle_type AS ENUM ('car', 'bike');

-- Days of week
CREATE TYPE day_of_week AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

-- Ride statuses
CREATE TYPE ride_status AS ENUM ('pending', 'searching', 'accepted', 'arrived', 'in_progress', 'completed', 'cancelled');

-- Food order statuses
CREATE TYPE food_order_status AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled', 'refunded');

-- Payment methods
CREATE TYPE payment_type AS ENUM ('card', 'mobile_money', 'bank_transfer', 'wallet');

-- Transaction statuses
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Support priority
CREATE TYPE support_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Support status
CREATE TYPE support_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');

-- Document statuses
CREATE TYPE document_status AS ENUM ('pending', 'verified', 'rejected', 'expired');

-- Payout statuses
CREATE TYPE payout_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');

-- Actor types
CREATE TYPE actor_type AS ENUM ('user', 'driver', 'restaurant', 'admin', 'system');

-- Visibility settings
CREATE TYPE visibility_type AS ENUM ('public', 'private');
```

---

## Core Tables

### 1. Users (Customers)
Stores customer/user account information.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  accountStatus user_status DEFAULT 'active' NOT NULL,
  emailVerified BOOLEAN DEFAULT false,
  phoneVerified BOOLEAN DEFAULT false,
  totalRides INT DEFAULT 0,
  totalOrders INT DEFAULT 0,
  averageRating NUMERIC(3,2),
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  lastLogin TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_accountStatus ON users(accountStatus);
CREATE INDEX idx_users_createdAt ON users(createdAt);
```

### 2. Drivers
Stores driver account and vehicle information.

```sql
CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  profilePhoto VARCHAR(500),
  address VARCHAR(255),
  city VARCHAR(50),
  accountStatus driver_status DEFAULT 'pending' NOT NULL,
  isOnline BOOLEAN DEFAULT false,
  isAvailable BOOLEAN DEFAULT false,
  rating NUMERIC(3,2) DEFAULT 0,
  totalRides INT DEFAULT 0,
  totalEarnings NUMERIC(15,2) DEFAULT 0,
  bankAccountNumber VARCHAR(50),
  bankName VARCHAR(100),
  bankSwiftCode VARCHAR(20),
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  lastLogin TIMESTAMP WITH TIME ZONE,
  documentVerificationDate TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_drivers_email ON drivers(email);
CREATE INDEX idx_drivers_accountStatus ON drivers(accountStatus);
CREATE INDEX idx_drivers_isAvailable ON drivers(isAvailable);
CREATE INDEX idx_drivers_createdAt ON drivers(createdAt);
```

### 3. Vehicles
Stores driver vehicle information.

```sql
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driverId UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  type vehicle_type NOT NULL,
  make VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  year SMALLINT NOT NULL,
  color VARCHAR(50),
  licensePlate VARCHAR(20) UNIQUE NOT NULL,
  vin VARCHAR(50),
  seats SMALLINT DEFAULT 4,
  registrationExpiry DATE,
  insuranceExpiry DATE,
  registrationVerified BOOLEAN DEFAULT false,
  insuranceVerified BOOLEAN DEFAULT false,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vehicles_driverId ON vehicles(driverId);
CREATE INDEX idx_vehicles_licensePlate ON vehicles(licensePlate);
CREATE INDEX idx_vehicles_type ON vehicles(type);
```

### 4. Restaurants
Stores restaurant business information.

```sql
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  location GEOMETRY(POINT, 4326),
  deliveryRadius SMALLINT DEFAULT 5,
  minOrderValue NUMERIC(10,2) DEFAULT 0,
  accountStatus account_status DEFAULT 'pending' NOT NULL,
  logo VARCHAR(500),
  coverPhoto VARCHAR(500),
  rating NUMERIC(3,2) DEFAULT 0,
  totalOrders INT DEFAULT 0,
  totalEarnings NUMERIC(15,2) DEFAULT 0,
  bankAccountNumber VARCHAR(50),
  bankName VARCHAR(100),
  bankSwiftCode VARCHAR(20),
  commissionRate NUMERIC(5,2) DEFAULT 10,
  isOpen BOOLEAN DEFAULT true,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_restaurants_email ON restaurants(email);
CREATE INDEX idx_restaurants_accountStatus ON restaurants(accountStatus);
CREATE INDEX idx_restaurants_cuisineType ON restaurants(cuisineType);
CREATE INDEX idx_restaurants_location ON restaurants USING GIST(location);
CREATE INDEX idx_restaurants_city ON restaurants(city);
```

### 5. Restaurant Operating Hours
Stores restaurant opening/closing times by day.

```sql
CREATE TABLE restaurantOperatingHours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurantId UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  dayOfWeek day_of_week NOT NULL,
  openTime TIME NOT NULL,
  closeTime TIME NOT NULL,
  isClosed BOOLEAN DEFAULT false,
  UNIQUE(restaurantId, dayOfWeek)
);

CREATE INDEX idx_restaurantOperatingHours_restaurantId ON restaurantOperatingHours(restaurantId);
```

### 6. Menu Categories
Stores food menu categories for restaurants.

```sql
CREATE TABLE menuCategories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurantId UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  displayOrder SMALLINT DEFAULT 0,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_menuCategories_restaurantId ON menuCategories(restaurantId);
```

### 7. Menu Items
Stores individual food items for restaurants.

```sql
CREATE TABLE menuItems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurantId UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  categoryId UUID NOT NULL REFERENCES menuCategories(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  image VARCHAR(500),
  preparationTime SMALLINT,
  isAvailable BOOLEAN DEFAULT true,
  isVegetarian BOOLEAN DEFAULT false,
  isVegan BOOLEAN DEFAULT false,
  isSpicy BOOLEAN DEFAULT false,
  calories SMALLINT,
  portions SMALLINT DEFAULT 1,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_menuItems_restaurantId ON menuItems(restaurantId);
CREATE INDEX idx_menuItems_categoryId ON menuItems(categoryId);
CREATE INDEX idx_menuItems_isAvailable ON menuItems(isAvailable);
```

### 8. User Addresses
Stores saved delivery addresses for customers.

```sql
CREATE TABLE userAddresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label VARCHAR(50),
  street VARCHAR(255) NOT NULL,
  city VARCHAR(50) NOT NULL,
  postalCode VARCHAR(20),
  location GEOMETRY(POINT, 4326) NOT NULL,
  instructions TEXT,
  isDefault BOOLEAN DEFAULT false,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_userAddresses_userId ON userAddresses(userId);
CREATE INDEX idx_userAddresses_isDefault ON userAddresses(isDefault);
CREATE INDEX idx_userAddresses_location ON userAddresses USING GIST(location);
```

---

## Ride Management Tables

### 9. Rides
Stores ride booking information.

```sql
CREATE TABLE rides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rideNumber VARCHAR(20) UNIQUE NOT NULL,
  userId UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  driverId UUID REFERENCES drivers(id) ON DELETE SET NULL,
  rideType ride_type NOT NULL,
  vehicleType vehicle_type NOT NULL,
  pickupLocation GEOMETRY(POINT, 4326) NOT NULL,
  pickupAddress VARCHAR(255) NOT NULL,
  dropoffLocation GEOMETRY(POINT, 4326) NOT NULL,
  dropoffAddress VARCHAR(255) NOT NULL,
  distance NUMERIC(8,2),
  estimatedDuration SMALLINT,
  actualDuration SMALLINT,
  baseFare NUMERIC(10,2),
  distanceFare NUMERIC(10,2),
  surgeFare NUMERIC(10,2) DEFAULT 0,
  totalFare NUMERIC(10,2) NOT NULL,
  platformFee NUMERIC(10,2),
  tips NUMERIC(10,2) DEFAULT 0,
  paymentMethod payment_type NOT NULL,
  status ride_status NOT NULL,
  cancellationReason VARCHAR(255),
  cancelledBy actor_type,
  specialRequests TEXT,
  scheduledTime TIMESTAMP WITH TIME ZONE,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  acceptedAt TIMESTAMP WITH TIME ZONE,
  arrivedAt TIMESTAMP WITH TIME ZONE,
  startedAt TIMESTAMP WITH TIME ZONE,
  completedAt TIMESTAMP WITH TIME ZONE,
  cancelledAt TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_rides_userId ON rides(userId);
CREATE INDEX idx_rides_driverId ON rides(driverId);
CREATE INDEX idx_rides_status ON rides(status);
CREATE INDEX idx_rides_createdAt ON rides(createdAt);
CREATE INDEX idx_rides_pickupLocation ON rides USING GIST(pickupLocation);
```

### 10. Ride Tracking
Stores real-time driver location during rides.

```sql
CREATE TABLE rideTracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rideId UUID NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
  driverId UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  location GEOMETRY(POINT, 4326) NOT NULL,
  speed NUMERIC(5,2),
  heading SMALLINT,
  accuracy NUMERIC(5,2),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rideTracking_rideId ON rideTracking(rideId);
CREATE INDEX idx_rideTracking_driverId ON rideTracking(driverId);
CREATE INDEX idx_rideTracking_timestamp ON rideTracking(timestamp);
CREATE INDEX idx_rideTracking_location ON rideTracking USING GIST(location);
```

---

## Food Ordering Tables

### 11. Food Orders
Stores food order information.

```sql
CREATE TABLE foodOrders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  orderNumber VARCHAR(20) UNIQUE NOT NULL,
  userId UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  restaurantId UUID NOT NULL REFERENCES restaurants(id) ON DELETE SET NULL,
  driverId UUID REFERENCES drivers(id) ON DELETE SET NULL,
  deliveryAddressId UUID NOT NULL REFERENCES userAddresses(id) ON DELETE RESTRICT,
  subtotal NUMERIC(10,2) NOT NULL,
  deliveryFee NUMERIC(10,2),
  platformFee NUMERIC(10,2),
  tax NUMERIC(10,2),
  tips NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  paymentMethod payment_type NOT NULL,
  status food_order_status NOT NULL,
  specialInstructions TEXT,
  cancellationReason VARCHAR(255),
  estimatedDeliveryTime SMALLINT,
  actualDeliveryTime SMALLINT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  confirmedAt TIMESTAMP WITH TIME ZONE,
  preparingAt TIMESTAMP WITH TIME ZONE,
  readyAt TIMESTAMP WITH TIME ZONE,
  deliveredAt TIMESTAMP WITH TIME ZONE,
  cancelledAt TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_foodOrders_userId ON foodOrders(userId);
CREATE INDEX idx_foodOrders_restaurantId ON foodOrders(restaurantId);
CREATE INDEX idx_foodOrders_status ON foodOrders(status);
CREATE INDEX idx_foodOrders_createdAt ON foodOrders(createdAt);
```

### 12. Food Order Items
Stores individual items in a food order.

```sql
CREATE TABLE foodOrderItems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  orderId UUID NOT NULL REFERENCES foodOrders(id) ON DELETE CASCADE,
  menuItemId UUID NOT NULL REFERENCES menuItems(id) ON DELETE RESTRICT,
  itemName VARCHAR(100) NOT NULL,
  itemPrice NUMERIC(10,2) NOT NULL,
  quantity SMALLINT NOT NULL,
  specialInstructions TEXT,
  subtotal NUMERIC(10,2) NOT NULL
);

CREATE INDEX idx_foodOrderItems_orderId ON foodOrderItems(orderId);
```

---

## Payment & Wallet Tables

### 13. Payment Methods
Stores customer payment methods.

```sql
CREATE TABLE paymentMethods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type payment_type NOT NULL,
  provider VARCHAR(50),
  cardBrand VARCHAR(20),
  cardLastFour VARCHAR(4),
  cardHolderName VARCHAR(100),
  cardExpiryMonth SMALLINT,
  cardExpiryYear SMALLINT,
  mobileNumber VARCHAR(20),
  bankAccountNumber VARCHAR(50),
  bankName VARCHAR(100),
  isDefault BOOLEAN DEFAULT false,
  isVerified BOOLEAN DEFAULT false,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_paymentMethods_userId ON paymentMethods(userId);
CREATE INDEX idx_paymentMethods_isDefault ON paymentMethods(isDefault);
```

### 14. Wallet
Stores customer wallet balance and information.

```sql
CREATE TABLE wallet (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  balance NUMERIC(15,2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'XAF',
  totalAdded NUMERIC(15,2) DEFAULT 0,
  totalSpent NUMERIC(15,2) DEFAULT 0,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_wallet_userId ON wallet(userId);
```

### 15. Wallet Transactions
Stores wallet transaction history.

```sql
CREATE TABLE walletTransactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  walletId UUID NOT NULL REFERENCES wallet(id) ON DELETE CASCADE,
  userId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  description VARCHAR(255),
  relatedId UUID,
  balanceBefore NUMERIC(15,2),
  balanceAfter NUMERIC(15,2),
  status transaction_status DEFAULT 'completed',
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_walletTransactions_walletId ON walletTransactions(walletId);
CREATE INDEX idx_walletTransactions_userId ON walletTransactions(userId);
CREATE INDEX idx_walletTransactions_createdAt ON walletTransactions(createdAt);
```

### 16. Transactions
Stores all platform transactions (rides, orders, payouts).

```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50) NOT NULL,
  relatedId UUID,
  amount NUMERIC(15,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'XAF',
  fromType actor_type NOT NULL,
  fromId UUID NOT NULL,
  toType actor_type NOT NULL,
  toId UUID,
  platformFee NUMERIC(15,2) DEFAULT 0,
  status transaction_status DEFAULT 'pending',
  paymentMethod VARCHAR(50),
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completedAt TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_fromId ON transactions(fromId);
CREATE INDEX idx_transactions_createdAt ON transactions(createdAt);
```

---

## Rating & Review Tables

### 17. Ride Ratings
Stores customer ratings for completed rides.

```sql
CREATE TABLE rideRatings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rideId UUID UNIQUE NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
  userId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  driverId UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  cleanliness SMALLINT,
  driving SMALLINT,
  communication SMALLINT,
  tips NUMERIC(10,2),
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rideRatings_driverId ON rideRatings(driverId);
CREATE INDEX idx_rideRatings_createdAt ON rideRatings(createdAt);
```

### 18. Driver Ratings
Stores driver profile ratings aggregated.

```sql
CREATE TABLE driverRatings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driverId UUID UNIQUE NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  totalRatings INT DEFAULT 0,
  averageRating NUMERIC(3,2) DEFAULT 0,
  rating5Count INT DEFAULT 0,
  rating4Count INT DEFAULT 0,
  rating3Count INT DEFAULT 0,
  rating2Count INT DEFAULT 0,
  rating1Count INT DEFAULT 0,
  lastUpdated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_driverRatings_driverId ON driverRatings(driverId);
```

### 19. Food Order Ratings
Stores customer ratings for food orders.

```sql
CREATE TABLE foodOrderRatings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  orderId UUID UNIQUE NOT NULL REFERENCES foodOrders(id) ON DELETE CASCADE,
  userId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  restaurantId UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  foodQuality SMALLINT,
  packaging SMALLINT,
  delivery SMALLINT,
  overallRating SMALLINT NOT NULL CHECK (overallRating >= 1 AND overallRating <= 5),
  review TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_foodOrderRatings_restaurantId ON foodOrderRatings(restaurantId);
CREATE INDEX idx_foodOrderRatings_createdAt ON foodOrderRatings(createdAt);
```

### 20. Restaurant Ratings
Stores restaurant profile ratings aggregated.

```sql
CREATE TABLE restaurantRatings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurantId UUID UNIQUE NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  totalRatings INT DEFAULT 0,
  averageRating NUMERIC(3,2) DEFAULT 0,
  rating5Count INT DEFAULT 0,
  rating4Count INT DEFAULT 0,
  rating3Count INT DEFAULT 0,
  rating2Count INT DEFAULT 0,
  rating1Count INT DEFAULT 0,
  lastUpdated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_restaurantRatings_restaurantId ON restaurantRatings(restaurantId);
```

---

## Support & Communication Tables

### 21. Support Tickets
Stores support ticket information.

```sql
CREATE TABLE supportTickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticketNumber VARCHAR(20) UNIQUE NOT NULL,
  userId UUID REFERENCES users(id) ON DELETE SET NULL,
  driverId UUID REFERENCES drivers(id) ON DELETE SET NULL,
  restaurantId UUID REFERENCES restaurants(id) ON DELETE SET NULL,
  subject VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  priority support_priority DEFAULT 'medium',
  description TEXT NOT NULL,
  status support_status DEFAULT 'open',
  relatedRideId UUID,
  relatedOrderId UUID,
  assignedTo UUID,
  attachments VARCHAR(500),
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  resolvedAt TIMESTAMP WITH TIME ZONE,
  closedAt TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_supportTickets_userId ON supportTickets(userId);
CREATE INDEX idx_supportTickets_status ON supportTickets(status);
CREATE INDEX idx_supportTickets_priority ON supportTickets(priority);
CREATE INDEX idx_supportTickets_createdAt ON supportTickets(createdAt);
```

### 22. Support Ticket Replies
Stores replies to support tickets.

```sql
CREATE TABLE supportTicketReplies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticketId UUID NOT NULL REFERENCES supportTickets(id) ON DELETE CASCADE,
  senderType actor_type NOT NULL,
  senderId UUID NOT NULL,
  message TEXT NOT NULL,
  attachments VARCHAR(500),
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_supportTicketReplies_ticketId ON supportTicketReplies(ticketId);
CREATE INDEX idx_supportTicketReplies_createdAt ON supportTicketReplies(createdAt);
```

---

## Payout Tables

### 23. Driver Payouts
Stores driver payout requests and history.

```sql
CREATE TABLE driverPayouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driverId UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  amount NUMERIC(15,2) NOT NULL,
  status payout_status DEFAULT 'pending',
  payoutMethod VARCHAR(50),
  bankAccount VARCHAR(50),
  requestedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expectedDate TIMESTAMP WITH TIME ZONE,
  completedAt TIMESTAMP WITH TIME ZONE,
  failureReason VARCHAR(255)
);

CREATE INDEX idx_driverPayouts_driverId ON driverPayouts(driverId);
CREATE INDEX idx_driverPayouts_status ON driverPayouts(status);
CREATE INDEX idx_driverPayouts_requestedAt ON driverPayouts(requestedAt);
```

### 24. Restaurant Payouts
Stores restaurant payout requests and history.

```sql
CREATE TABLE restaurantPayouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurantId UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  amount NUMERIC(15,2) NOT NULL,
  status payout_status DEFAULT 'pending',
  payoutMethod VARCHAR(50),
  bankAccount VARCHAR(50),
  requestedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expectedDate TIMESTAMP WITH TIME ZONE,
  completedAt TIMESTAMP WITH TIME ZONE,
  failureReason VARCHAR(255)
);

CREATE INDEX idx_restaurantPayouts_restaurantId ON restaurantPayouts(restaurantId);
CREATE INDEX idx_restaurantPayouts_status ON restaurantPayouts(status);
CREATE INDEX idx_restaurantPayouts_requestedAt ON restaurantPayouts(requestedAt);
```

---

## Favorites Tables

### 25. Favorite Restaurants
Stores user favorite restaurants.

```sql
CREATE TABLE favoriteRestaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  restaurantId UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(userId, restaurantId)
);

CREATE INDEX idx_favoriteRestaurants_userId ON favoriteRestaurants(userId);
```

### 26. Favorite Locations
Stores user favorite pickup/dropoff locations for rides.

```sql
CREATE TABLE favoriteLocations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label VARCHAR(50),
  address VARCHAR(255) NOT NULL,
  location GEOMETRY(POINT, 4326) NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_favoriteLocations_userId ON favoriteLocations(userId);
CREATE INDEX idx_favoriteLocations_location ON favoriteLocations USING GIST(location);
```

---

## Verification & Document Tables

### 27. Driver Documents
Stores driver verification documents.

```sql
CREATE TABLE driverDocuments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driverId UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  documentType VARCHAR(50) NOT NULL,
  documentNumber VARCHAR(100),
  documentUrl VARCHAR(500) NOT NULL,
  expiryDate DATE,
  status document_status DEFAULT 'pending',
  rejectionReason VARCHAR(255),
  uploadedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  verifiedAt TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_driverDocuments_driverId ON driverDocuments(driverId);
CREATE INDEX idx_driverDocuments_status ON driverDocuments(status);
```

### 28. Restaurant Documents
Stores restaurant verification documents.

```sql
CREATE TABLE restaurantDocuments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurantId UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  documentType VARCHAR(50) NOT NULL,
  documentNumber VARCHAR(100),
  documentUrl VARCHAR(500) NOT NULL,
  expiryDate DATE,
  status document_status DEFAULT 'pending',
  rejectionReason VARCHAR(255),
  uploadedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  verifiedAt TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_restaurantDocuments_restaurantId ON restaurantDocuments(restaurantId);
CREATE INDEX idx_restaurantDocuments_status ON restaurantDocuments(status);
```

---

## Analytics & Metrics Tables

### 29. Daily Analytics
Stores daily platform metrics.

```sql
CREATE TABLE dailyAnalytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE UNIQUE NOT NULL,
  totalRides INT DEFAULT 0,
  totalFoodOrders INT DEFAULT 0,
  totalRevenue NUMERIC(15,2) DEFAULT 0,
  totalPlatformFee NUMERIC(15,2) DEFAULT 0,
  totalDriverEarnings NUMERIC(15,2) DEFAULT 0,
  totalRestaurantEarnings NUMERIC(15,2) DEFAULT 0,
  newUsers INT DEFAULT 0,
  newDrivers INT DEFAULT 0,
  newRestaurants INT DEFAULT 0,
  activeUsers INT DEFAULT 0,
  activeDrivers INT DEFAULT 0
);

CREATE INDEX idx_dailyAnalytics_date ON dailyAnalytics(date);
```

### 30. Popular Menu Items
Stores popularity metrics for menu items.

```sql
CREATE TABLE popularMenuItems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menuItemId UUID NOT NULL REFERENCES menuItems(id) ON DELETE CASCADE,
  restaurantId UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  ordersThisMonth INT DEFAULT 0,
  ordersThisWeek INT DEFAULT 0,
  totalOrders INT DEFAULT 0,
  averageRating NUMERIC(3,2),
  lastUpdated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_popularMenuItems_restaurantId ON popularMenuItems(restaurantId);
CREATE INDEX idx_popularMenuItems_ordersThisMonth ON popularMenuItems(ordersThisMonth);
```

---

## Settings & Preferences Tables

### 31. User Preferences
Stores user notification and privacy settings.

```sql
CREATE TABLE userPreferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notificationRideUpdates BOOLEAN DEFAULT true,
  notificationOrderUpdates BOOLEAN DEFAULT true,
  notificationPromotions BOOLEAN DEFAULT true,
  notificationWeeklyDeals BOOLEAN DEFAULT false,
  preferredLanguage VARCHAR(10) DEFAULT 'en',
  preferredCurrency VARCHAR(3) DEFAULT 'XAF',
  timezone VARCHAR(50) DEFAULT 'UTC+1',
  profileVisibility visibility_type DEFAULT 'public',
  shareLocation BOOLEAN DEFAULT true,
  showReviews BOOLEAN DEFAULT true,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_userPreferences_userId ON userPreferences(userId);
```

### 32. Driver Preferences
Stores driver notification and availability settings.

```sql
CREATE TABLE driverPreferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driverId UUID UNIQUE NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  notificationNewRides BOOLEAN DEFAULT true,
  notificationRideUpdates BOOLEAN DEFAULT true,
  notificationPromotions BOOLEAN DEFAULT true,
  notificationWeeklyReports BOOLEAN DEFAULT false,
  preferredLanguage VARCHAR(10) DEFAULT 'en',
  timezone VARCHAR(50) DEFAULT 'UTC+1',
  autoAcceptRides BOOLEAN DEFAULT false,
  rideNotificationSound BOOLEAN DEFAULT true,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_driverPreferences_driverId ON driverPreferences(driverId);
```

### 33. Restaurant Preferences
Stores restaurant notification and operational settings.

```sql
CREATE TABLE restaurantPreferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurantId UUID UNIQUE NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  notificationNewOrders BOOLEAN DEFAULT true,
  notificationOrderUpdates BOOLEAN DEFAULT true,
  notificationPromotions BOOLEAN DEFAULT true,
  notificationWeeklyReports BOOLEAN DEFAULT true,
  preferredLanguage VARCHAR(10) DEFAULT 'en',
  timezone VARCHAR(50) DEFAULT 'UTC+1',
  autoAcceptOrders BOOLEAN DEFAULT false,
  minOrderValue NUMERIC(10,2) DEFAULT 0,
  orderNotificationSound BOOLEAN DEFAULT true,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_restaurantPreferences_restaurantId ON restaurantPreferences(restaurantId);
```

---

## Delivery Zones Table

### 34. Restaurant Delivery Zones
Stores delivery zones and fees for restaurants.

```sql
CREATE TABLE restaurantDeliveryZones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurantId UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  zoneName VARCHAR(100) NOT NULL,
  deliveryFee NUMERIC(10,2) NOT NULL,
  estimatedDeliveryTime SMALLINT,
  enabled BOOLEAN DEFAULT true,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_restaurantDeliveryZones_restaurantId ON restaurantDeliveryZones(restaurantId);
```

---

## Admin Tables

### 35. Admin Users
Stores admin user accounts.

```sql
CREATE TABLE adminUsers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(100) UNIQUE NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  firstName VARCHAR(100),
  lastName VARCHAR(100),
  role VARCHAR(50) NOT NULL,
  permissions JSONB DEFAULT '{}',
  isActive BOOLEAN DEFAULT true,
  lastLogin TIMESTAMP WITH TIME ZONE,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_adminUsers_email ON adminUsers(email);
CREATE INDEX idx_adminUsers_role ON adminUsers(role);
```

### 36. Admin Activity Log
Stores admin actions for audit purposes.

```sql
CREATE TABLE adminActivityLog (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  adminId UUID NOT NULL REFERENCES adminUsers(id) ON DELETE CASCADE,
  action VARCHAR(255) NOT NULL,
  targetType VARCHAR(50),
  targetId UUID,
  details JSONB DEFAULT '{}',
  ipAddress INET,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_adminActivityLog_adminId ON adminActivityLog(adminId);
CREATE INDEX idx_adminActivityLog_createdAt ON adminActivityLog(createdAt);
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

## Data Types Reference

| PostgreSQL Type | Usage | Example |
|-----------------|-------|---------|
| UUID | Distributed unique IDs | Primary/foreign keys |
| VARCHAR(n) | Variable strings | Names, emails, addresses |
| TEXT | Unlimited text | Reviews, descriptions |
| SMALLINT | Small integers | Years, counts, ratings |
| INT | Integers | Total counts, times |
| BIGINT | Large integers | IDs, large numbers |
| NUMERIC(p,s) | Precise decimals | Money amounts, ratings |
| BOOLEAN | True/false | Flags, statuses |
| DATE | Dates only | Expiry dates, birthdates |
| TIMESTAMP WITH TIME ZONE | Date and time | Created/updated timestamps |
| GEOMETRY(POINT, 4326) | GPS coordinates | Latitude/longitude |
| JSONB | JSON data | Permissions, metadata |
| INET | IP addresses | IP logging |

---

## PostgreSQL-Specific Features

### 1. UUID Advantages
- Global uniqueness without auto-increment sequences
- Better for distributed systems
- Privacy (no sequential IDs exposed)
- Already created with `uuid_generate_v4()`

### 2. JSONB for Flexibility
- `permissions` column stores complex role-based access control
- `details` column in activity logs stores variable audit data
- Supports indexes and operators

### 3. Spatial Support (PostGIS)
- `GEOMETRY(POINT, 4326)` stores GPS coordinates
- GIST indexes for efficient location queries
- Native distance calculations: `ST_Distance(location1, location2)`

### 4. INET Type
- Native IP address type
- Useful for security logging and access control

### 5. Custom Enum Types
- Enforced at database level
- Better than VARCHAR enums
- Create once, use in multiple tables

---

## Performance Tuning Recommendations

### Query Optimization
```sql
-- Use EXPLAIN ANALYZE to check query performance
EXPLAIN ANALYZE SELECT * FROM rides WHERE userId = $1 AND status = 'completed';

-- Add partial indexes for common filters
CREATE INDEX idx_rides_completed_recent ON rides(createdAt DESC) WHERE status = 'completed';
```

### Partitioning (for large tables)
```sql
-- Partition rides by month for faster queries
CREATE TABLE rides_2026_01 PARTITION OF rides
  FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
```

### Vacuum and Analyze
```sql
-- Regular maintenance
VACUUM ANALYZE;
REINDEX DATABASE swift_ride;
```

---

## Backup Strategy

```sql
-- Full backup
pg_dump swift_ride > backup_$(date +%Y%m%d).sql

-- Restore backup
psql swift_ride < backup_20260127.sql

-- Continuous archival (with WAL)
-- Configure postgresql.conf:
-- wal_level = replica
-- archive_mode = on
-- archive_command = 'cp %p /backup/wal_archive/%f'
```

---

## Conventions

1. **ID Format**: All primary keys use UUID with `DEFAULT uuid_generate_v4()`
2. **Timestamps**: All use `TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`
3. **Naming**: Tables and columns use camelCase
4. **Enums**: Predefined as CREATE TYPE statements at top
5. **Precision**: Money uses `NUMERIC(15,2)`, ratings use `NUMERIC(3,2)`
6. **Spatial**: All location data uses `GEOMETRY(POINT, 4326)` (WGS 84)
7. **Indexing**: Strategic indexes on frequently queried columns
8. **Foreign Keys**: Explicit ON DELETE behavior for data integrity

