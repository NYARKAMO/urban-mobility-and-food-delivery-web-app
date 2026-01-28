// Authentication JavaScript

// Password toggle functionality
function togglePassword(inputId = 'password') {
    const input = document.getElementById(inputId);
    const toggleBtn = input.nextElementSibling;
    const icon = toggleBtn.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fa-solid fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fa-solid fa-eye';
    }
}

// Password strength checker
function checkPasswordStrength(password) {
    let strength = 0;
    let feedback = [];

    if (password.length >= 8) strength++;
    else feedback.push('At least 8 characters');

    if (/[a-z]/.test(password)) strength++;
    else feedback.push('Lowercase letter');

    if (/[A-Z]/.test(password)) strength++;
    else feedback.push('Uppercase letter');

    if (/[0-9]/.test(password)) strength++;
    else feedback.push('Number');

    if (/[^A-Za-z0-9]/.test(password)) strength++;
    else feedback.push('Special character');

    return { strength, feedback };
}

function updatePasswordStrength() {
    const password = document.getElementById('password').value;
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');

    if (!password) {
        strengthFill.className = 'strength-fill';
        strengthText.textContent = 'Password strength';
        return;
    }

    const { strength } = checkPasswordStrength(password);

    strengthFill.className = 'strength-fill';

    if (strength <= 2) {
        strengthFill.classList.add('weak');
        strengthText.textContent = 'Weak password';
    } else if (strength <= 3) {
        strengthFill.classList.add('medium');
        strengthText.textContent = 'Medium password';
    } else {
        strengthFill.classList.add('strong');
        strengthText.textContent = 'Strong password';
    }
}

// Form validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

function validatePassword(password) {
    return password.length >= 8;
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function hideError(elementId) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = '';
    errorElement.style.display = 'none';
}

function showMessage(type, message) {
    const messageElement = document.getElementById(type + 'Message');
    const textElement = document.getElementById(type + 'Text');
    textElement.textContent = message;
    messageElement.classList.add('show');

    setTimeout(() => {
        messageElement.classList.remove('show');
    }, 5000);
}

// User management (localStorage for demo)
function saveUser(userData) {
    const users = JSON.parse(localStorage.getItem('swiftride_users') || '[]');
    users.push(userData);
    localStorage.setItem('swiftride_users', JSON.stringify(users));
}

function findUser(email) {
    const users = JSON.parse(localStorage.getItem('swiftride_users') || '[]');
    return users.find(user => user.email === email);
}

function authenticateUser(email, password) {
    const user = findUser(email);
    return user && user.password === password;
}

function setCurrentUser(user) {
    localStorage.setItem('swiftride_current_user', JSON.stringify(user));
}

function getCurrentUser() {
    const user = localStorage.getItem('swiftride_current_user');
    return user ? JSON.parse(user) : null;
}

function logoutUser() {
    localStorage.removeItem('swiftride_current_user');
    window.location.href = 'login.html';
}

function checkAuthStatus() {
    const currentUser = getCurrentUser();
    if (currentUser && !window.location.pathname.includes('login') && !window.location.pathname.includes('signup') && !window.location.pathname.includes('forgot-password')) {
        // User is logged in and not on auth pages, update UI
        updateUserUI(currentUser);
    } else if (!currentUser && !window.location.pathname.includes('login') && !window.location.pathname.includes('signup') && !window.location.pathname.includes('forgot-password') && !window.location.pathname.includes('index')) {
        // User is not logged in and not on auth or home pages, redirect to login
        window.location.href = 'login.html';
    }
}

// Update UI with user data
function updateUserUI(user) {
    // Update navigation user info
    const userInfos = document.querySelectorAll('.sidenav-user h5, .sidenav-user p');
    if (userInfos.length >= 2) {
        userInfos[0].textContent = `${user.firstName} ${user.lastName}`;
        userInfos[1].textContent = user.email;
    }

    // Update profile pages with user data
    if (window.location.pathname.includes('profile')) {
        document.getElementById('firstName').value = user.firstName || '';
        document.getElementById('lastName').value = user.lastName || '';
        document.getElementById('email').value = user.email || '';
        document.getElementById('phone').value = user.phone || '';
    }
}

// Login functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication status
    checkAuthStatus();

    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }

    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSignup();
        });

        // Password strength checking
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            passwordInput.addEventListener('input', updatePasswordStrength);
        }
    }

    // Forgot password form
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleForgotPassword();
        });
    }
});

