// Admin Panel JavaScript

// Admin Authentication
function checkAdminAuth() {
    const adminSession = localStorage.getItem('adminSession');
    if (!adminSession) {
        window.location.href = 'admin-login.html';
        return false;
    }

    try {
        const admin = JSON.parse(adminSession);
        const now = new Date().getTime();
        const sessionExpiry = admin.expiry || 0;

        if (now > sessionExpiry) {
            localStorage.removeItem('adminSession');
            window.location.href = 'admin-login.html';
            return false;
        }

        return true;
    } catch (error) {
        localStorage.removeItem('adminSession');
        window.location.href = 'admin-login.html';
        return false;
    }
}

function adminLogin(email, password, remember) {
    // Demo admin credentials
    const demoAdmin = {
        email: 'admin@swiftride.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'super_admin'
    };

    if (email === demoAdmin.email && password === demoAdmin.password) {
        const sessionDuration = remember ? (24 * 60 * 60 * 1000) : (8 * 60 * 60 * 1000); // 24 hours or 8 hours
        const adminSession = {
            ...demoAdmin,
            loginTime: new Date().getTime(),
            expiry: new Date().getTime() + sessionDuration
        };

        localStorage.setItem('adminSession', JSON.stringify(adminSession));
        window.location.href = 'admin-dashboard.html';
        return true;
    }

    return false;
}

function getCurrentAdmin() {
    const adminSession = localStorage.getItem('adminSession');
    if (adminSession) {
        try {
            return JSON.parse(adminSession);
        } catch (error) {
            return null;
        }
    }
    return null;
}

function adminLogout() {
    if (confirm('Are you sure you want to logout from admin panel?')) {
        localStorage.removeItem('adminSession');
        window.location.href = 'admin-login.html';
    }
}

// Initialize admin pages
document.addEventListener('DOMContentLoaded', function() {
    // Check if current page is admin page (not login page)
    const currentPath = window.location.pathname;
    if (currentPath.includes('admin') && !currentPath.includes('admin-login.html')) {
        if (!checkAdminAuth()) {
            return; // Redirect handled in checkAdminAuth
        }

        // Update admin user info in header
        const admin = getCurrentAdmin();
        if (admin) {
            const adminUserElement = document.querySelector('.admin-user span');
            if (adminUserElement) {
                adminUserElement.textContent = admin.name;
            }
        }
    }

    // Handle admin login form
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitBtn = adminLoginForm.querySelector('.auth-btn');
            const originalText = submitBtn.innerHTML;

            // Show loading state
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...';
            submitBtn.disabled = true;

            const email = document.getElementById('adminEmail').value;
            const password = document.getElementById('adminPassword').value;
            const remember = document.getElementById('rememberAdmin').checked;

            // Simulate network delay for better UX
            setTimeout(() => {
                if (adminLogin(email, password, remember)) {
                    // Success - redirect handled in adminLogin
                } else {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    showError('Invalid admin credentials. Please check your email and password.');
                }
            }, 1000);
        });
    }

    // Initialize dashboard charts if on dashboard page
    if (document.getElementById('ridesOrdersChart')) {
        initDashboardCharts();
    }

    // Initialize analytics charts if on analytics page
    if (document.getElementById('revenueTrendsChart')) {
        updateAnalyticsCharts();
    }
});

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');

    if (errorDiv && errorText) {
        errorText.textContent = message;
        errorDiv.style.display = 'block';

        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
}

// Password toggle functionality
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Modal management
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Admin logout
function adminLogout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear admin session
        localStorage.removeItem('adminSession');
        // Redirect to login
        window.location.href = '../login.html';
    }
}

// Dashboard functionality
function updateDashboard() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    // Simulate API call to update dashboard data
    console.log(`Updating dashboard for date range: ${startDate} to ${endDate}`);

    // Update stats (mock data)
    updateDashboardStats();
    updateCharts();
}

