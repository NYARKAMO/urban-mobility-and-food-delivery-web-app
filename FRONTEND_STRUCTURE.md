# SwiftRide Frontend Structure

## Overview
The frontend is organized into three main directories representing the three user roles in the SwiftRide platform.

---

## Directory Structure

```
nadine/
├── user/                          # Customer/User interface
│   ├── css/                       # User-specific styles
│   │   ├── auth.css              # Authentication styling
│   │   ├── styles.css            # Main styles
│   │   ├── book-ride.css         # Ride booking styles
│   │   └── order-food.css        # Food ordering styles
│   ├── js/                        # User-specific JavaScript
│   │   └── script.js             # Main script
│   ├── index.html                # Home/Dashboard
│   ├── login.html                # User login
│   ├── signup.html               # User registration
│   ├── book-ride.html            # Ride booking page
│   ├── order-food.html           # Food ordering page
│   ├── profile.html              # User profile
│   ├── wallet.html               # Wallet/Payment
│   ├── settings.html             # Preferences
│   ├── order-history.html        # Order history
│   ├── rewards.html              # Rewards program
│   ├── promo-codes.html          # Promotional codes
│   ├── help-support.html         # Help & support
│   └── forgot-password.html      # Password recovery
│
├── driver/                        # Driver dashboard & interface
│   ├── css/                       # Driver-specific styles
│   │   ├── auth.css              # Authentication styling
│   │   └── driver.css            # Driver dashboard styles
│   ├── js/                        # Driver-specific JavaScript
│   │   └── (driver.js when created)
│   ├── login.html                # Driver login
│   ├── signup.html               # Driver registration
│   ├── dashboard.html            # Main driver dashboard
│   ├── earnings.html             # Earnings & analytics
│   ├── rides.html                # Ride history
│   ├── vehicle.html              # Vehicle management
│   ├── profile.html              # Driver profile
│   ├── ratings.html              # Customer ratings
│   └── settings.html             # Driver preferences
│
├── restaurant/                    # Restaurant dashboard & interface
│   ├── css/                       # Restaurant-specific styles
│   │   ├── auth.css              # Authentication styling
│   │   └── restaurant.css        # Restaurant dashboard styles
│   ├── js/                        # Restaurant-specific JavaScript
│   │   └── (restaurant.js when created)
│   ├── login.html                # Restaurant login
│   ├── signup.html               # Restaurant registration
│   ├── dashboard.html            # Main restaurant dashboard
│   ├── menu.html                 # Menu management
│   ├── orders.html               # Order management
│   ├── earnings.html             # Revenue & analytics
│   ├── analytics.html            # Business analytics
│   ├── profile.html              # Restaurant profile
│   └── settings.html             # Restaurant preferences
│
├── admin/                         # Admin panel (existing)
├── api/                           # API documentation
├── css/                           # Shared/global CSS
├── js/                            # Shared/global JavaScript
├── JS/                            # Additional JavaScript files
├── images/                        # Images and assets
├── favicon_io/                    # Favicon files
│
└── styles.css                     # Root CSS (shared)
└── script.js                      # Root JS (shared)
```

---

## Folder Purposes

### `/user` - Customer Interface
**Purpose:** Complete user/customer application for booking rides and ordering food

**Key Pages:**
- `index.html` - Home page / Dashboard
- `book-ride.html` - Ride booking with search & payment
- `order-food.html` - Food ordering with restaurant browsing
- `profile.html` - User profile & address management
- `wallet.html` - Payment methods & wallet balance
- `order-history.html` - Past rides and food orders
- `settings.html` - Notifications & preferences

**Styling:** Consistent customer UI with purple/blue gradients

---

### `/driver` - Driver Dashboard
**Purpose:** Complete driver application for managing rides and earnings

**Key Pages:**
- `login.html` - Driver authentication
- `signup.html` - Driver registration with vehicle info
- `dashboard.html` - Main driver dashboard
- `rides.html` - Active and completed rides
- `earnings.html` - Daily/monthly earnings & payouts
- `vehicle.html` - Vehicle details & documents
- `profile.html` - Driver profile & ratings
- `ratings.html` - Customer reviews

