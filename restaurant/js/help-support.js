// Help & Support Page JavaScript

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

// Help & Support functionality
document.addEventListener('DOMContentLoaded', function() {
    // Report form submission
    document.getElementById('reportForm').addEventListener('submit', function(e) {
        e.preventDefault();
        submitReport();
    });
});

function searchHelp() {
    const searchTerm = document.getElementById('helpSearch').value.toLowerCase();
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question h4').textContent.toLowerCase();
        const answer = item.querySelector('.faq-answer p').textContent.toLowerCase();

        if (question.includes(searchTerm) || answer.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function toggleFAQ(element) {
    const faqItem = element.closest('.faq-item');
    const isActive = faqItem.classList.contains('active');

    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });

    // Open clicked item if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

function scrollToContact() {
    document.getElementById('contact').scrollIntoView({
        behavior: 'smooth'
    });
}

function startChat() {
    document.getElementById('chatModal').classList.add('open');
    document.getElementById('chatInput').focus();
}

function closeChatModal() {
    document.getElementById('chatModal').classList.remove('open');
}

function callSupport() {
    const phoneNumber = "+2372XXXXXX";
    window.location.href = `tel:${phoneNumber}`;

    // Show confirmation
    showToast('Calling support...', 'info');
}

function emailSupport() {
    const email = "support@swiftride.com";
    const subject = "SwiftRide Support Request";
    const body = "Please describe your issue here...";

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    showToast('Opening email client...', 'info');
}

function getDirections() {
    const address = "123 SwiftRide Street, Yaoundé, Cameroon";
    const encodedAddress = encodeURIComponent(address);

    // Try to open in Google Maps
    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
        window.location.href = `https://maps.google.com/maps?q=${encodedAddress}`;
    } else {
        window.open(`https://maps.google.com/maps?q=${encodedAddress}`, '_blank');
    }

    showToast('Opening maps...', 'info');
}

function reportIssue() {
    // Scroll to report form
    document.querySelector('.report-section').scrollIntoView({
        behavior: 'smooth'
    });

    // Focus on issue type
    setTimeout(() => {
        document.getElementById('issueType').focus();
    }, 500);
}

function trackOrder() {
    // Redirect to order history with tracking focus
    window.location.href = 'order-history.html#track';
    showToast('Redirecting to order tracking...', 'info');
}

function submitReport() {
    const formData = new FormData(document.getElementById('reportForm'));
    const submitBtn = document.querySelector('.submit-report-btn');

    // Show loading state
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Validate form
        const issueType = formData.get('issueType');
        const priority = formData.get('priority');
        const subject = formData.get('subject');
        const description = formData.get('description');

        if (!issueType || !subject || !description) {
            showToast('Please fill in all required fields', 'error');
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
            return;
        }

        // Generate report ID
        const reportId = 'SR-' + Date.now().toString().slice(-6);

        // Show success message
        showToast(`Report submitted successfully! Reference ID: ${reportId}`, 'success');

        // Reset form
        document.getElementById('reportForm').reset();

        // Reset button
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;

        // Show additional info
        setTimeout(() => {
            showToast('Our support team will respond within 24 hours', 'info');
        }, 2000);

    }, 2000);
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message) return;

    // Add user message
    addMessage(message, 'user');

    // Clear input
    input.value = '';

    // Simulate support response
    setTimeout(() => {
        const responses = [
            "I understand your concern. Let me help you with that.",
            "Thank you for providing that information. I'm looking into this for you.",
            "I apologize for any inconvenience this has caused.",
            "Let me check our system for more details on your request.",
            "I'm here to help resolve this issue for you.",
            "Could you please provide more details about what you're experiencing?",
            "I appreciate your patience while I work on this for you.",
            "Let me connect you with a specialist who can better assist you."
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addMessage(randomResponse, 'support');
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
}

function addMessage(text, type) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;

    const avatarIcon = type === 'support' ? 'fa-headset' : 'fa-user';

    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fa-solid ${avatarIcon}"></i>
        </div>
        <div class="message-content">
            <p>${text}</p>
            <span class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
    `;

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
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

// Auto-scroll chat to bottom when new messages arrive
const chatObserver = new MutationObserver(() => {
    const messagesContainer = document.getElementById('chatMessages');
    if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const messagesContainer = document.getElementById('chatMessages');
    if (messagesContainer) {
        chatObserver.observe(messagesContainer, { childList: true });
    }
});