function updateDashboardStats() {
    // Mock data updates
    const stats = {
        totalUsers: '1,247',
        activeDrivers: '158',
        totalRides: '2,891',
        totalOrders: '1,956',
        totalRevenue: '$47,230',
        avgRating: '4.7'
    };

    Object.keys(stats).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.textContent = stats[key];
        }
    });
}

// Chart.js initialization for dashboard
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('ridesOrdersChart')) {
        initDashboardCharts();
    }
});

function initDashboardCharts() {
    // Rides & Orders Chart
    const ridesOrdersCtx = document.getElementById('ridesOrdersChart').getContext('2d');
    new Chart(ridesOrdersCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Rides',
                data: [120, 150, 180, 200, 250, 280],
                borderColor: '#ec1304',
                backgroundColor: 'rgba(236, 19, 4, 0.1)',
                tension: 0.4
            }, {
                label: 'Orders',
                data: [80, 100, 120, 140, 160, 180],
                borderColor: '#1976d2',
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });

    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    new Chart(revenueCtx, {
        type: 'doughnut',
        data: {
            labels: ['Rides', 'Food Orders', 'Delivery Fees'],
            datasets: [{
                data: [65, 25, 10],
                backgroundColor: [
                    '#ec1304',
                    '#1976d2',
                    '#388e3c'
                ]
            }]
        },
        options: {
            responsive: true
        }
    });
}

// User Management Functions
function viewUser(userId) {
    // Mock user data
    const userData = {
        1: {
            name: 'Nadine Patricia',
            email: 'nadine@mail.com',
            phone: '+1 234 567 8900',
            status: 'Active',
            joinDate: '2024-01-15',
            totalRides: 24,
            totalOrders: 12,
            totalSpent: '$456.78'
        }
    };

    const user = userData[userId];
    if (user) {
        const details = `
            <div class="user-details">
                <div class="detail-row"><strong>Name:</strong> ${user.name}</div>
                <div class="detail-row"><strong>Email:</strong> ${user.email}</div>
                <div class="detail-row"><strong>Phone:</strong> ${user.phone}</div>
                <div class="detail-row"><strong>Status:</strong> ${user.status}</div>
                <div class="detail-row"><strong>Join Date:</strong> ${user.joinDate}</div>
                <div class="detail-row"><strong>Total Rides:</strong> ${user.totalRides}</div>
                <div class="detail-row"><strong>Total Orders:</strong> ${user.totalOrders}</div>
                <div class="detail-row"><strong>Total Spent:</strong> ${user.totalSpent}</div>
            </div>
        `;
        document.getElementById('userDetails').innerHTML = details;
        openModal('userModal');
    }
}

function editUser(userId) {
    alert(`Edit user ${userId} - Feature coming soon!`);
}

function suspendUser(userId) {
    if (confirm('Are you sure you want to suspend this user?')) {
        alert(`User ${userId} has been suspended.`);
        // Refresh table
        location.reload();
    }
}

function activateUser(userId) {
    if (confirm('Are you sure you want to activate this user?')) {
        alert(`User ${userId} has been activated.`);
        location.reload();
    }
}

function exportUsers() {
    alert('Exporting users data...');
}

// Driver Management Functions
function viewDriver(driverId) {
    const driverData = {
        1: {
            name: 'Alex Rodriguez',
            email: 'alex.driver@email.com',
            phone: '+1 234 567 8904',
            vehicle: 'Toyota Camry (ABC-123)',
            status: 'Active',
            joinDate: '2024-01-10',
            totalRides: 156,
            earnings: '$2,340',
            rating: '4.8',
            completionRate: '98%'
        }
    };

    const driver = driverData[driverId];
    if (driver) {
        const details = `
            <div class="driver-details">
                <div class="detail-row"><strong>Name:</strong> ${driver.name}</div>
                <div class="detail-row"><strong>Email:</strong> ${driver.email}</div>
                <div class="detail-row"><strong>Phone:</strong> ${driver.phone}</div>
                <div class="detail-row"><strong>Vehicle:</strong> ${driver.vehicle}</div>
                <div class="detail-row"><strong>Status:</strong> ${driver.status}</div>
                <div class="detail-row"><strong>Join Date:</strong> ${driver.joinDate}</div>
                <div class="detail-row"><strong>Total Rides:</strong> ${driver.totalRides}</div>
                <div class="detail-row"><strong>Earnings:</strong> ${driver.earnings}</div>
                <div class="detail-row"><strong>Rating:</strong> ${driver.rating}</div>
                <div class="detail-row"><strong>Completion Rate:</strong> ${driver.completionRate}</div>
            </div>
        `;
        document.getElementById('driverDetails').innerHTML = details;
        openModal('driverModal');
    }
}

