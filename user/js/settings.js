// Settings Page JavaScript

// Navigation functions (shared with main script)
function openNav() {
    document.getElementById("mySidenav").style.width = "280px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.body.style.backgroundColor = "#f3f3f3";
}

// Close nav when clicking outside
document.addEventListener('click', function(event) {
    const sidenav = document.getElementById("mySidenav");
    const menuToggle = document.querySelector('.menu-toggle');

    if (!sidenav.contains(event.target) && !menuToggle.contains(event.target) && sidenav.style.width === "280px") {
        closeNav();
    }
});

// Settings functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load saved settings
    loadSettings();

    // Edit form submission
    document.getElementById('editForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveEditForm();
    });

    // Toggle switches
    document.querySelectorAll('.toggle input').forEach(toggle => {
        toggle.addEventListener('change', function() {
            saveToggleSetting(this.id, this.checked);
        });
    });
});

function loadSettings() {
    // Load settings from localStorage (in real app, this would be from API)
    const settings = {
        biometricToggle: localStorage.getItem('biometricToggle') === 'true' || true,
        locationToggle: localStorage.getItem('locationToggle') === 'true' || true,
        notificationToggle: localStorage.getItem('notificationToggle') === 'true' || true,
        dataShareToggle: localStorage.getItem('dataShareToggle') === 'true' || false,
        autoSaveToggle: localStorage.getItem('autoSaveToggle') === 'true' || true,
        receiptToggle: localStorage.getItem('receiptToggle') === 'true' || true
    };

    // Apply settings to toggles
    Object.keys(settings).forEach(key => {
        const toggle = document.getElementById(key);
        if (toggle) {
            toggle.checked = settings[key];
        }
    });
}

function saveToggleSetting(settingId, value) {
    // Save to localStorage (in real app, this would be API call)
    localStorage.setItem(settingId, value);

    // Show feedback
    showToast('Setting saved successfully!', 'success');
}

function saveSettings() {
    // Show loading state
    const saveBtn = document.querySelector('.save-btn');
    const originalHTML = saveBtn.innerHTML;
    saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    saveBtn.disabled = true;

    // Simulate saving all settings
    setTimeout(() => {
        // In real app, this would save all settings to server
        showToast('All settings saved successfully!', 'success');
        saveBtn.innerHTML = originalHTML;
        saveBtn.disabled = false;
    }, 1000);
}

function editEmail() {
    showEditModal('Edit Email Address', `
        <div class="form-group">
            <label for="email">New Email Address</label>
            <input type="email" id="email" value="john.doe@example.com" required>
        </div>
        <div class="form-group">
            <label for="confirmEmail">Confirm Email Address</label>
            <input type="email" id="confirmEmail" value="john.doe@example.com" required>
        </div>
    `, 'email');
}

function editPhone() {
    showEditModal('Edit Phone Number', `
        <div class="form-group">
            <label for="phone">New Phone Number</label>
            <input type="tel" id="phone" value="+237 6XX XXX XXX" required>
        </div>
    `, 'phone');
}

function changePassword() {
    showEditModal('Change Password', `
        <div class="form-group">
            <label for="currentPassword">Current Password</label>
            <input type="password" id="currentPassword" required>
        </div>
        <div class="form-group">
            <label for="newPassword">New Password</label>
            <input type="password" id="newPassword" required>
        </div>
        <div class="form-group">
            <label for="confirmPassword">Confirm New Password</label>
            <input type="password" id="confirmPassword" required>
        </div>
    `, 'password');
}

function changeLanguage() {
    showEditModal('Change Language', `
        <div class="form-group">
            <label for="language">Select Language</label>
            <select id="language" required>
                <option value="en" selected>English (US)</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
                <option value="de">Deutsch</option>
            </select>
        </div>
    `, 'language');
}

function changeCurrency() {
    showEditModal('Change Currency', `
        <div class="form-group">
            <label for="currency">Select Currency</label>
            <select id="currency" required>
                <option value="xaf" selected>XAF (Central African Franc)</option>
                <option value="usd">USD (US Dollar)</option>
                <option value="eur">EUR (Euro)</option>
                <option value="gbp">GBP (British Pound)</option>
            </select>
        </div>
    `, 'currency');
}

function changeTheme() {
    showEditModal('Change Theme', `
        <div class="form-group">
            <label for="theme">Select Theme</label>
            <select id="theme" required>
                <option value="light" selected>Light Mode</option>
                <option value="dark">Dark Mode</option>
                <option value="auto">Auto (System)</option>
            </select>
        </div>
    `, 'theme');
}

function changeUnits() {
    showEditModal('Change Units', `
        <div class="form-group">
            <label for="units">Select Units</label>
            <select id="units" required>
                <option value="km" selected>Kilometers</option>
                <option value="miles">Miles</option>
            </select>
        </div>
    `, 'units');
}