**Styling:** Driver-specific UI with red gradients (#ec1304)

---

### `/restaurant` - Restaurant Dashboard
**Purpose:** Complete restaurant management system for orders and operations

**Key Pages:**
- `login.html` - Restaurant authentication
- `signup.html` - Restaurant registration
- `dashboard.html` - Main restaurant dashboard
- `menu.html` - Menu items & categories management
- `orders.html` - New, preparing, and completed orders
- `earnings.html` - Revenue tracking & payouts
- `analytics.html` - Business analytics & popular items
- `profile.html` - Restaurant info & hours
- `settings.html` - Operational preferences

**Styling:** Restaurant-specific UI with orange gradients (#ff6f00)

---

## File Organization Rules

### CSS Files
- `auth.css` - Shared authentication styling (used by all roles)
- `styles.css` - Base styles and common components
- Role-specific CSS (driver.css, restaurant.css) - Unique dashboard styling

### JavaScript Files
- Shared utilities go in `/JS` folder
- Role-specific scripts should be in respective `js/` folders
- Each role should have its own `script.js` for initialization

### Images & Assets
- Shared images in root `/images` folder
- Consider creating role-specific image folders if needed
- Icons and favicons in `/favicon_io`

---

## How to Reference Assets

### From User Pages
```html
<!-- CSS -->
<link rel="stylesheet" href="css/styles.css">
<link rel="stylesheet" href="css/auth.css">

<!-- JavaScript -->
<script src="js/script.js"></script>

<!-- Images -->
<img src="../images/logo.png" alt="Logo">
```

### From Driver Pages
```html
<!-- CSS -->
<link rel="stylesheet" href="css/driver.css">
<link rel="stylesheet" href="css/auth.css">

<!-- JavaScript -->
<script src="js/driver.js"></script>

<!-- Images -->
<img src="../images/logo.png" alt="Logo">
```

### From Restaurant Pages
```html
<!-- CSS -->
<link rel="stylesheet" href="css/restaurant.css">
<link rel="stylesheet" href="css/auth.css">

<!-- JavaScript -->
<script src="js/restaurant.js"></script>

<!-- Images -->
<img src="../images/logo.png" alt="Logo">
```

---

## API Integration Points

Each role's JavaScript should implement API calls to their respective endpoints:

### User JavaScript
```javascript
// API endpoints
const USER_API = '/api/users';
const RIDES_API = '/api/users/rides';
const ORDERS_API = '/api/users/orders';
const RESTAURANTS_API = '/api/users/restaurants';
```

### Driver JavaScript
```javascript
// API endpoints
const DRIVER_API = '/api/drivers';
const RIDES_API = '/api/drivers/rides';
const EARNINGS_API = '/api/drivers/earnings';
const VEHICLE_API = '/api/drivers/vehicle';
```

### Restaurant JavaScript
```javascript
// API endpoints
const RESTAURANT_API = '/api/restaurants';
const MENU_API = '/api/restaurants/menu';
const ORDERS_API = '/api/restaurants/orders';
const EARNINGS_API = '/api/restaurants/earnings';
```

---

## Next Steps

1. ✅ Folder structure created
2. ⏳ Update all HTML file links to CSS/JS files
3. ⏳ Create role-specific JavaScript files (driver.js, restaurant.js)
4. ⏳ Implement API integration for each role
5. ⏳ Add responsive design for mobile (max-width: 768px)
6. ⏳ Testing & QA

---

## File Path Reference

| Role | Login | Signup | Dashboard | Profile |
|------|-------|--------|-----------|---------|
| User | `user/login.html` | `user/signup.html` | `user/index.html` | `user/profile.html` |
| Driver | `driver/login.html` | `driver/signup.html` | `driver/dashboard.html` | `driver/profile.html` |
| Restaurant | `restaurant/login.html` | `restaurant/signup.html` | `restaurant/dashboard.html` | `restaurant/profile.html` |