function handleLogin() {
    // Clear previous errors
    hideError('emailError');
    hideError('passwordError');

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    let isValid = true;

    // Validate email
    if (!email) {
        showError('emailError', 'Email is required');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    }

    // Validate password
    if (!password) {
        showError('passwordError', 'Password is required');
        isValid = false;
    }

    if (!isValid) return;

    // Show loading
    const loginBtn = document.getElementById('loginBtn');
    const btnText = loginBtn.querySelector('.btn-text');
    const btnLoader = loginBtn.querySelector('.btn-loader');
    btnText.style.display = 'none';
    btnLoader.style.display = 'block';
    loginBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Check demo credentials
        if ((email === 'demo@swiftride.com' && password === 'demo123') ||
            authenticateUser(email, password)) {

            const user = findUser(email) || {
                firstName: 'Demo',
                lastName: 'User',
                email: email,
                phone: '+237 6XX XXX XXX'
            };

            setCurrentUser(user);

            showMessage('success', 'Login successful! Redirecting...');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);

        } else {
            showMessage('error', 'Invalid email or password. Please try again.');
            btnText.style.display = 'block';
            btnLoader.style.display = 'none';
            loginBtn.disabled = false;
        }
    }, 2000);
}

function handleSignup() {
    // Clear previous errors
    ['firstNameError', 'lastNameError', 'emailError', 'phoneError', 'passwordError', 'confirmPasswordError'].forEach(id => hideError(id));

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const termsAgree = document.getElementById('termsAgree').checked;

    let isValid = true;

    // Validate first name
    if (!firstName) {
        showError('firstNameError', 'First name is required');
        isValid = false;
    }

    // Validate last name
    if (!lastName) {
        showError('lastNameError', 'Last name is required');
        isValid = false;
    }

    // Validate email
    if (!email) {
        showError('emailError', 'Email is required');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    } else if (findUser(email)) {
        showError('emailError', 'An account with this email already exists');
        isValid = false;
    }

    // Validate phone
    if (!phone) {
        showError('phoneError', 'Phone number is required');
        isValid = false;
    } else if (!validatePhone(phone)) {
        showError('phoneError', 'Please enter a valid phone number');
        isValid = false;
    }

    // Validate password
    if (!password) {
        showError('passwordError', 'Password is required');
        isValid = false;
    } else if (!validatePassword(password)) {
        showError('passwordError', 'Password must be at least 8 characters long');
        isValid = false;
    }

    // Validate password confirmation
    if (!confirmPassword) {
        showError('confirmPasswordError', 'Please confirm your password');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('confirmPasswordError', 'Passwords do not match');
        isValid = false;
    }

    // Validate terms agreement
    if (!termsAgree) {
        showError('confirmPasswordError', 'You must agree to the terms and conditions');
        isValid = false;
    }

    if (!isValid) return;

    // Show loading
    const signupBtn = document.getElementById('signupBtn');
    const btnText = signupBtn.querySelector('.btn-text');
    const btnLoader = signupBtn.querySelector('.btn-loader');
    btnText.style.display = 'none';
    btnLoader.style.display = 'block';
    signupBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        const userData = {
            firstName,
            lastName,
            email,
            phone,
            password,
            createdAt: new Date().toISOString(),
            marketingAgree: document.getElementById('marketingAgree').checked
        };

        saveUser(userData);
        setCurrentUser(userData);

        showMessage('success', 'Account created successfully! Redirecting...');

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);

    }, 2000);
}

function handleForgotPassword() {
    // Clear previous errors
    hideError('emailError');

    const email = document.getElementById('email').value.trim();

    let isValid = true;

    // Validate email
    if (!email) {
        showError('emailError', 'Email is required');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    }

    if (!isValid) return;

    // Show loading
    const resetBtn = document.getElementById('resetBtn');
    const btnText = resetBtn.querySelector('.btn-text');
    const btnLoader = resetBtn.querySelector('.btn-loader');
    btnText.style.display = 'none';
    btnLoader.style.display = 'block';
    resetBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Check if user exists
        const user = findUser(email);

        if (user || email === 'demo@swiftride.com') {
            // Show success state
            document.getElementById('forgotPasswordForm').style.display = 'none';
            document.getElementById('successState').style.display = 'block';

            showMessage('success', 'Password reset link sent to your email!');
        } else {
            showMessage('error', 'No account found with this email address.');
            btnText.style.display = 'block';
            btnLoader.style.display = 'none';
            resetBtn.disabled = false;
        }
    }, 2000);
}

function resendEmail() {
    showMessage('success', 'Password reset link sent again!');
}

// Social login functions (mock)
function loginWithGoogle() {
    showMessage('info', 'Google login would open here');
}

function loginWithFacebook() {
    showMessage('info', 'Facebook login would open here');
}

function loginWithApple() {
    showMessage('info', 'Apple login would open here');
}

function signupWithGoogle() {
    showMessage('info', 'Google signup would open here');
}

function signupWithFacebook() {
    showMessage('info', 'Facebook signup would open here');
}

function signupWithApple() {
    showMessage('info', 'Apple signup would open here');
}