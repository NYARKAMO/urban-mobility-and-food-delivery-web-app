// Restaurant Authentication & Session Management

// Check restaurant authentication
function checkRestaurantAuth() {
    const restaurantSession = localStorage.getItem('restaurantSession');
    if (!restaurantSession) {
        window.location.href = '../restaurant-login.html';
    }
}

// Restaurant Login Function
function restaurantLogin(email, password, remember) {
    // Demo credentials
    const validEmail = 'restaurant@swiftride.com';
    const validPassword = 'restaurant123';

    if (email === validEmail && password === validPassword) {
        // Create session
        const session = {
            email: email,
            name: 'Pizza Palace',
            role: 'restaurant',
            loginTime: new Date().getTime()
        };

        localStorage.setItem('restaurantSession', JSON.stringify(session));
        
        if (remember) {
            localStorage.setItem('rememberRestaurant', 'true');
        }

        // Redirect to dashboard
        window.location.href = 'restaurant/restaurant-dashboard.html';
        return true;
    }

    return false;
}

// Restaurant Logout
function restaurantLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('restaurantSession');
        localStorage.removeItem('rememberRestaurant');
        window.location.href = '../restaurant-login.html';
    }
}

// Toggle Password Visibility
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

// Toggle Sidebar
function toggleRestaurantSidebar() {
    const sidebar = document.getElementById('restaurantSidebar');
    if (sidebar) {
        sidebar.classList.toggle('hidden');
    }
}

// Toggle Restaurant Status
function toggleRestaurantStatus() {
    const status = document.getElementById('restaurantStatus');
    const btn = event.target;
    
    if (status.textContent === 'Open') {
        status.textContent = 'Closed';
        btn.textContent = 'Open Restaurant';
        document.querySelector('.status-indicator').style.background = '#999';
    } else {
        status.textContent = 'Open';
        btn.textContent = 'Close Restaurant';
        document.querySelector('.status-indicator').style.background = '#4caf50';
    }
}

// Restaurant Login Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const restaurantLoginForm = document.getElementById('restaurantLoginForm');
    
    if (restaurantLoginForm) {
        restaurantLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            // Show loading state
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...';
            submitBtn.disabled = true;

            const email = document.getElementById('restaurantEmail').value;
            const password = document.getElementById('restaurantPassword').value;
            const remember = document.getElementById('rememberRestaurant').checked;

            // Simulate network delay for better UX
            setTimeout(() => {
                if (restaurantLogin(email, password, remember)) {
                    // Success - redirect handled in restaurantLogin
                } else {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    showError('Invalid restaurant credentials. Please check your email and password.');
                }
            }, 1000);
        });

        // Auto-fill if remember me was checked
        const rememberRestaurant = localStorage.getItem('rememberRestaurant');
        if (rememberRestaurant) {
            const session = JSON.parse(localStorage.getItem('restaurantSession'));
            if (session) {
                document.getElementById('restaurantEmail').value = session.email;
                document.getElementById('rememberRestaurant').checked = true;
            }
        }
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
