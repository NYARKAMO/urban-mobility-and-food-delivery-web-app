// Driver Authentication & Session Management

// Check driver authentication
function checkDriverAuth() {
    const driverSession = localStorage.getItem('driverSession');
    if (!driverSession) {
        window.location.href = '../driver-login.html';
    }
}

// Driver Login Function
function driverLogin(email, password, remember) {
    // Demo credentials
    const validEmail = 'driver@swiftride.com';
    const validPassword = 'driver123';

    if (email === validEmail && password === validPassword) {
        // Create session
        const session = {
            email: email,
            name: 'Alex Rodriguez',
            role: 'driver',
            loginTime: new Date().getTime()
        };

        localStorage.setItem('driverSession', JSON.stringify(session));
        
        if (remember) {
            localStorage.setItem('rememberDriver', 'true');
        }

        // Redirect to dashboard
        window.location.href = 'driver/driver-dashboard.html';
        return true;
    }

    return false;
}

// Driver Logout
function driverLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('driverSession');
        localStorage.removeItem('rememberDriver');
        window.location.href = '../driver-login.html';
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
function toggleDriverSidebar() {
    const sidebar = document.getElementById('driverSidebar');
    if (sidebar) {
        sidebar.classList.toggle('hidden');
    }
}

// Toggle Online Status
function toggleOnlineStatus() {
    const status = document.getElementById('onlineStatus');
    const btn = event.target;
    
    if (status.textContent === 'Online') {
        status.textContent = 'Offline';
        btn.textContent = 'Go Online';
        document.querySelector('.status-indicator').style.background = '#999';
    } else {
        status.textContent = 'Online';
        btn.textContent = 'Go Offline';
        document.querySelector('.status-indicator').style.background = '#4caf50';
    }
}

// Driver Login Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const driverLoginForm = document.getElementById('driverLoginForm');
    
    if (driverLoginForm) {
        driverLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            // Show loading state
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...';
            submitBtn.disabled = true;

            const email = document.getElementById('driverEmail').value;
            const password = document.getElementById('driverPassword').value;
            const remember = document.getElementById('rememberDriver').checked;

            // Simulate network delay for better UX
            setTimeout(() => {
                if (driverLogin(email, password, remember)) {
                    // Success - redirect handled in driverLogin
                } else {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    showError('Invalid driver credentials. Please check your email and password.');
                }
            }, 1000);
        });

        // Auto-fill if remember me was checked
        const rememberDriver = localStorage.getItem('rememberDriver');
        if (rememberDriver) {
            const session = JSON.parse(localStorage.getItem('driverSession'));
            if (session) {
                document.getElementById('driverEmail').value = session.email;
                document.getElementById('rememberDriver').checked = true;
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