function editDriver(driverId) {
    alert(`Edit driver ${driverId} - Feature coming soon!`);
}

function suspendDriver(driverId) {
    if (confirm('Are you sure you want to suspend this driver?')) {
        alert(`Driver ${driverId} has been suspended.`);
        location.reload();
    }
}

function activateDriver(driverId) {
    if (confirm('Are you sure you want to activate this driver?')) {
        alert(`Driver ${driverId} has been activated.`);
        location.reload();
    }
}

function approveDriver(driverId) {
    if (confirm('Are you sure you want to approve this driver?')) {
        alert(`Driver ${driverId} has been approved.`);
        location.reload();
    }
}

function rejectDriver(driverId) {
    if (confirm('Are you sure you want to reject this driver?')) {
        alert(`Driver ${driverId} has been rejected.`);
        location.reload();
    }
}

function addNewDriver() {
    openModal('addDriverModal');
}

// Handle add driver form
document.addEventListener('DOMContentLoaded', function() {
    const addDriverForm = document.getElementById('addDriverForm');
    if (addDriverForm) {
        addDriverForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Driver added successfully!');
            closeModal();
            location.reload();
        });
    }
});

// Ride Management Functions
function viewRide(rideId) {
    const rideData = {
        1: {
            rideId: 'R001',
            customer: 'Nadine Patricia',
            driver: 'Alex Rodriguez',
            pickup: 'Downtown Mall',
            dropoff: 'Airport Terminal 1',
            status: 'Completed',
            fare: '$24.50',
            distance: '12.5 km',
            duration: '18 min',
            dateTime: '2024-01-27 14:30',
            paymentMethod: 'Credit Card'
        }
    };

    const ride = rideData[rideId];
    if (ride) {
        const details = `
            <div class="ride-details">
                <div class="detail-row"><strong>Ride ID:</strong> ${ride.rideId}</div>
                <div class="detail-row"><strong>Customer:</strong> ${ride.customer}</div>
                <div class="detail-row"><strong>Driver:</strong> ${ride.driver}</div>
                <div class="detail-row"><strong>Pickup:</strong> ${ride.pickup}</div>
                <div class="detail-row"><strong>Dropoff:</strong> ${ride.dropoff}</div>
                <div class="detail-row"><strong>Status:</strong> ${ride.status}</div>
                <div class="detail-row"><strong>Fare:</strong> ${ride.fare}</div>
                <div class="detail-row"><strong>Distance:</strong> ${ride.distance}</div>
                <div class="detail-row"><strong>Duration:</strong> ${ride.duration}</div>
                <div class="detail-row"><strong>Date/Time:</strong> ${ride.dateTime}</div>
                <div class="detail-row"><strong>Payment:</strong> ${ride.paymentMethod}</div>
            </div>
        `;
        document.getElementById('rideDetails').innerHTML = details;
        openModal('rideModal');
    }
}

function editRide(rideId) {
    alert(`Edit ride ${rideId} - Feature coming soon!`);
}

function trackRide(rideId) {
    alert(`Tracking ride ${rideId} - Feature coming soon!`);
}

function refundRide(rideId) {
    if (confirm('Are you sure you want to process a refund for this ride?')) {
        alert(`Refund processed for ride ${rideId}.`);
    }
}

function exportRides() {
    alert('Exporting rides data...');
}