function changePaymentMethod() {
    showEditModal('Change Payment Method', `
        <div class="form-group">
            <label for="paymentMethod">Select Payment Method</label>
            <select id="paymentMethod" required>
                <option value="visa" selected>**** **** **** 1234 (Visa)</option>
                <option value="mastercard">**** **** **** 5678 (Mastercard)</option>
                <option value="paypal">PayPal Account</option>
                <option value="cash">Cash on Delivery</option>
            </select>
        </div>
    `, 'payment');
}

function showEditModal(title, content, type) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('formContent').innerHTML = content;
    document.getElementById('editModal').classList.add('open');

    // Store the type for form submission
    document.getElementById('editForm').dataset.type = type;
}

function closeEditModal() {
    document.getElementById('editModal').classList.remove('open');
    document.getElementById('editForm').reset();
}

function saveEditForm() {
    const formType = document.getElementById('editForm').dataset.type;
    const formData = new FormData(document.getElementById('editForm'));

    // Show loading state
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        let success = false;
        let message = '';

        switch (formType) {
            case 'email':
                const email = formData.get('email');
                const confirmEmail = formData.get('confirmEmail');
                if (email === confirmEmail) {
                    success = true;
                    message = 'Email address updated successfully!';
                    // Update display
                    document.querySelector('.setting-item:nth-child(1) .setting-info p').textContent = email;
                } else {
                    message = 'Email addresses do not match!';
                }
                break;

            case 'phone':
                success = true;
                message = 'Phone number updated successfully!';
                const phone = formData.get('phone');
                document.querySelector('.setting-item:nth-child(2) .setting-info p').textContent = phone;
                break;

            case 'password':
                const newPassword = formData.get('newPassword');
                const confirmPassword = formData.get('confirmPassword');
                if (newPassword === confirmPassword && newPassword.length >= 8) {
                    success = true;
                    message = 'Password changed successfully!';
                } else if (newPassword !== confirmPassword) {
                    message = 'Passwords do not match!';
                } else {
                    message = 'Password must be at least 8 characters long!';
                }
                break;

            case 'language':
            case 'currency':
            case 'theme':
            case 'units':
            case 'payment':
                success = true;
                message = 'Setting updated successfully!';
                // Update display (simplified - in real app, would update specific elements)
                break;
        }

        if (success) {
            showToast(message, 'success');
            closeEditModal();
        } else {
            showToast(message, 'error');
        }

        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

function openHelp() {
    window.location.href = 'help-support.html';
}

function contactSupport() {
    window.location.href = 'help-support.html#contact';
}

function checkUpdates() {
    showToast('Checking for updates...', 'info');

    setTimeout(() => {
        showToast('Your app is up to date!', 'success');
    }, 2000);
}

function openTerms() {
    window.open('https://swiftride.com/terms', '_blank');
}

function openPrivacy() {
    window.open('https://swiftride.com/privacy', '_blank');
}

function deleteAccount() {
    showConfirmModal(
        'Delete Account',
        'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.',
        () => {
            // Simulate account deletion
            showToast('Account deletion initiated. You will receive a confirmation email.', 'warning');
            closeConfirmModal();
        }
    );
}

function showConfirmModal(title, message, confirmCallback) {
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = message;
    document.getElementById('confirmModal').classList.add('open');

    // Store callback
    document.getElementById('confirmModal').dataset.callback = confirmCallback;
}

function closeConfirmModal() {
    document.getElementById('confirmModal').classList.remove('open');
}

function confirmAction() {
    const callback = document.getElementById('confirmModal').dataset.callback;
    if (callback && typeof window[callback] === 'function') {
        window[callback]();
    } else {
        // Execute inline callback
        eval(callback);
    }
}

function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icon = type === 'success' ? 'check' :
                 type === 'error' ? 'exclamation-triangle' :
                 type === 'warning' ? 'exclamation-circle' : 'info';

    toast.innerHTML = `
        <i class="fa-solid fa-${icon}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(toast);

    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);

    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}

// Toast styles (added dynamically)
const toastStyles = `
    .toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 8px;
        padding: 15px 20px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 1001;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 350px;
        border-left: 4px solid #666;
    }

    .toast.show {
        transform: translateX(0);
    }

    .toast-success {
        border-left-color: #4CAF50;
    }

    .toast-success i {
        color: #4CAF50;
    }

    .toast-error {
        border-left-color: #f44336;
    }

    .toast-error i {
        color: #f44336;
    }

    .toast-warning {
        border-left-color: #ff9800;
    }

    .toast-warning i {
        color: #ff9800;
    }

    .toast-info {
        border-left-color: #2196F3;
    }

    .toast-info i {
        color: #2196F3;
    }

    .toast span {
        color: #333;
        font-size: 0.9rem;
        flex: 1;
    }
`;

// Add toast styles to head
const style = document.createElement('style');
style.textContent = toastStyles;
document.head.appendChild(style);