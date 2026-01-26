// Promo Codes Page JavaScript

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

// Promo Codes functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add promo form submission
    document.getElementById('addPromoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addPromoCode();
    });

    // Apply promo buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('apply-btn')) {
            const promoCode = e.target.closest('.promo-card').querySelector('.promo-info h3').textContent;
            applyPromo(promoCode);
        }
    });
});

function showAddPromoModal() {
    document.getElementById('addPromoModal').classList.add('open');
    document.getElementById('promoCode').focus();
}

function closeAddPromoModal() {
    document.getElementById('addPromoModal').classList.remove('open');
    document.getElementById('addPromoForm').reset();
}

function addPromoCode() {
    const promoCode = document.getElementById('promoCode').value.trim().toUpperCase();

    if (!promoCode) {
        showError('Please enter a promo code');
        return;
    }

    // Simulate API call to validate promo code
    showLoading('addPromoForm', true);

    setTimeout(() => {
        // Mock validation - in real app, this would be an API call
        const validCodes = ['WELCOME20', 'FOOD15', 'RIDE500', 'NEWYEAR25', 'PIZZA10', 'SUMMER30', 'LOYALTY10'];

        if (validCodes.includes(promoCode)) {
            // Check if code is already added
            const existingCodes = document.querySelectorAll('.promo-info h3');
            const codeExists = Array.from(existingCodes).some(code => code.textContent === promoCode);

            if (codeExists) {
                showError('This promo code is already added to your account');
                showLoading('addPromoForm', false);
                return;
            }

            // Add the promo code to active list
            addPromoToList(promoCode);
            closeAddPromoModal();
            showSuccess(`Promo code "${promoCode}" has been added successfully!`);
        } else {
            showError('Invalid promo code. Please check and try again.');
        }

        showLoading('addPromoForm', false);
    }, 1500);
}

function addPromoToList(promoCode) {
    // Mock promo data - in real app, this would come from API
    const promoData = {
        'SUMMER30': {
            icon: 'fa-sun',
            description: '30% off all summer rides',
            discount: '30% OFF',
            validity: 'Valid until Aug 31, 2026',
            usage: 'Used 0/2 times'
        },
        'LOYALTY10': {
            icon: 'fa-heart',
            description: '10% off for loyal customers',
            discount: '10% OFF',
            validity: 'Valid until Dec 31, 2026',
            usage: 'Used 0/5 times'
        }
    };

    const data = promoData[promoCode];
    if (!data) return;

    const promoHTML = `
        <div class="promo-card active">
            <div class="promo-header">
                <div class="promo-icon">
                    <i class="fa-solid ${data.icon}"></i>
                </div>
                <div class="promo-info">
                    <h3>${promoCode}</h3>
                    <p class="promo-description">${data.description}</p>
                </div>
            </div>
            <div class="promo-details">
                <div class="promo-discount">${data.discount}</div>
                <div class="promo-validity">${data.validity}</div>
                <div class="promo-usage">${data.usage}</div>
            </div>
            <div class="promo-actions">
                <button class="apply-btn" onclick="applyPromo('${promoCode}')">Apply</button>
            </div>
        </div>
    `;

    const activeSection = document.querySelector('.promo-grid');
    activeSection.insertAdjacentHTML('afterbegin', promoHTML);
}

function applyPromo(promoCode) {
    // Show loading state
    const applyBtn = event.target;
    const originalText = applyBtn.textContent;
    applyBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Applying...';
    applyBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Update usage count
        const promoCard = applyBtn.closest('.promo-card');
        const usageElement = promoCard.querySelector('.promo-usage');
        const currentUsage = usageElement.textContent;
        const match = currentUsage.match(/Used (\d+)\/(\d+) times/);

        if (match) {
            const used = parseInt(match[1]) + 1;
            const total = parseInt(match[2]);

            if (used <= total) {
                usageElement.textContent = `Used ${used}/${total} times`;

                // Show success modal
                showSuccessModal(`Promo code "${promoCode}" has been applied successfully! You will see the discount in your next order.`);

                // Reset button
                applyBtn.innerHTML = 'Applied';
                applyBtn.style.background = '#4CAF50';
                applyBtn.disabled = true;
            } else {
                showError('This promo code has reached its usage limit');
                applyBtn.innerHTML = originalText;
                applyBtn.disabled = false;
            }
        }
    }, 1000);
}

function showSuccessModal(message) {
    document.getElementById('successMessage').textContent = message;
    document.getElementById('successModal').classList.add('open');
}

function closeSuccessModal() {
    document.getElementById('successModal').classList.remove('open');
}

function showError(message) {
    // Create error toast
    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.innerHTML = `
        <i class="fa-solid fa-exclamation-triangle"></i>
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

function showSuccess(message) {
    // Create success toast
    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.innerHTML = `
        <i class="fa-solid fa-check"></i>
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

function showLoading(formId, show) {
    const form = document.getElementById(formId);
    const submitBtn = form.querySelector('.submit-btn');

    if (show) {
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Adding...';
        submitBtn.disabled = true;
    } else {
        submitBtn.innerHTML = 'Add Code';
        submitBtn.disabled = false;
    }
}

// Toast styles (added dynamically)
const toastStyles = `
    .error-toast, .success-toast {
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
    }

    .error-toast.show, .success-toast.show {
        transform: translateX(0);
    }

    .error-toast {
        border-left: 4px solid #ec1304;
    }

    .error-toast i {
        color: #ec1304;
        font-size: 1.2rem;
    }

    .success-toast {
        border-left: 4px solid #4CAF50;
    }

    .success-toast i {
        color: #4CAF50;
        font-size: 1.2rem;
    }

    .error-toast span, .success-toast span {
        color: #333;
        font-size: 0.9rem;
        flex: 1;
    }
`;

// Add toast styles to head
const style = document.createElement('style');
style.textContent = toastStyles;
document.head.appendChild(style);