// Order Management Functions
function viewOrder(orderId) {
    const orderData = {
        1: {
            orderId: 'O001',
            customer: 'Nadine Patricia',
            restaurant: 'Pizza Palace',
            items: ['Margherita Pizza - $18.99', 'Garlic Bread - $5.99'],
            status: 'Delivered',
            total: '$24.98',
            deliveryTime: '32 min',
            address: '123 Main St, Apt 4B',
            dateTime: '2024-01-27 13:30',
            paymentMethod: 'Credit Card'
        }
    };

    const order = orderData[orderId];
    if (order) {
        const itemsList = order.items.map(item => `<li>${item}</li>`).join('');
        const details = `
            <div class="order-details">
                <div class="detail-row"><strong>Order ID:</strong> ${order.orderId}</div>
                <div class="detail-row"><strong>Customer:</strong> ${order.customer}</div>
                <div class="detail-row"><strong>Restaurant:</strong> ${order.restaurant}</div>
                <div class="detail-row"><strong>Items:</strong></div>
                <ul class="order-items">${itemsList}</ul>
                <div class="detail-row"><strong>Status:</strong> ${order.status}</div>
                <div class="detail-row"><strong>Total:</strong> ${order.total}</div>
                <div class="detail-row"><strong>Delivery Time:</strong> ${order.deliveryTime}</div>
                <div class="detail-row"><strong>Address:</strong> ${order.address}</div>
                <div class="detail-row"><strong>Date/Time:</strong> ${order.dateTime}</div>
                <div class="detail-row"><strong>Payment:</strong> ${order.paymentMethod}</div>
            </div>
        `;
        document.getElementById('orderDetails').innerHTML = details;
        openModal('orderModal');
    }
}

function editOrder(orderId) {
    alert(`Edit order ${orderId} - Feature coming soon!`);
}

function trackOrder(orderId) {
    alert(`Tracking order ${orderId} - Feature coming soon!`);
}

function updateStatus(orderId) {
    alert(`Update status for order ${orderId} - Feature coming soon!`);
}

function refundOrder(orderId) {
    if (confirm('Are you sure you want to process a refund for this order?')) {
        alert(`Refund processed for order ${orderId}.`);
    }
}

function exportOrders() {
    alert('Exporting orders data...');
}

// Restaurant Management Functions
function viewRestaurant(restaurantId) {
    const restaurantData = {
        1: {
            name: 'Pizza Palace',
            cuisine: 'Italian',
            owner: 'Mario Rossi',
            email: 'mario@pizzapalace.com',
            phone: '+1 234 567 8905',
            address: '456 Pizza St, Food District',
            rating: '4.5',
            status: 'Active',
            totalOrders: 245,
            revenue: '$12,450',
            commission: '$1,245'
        }
    };

    const restaurant = restaurantData[restaurantId];
    if (restaurant) {
        const details = `
            <div class="restaurant-details">
                <div class="detail-row"><strong>Name:</strong> ${restaurant.name}</div>
                <div class="detail-row"><strong>Cuisine:</strong> ${restaurant.cuisine}</div>
                <div class="detail-row"><strong>Owner:</strong> ${restaurant.owner}</div>
                <div class="detail-row"><strong>Email:</strong> ${restaurant.email}</div>
                <div class="detail-row"><strong>Phone:</strong> ${restaurant.phone}</div>
                <div class="detail-row"><strong>Address:</strong> ${restaurant.address}</div>
                <div class="detail-row"><strong>Rating:</strong> ${restaurant.rating}</div>
                <div class="detail-row"><strong>Status:</strong> ${restaurant.status}</div>
                <div class="detail-row"><strong>Total Orders:</strong> ${restaurant.totalOrders}</div>
                <div class="detail-row"><strong>Revenue:</strong> ${restaurant.revenue}</div>
                <div class="detail-row"><strong>Commission:</strong> ${restaurant.commission}</div>
            </div>
        `;
        document.getElementById('restaurantDetails').innerHTML = details;
        openModal('restaurantModal');
    }
}

function editRestaurant(restaurantId) {
    alert(`Edit restaurant ${restaurantId} - Feature coming soon!`);
}

function manageMenu(restaurantId) {
    alert(`Manage menu for restaurant ${restaurantId} - Feature coming soon!`);
}

function approveRestaurant(restaurantId) {
    if (confirm('Are you sure you want to approve this restaurant?')) {
        alert(`Restaurant ${restaurantId} has been approved.`);
        location.reload();
    }
}

function rejectRestaurant(restaurantId) {
    if (confirm('Are you sure you want to reject this restaurant?')) {
        alert(`Restaurant ${restaurantId} has been rejected.`);
        location.reload();
    }
}

function activateRestaurant(restaurantId) {
    if (confirm('Are you sure you want to activate this restaurant?')) {
        alert(`Restaurant ${restaurantId} has been activated.`);
        location.reload();
    }
}

function addNewRestaurant() {
    openModal('addRestaurantModal');
}

// Handle add restaurant form
document.addEventListener('DOMContentLoaded', function() {
    const addRestaurantForm = document.getElementById('addRestaurantForm');
    if (addRestaurantForm) {
        addRestaurantForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Restaurant added successfully!');
            closeModal();
            location.reload();
        });
    }
});

// Analytics Functions
function updateAnalytics() {
    const timeRange = document.getElementById('timeRange').value;
    console.log(`Updating analytics for ${timeRange} days`);

    // Update charts and stats
    updateAnalyticsCharts();
}

function updateAnalyticsCharts() {
    // Revenue Trends Chart
    const revenueTrendsCtx = document.getElementById('revenueTrendsChart');
    if (revenueTrendsCtx) {
        new Chart(revenueTrendsCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Revenue',
                    data: [8500, 9200, 10100, 11200],
                    borderColor: '#ec1304',
                    backgroundColor: 'rgba(236, 19, 4, 0.1)',
                    tension: 0.4
                }]
            }
        });
    }

    // User Growth Chart
    const userGrowthCtx = document.getElementById('userGrowthChart');
    if (userGrowthCtx) {
        new Chart(userGrowthCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'New Users',
                    data: [120, 145, 168, 189],
                    backgroundColor: '#1976d2'
                }]
            }
        });
    }

    // Rides vs Orders Chart
    const ridesOrdersCtx = document.getElementById('ridesOrdersChart');
    if (ridesOrdersCtx) {
        new Chart(ridesOrdersCtx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Rides', 'Orders'],
                datasets: [{
                    data: [65, 35],
                    backgroundColor: ['#ec1304', '#388e3c']
                }]
            }
        });
    }

    // Popular Locations Chart
    const locationsCtx = document.getElementById('locationsChart');
    if (locationsCtx) {
        new Chart(locationsCtx.getContext('2d'), {
            type: 'horizontalBar',
            data: {
                labels: ['Downtown', 'Airport', 'Mall', 'Business District', 'University'],
                datasets: [{
                    label: 'Rides',
                    data: [450, 320, 280, 220, 180],
                    backgroundColor: '#f57c00'
                }]
            },
            options: {
                indexAxis: 'y'
            }
        });
    }
}

function exportReport() {
    alert('Exporting analytics report...');
}

// Settings Functions
function resetToDefaults() {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
        alert('Settings reset to defaults.');
        location.reload();
    }
}

// Initialize analytics charts on page load
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('revenueTrendsChart')) {
        updateAnalyticsCharts();
    }
});

// Admin Sidebar Toggle Functionality
function toggleAdminSidebar() {
    const sidebar = document.getElementById('adminSidebar');
    const body = document.body;

    if (sidebar && body) {
        sidebar.classList.toggle('active');
        body.classList.toggle('sidebar-open');
    }
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('adminSidebar');
    const menuToggle = document.querySelector('.menu-toggle');

    if (sidebar && sidebar.classList.contains('active') &&
        !sidebar.contains(event.target) &&
        !menuToggle.contains(event.target)) {
        toggleAdminSidebar();
    }
});

// Handle window resize to close sidebar on larger screens
window.addEventListener('resize', function() {
    const sidebar = document.getElementById('adminSidebar');
    if (sidebar && window.innerWidth > 768 && sidebar.classList.contains('active')) {
        toggleAdminSidebar();
    }
});