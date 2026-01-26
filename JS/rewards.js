// Rewards Page JavaScript

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

// Rewards functionality
let currentPoints = 2450;

document.addEventListener('DOMContentLoaded', function() {
    // Tab filtering
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const category = this.dataset.tab;
            filterRewards(category);
        });
    });

    // Quick redeem buttons
    const quickRedeemBtns = document.querySelectorAll('.redeem-btn');
    quickRedeemBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const option = this.closest('.redeem-option');
            const points = parseInt(option.dataset.points);
            const value = option.dataset.value;

            showRedeemModal(points, value, option.querySelector('h4').textContent, 'quick');
        });
    });

    // Catalog redeem buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('redeem-reward-btn')) {
            const points = parseInt(e.target.dataset.points);
            const type = e.target.dataset.type;
            const value = e.target.dataset.value;
            const title = e.target.closest('.reward-item').querySelector('h4').textContent;

            showRedeemModal(points, value, title, type);
        }
    });

    // Modal controls
    document.getElementById('closeRedeemModal').addEventListener('click', closeRedeemModal);
    document.getElementById('cancelRedeem').addEventListener('click', closeRedeemModal);
    document.getElementById('confirmRedeem').addEventListener('click', confirmRedemption);

    // Update redeem button states
    updateRedeemButtons();
});

function filterRewards(category) {
    const rewardItems = document.querySelectorAll('.reward-item');

    rewardItems.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function showRedeemModal(points, value, title, type) {
    if (points > currentPoints) {
        alert('Insufficient points!');
        return;
    }

    const modal = document.getElementById('redeemModal');
    const rewardPreview = document.getElementById('rewardPreview');
    const pointsRequired = document.getElementById('pointsRequired');
    const currentBalance = document.getElementById('currentBalance');

    // Populate modal
    rewardPreview.innerHTML = `
        <div class="reward-preview-content">
            <div class="preview-icon">
                <i class="fa-solid fa-${getIconForType(type)}"></i>
            </div>
            <h4>${title}</h4>
            <p>Value: ${formatValue(value, type)}</p>
        </div>
    `;

    pointsRequired.textContent = points.toLocaleString();
    currentBalance.textContent = currentPoints.toLocaleString();

    modal.classList.add('open');
}

function getIconForType(type) {
    switch(type) {
        case 'cashback': return 'money-bill-wave';
        case 'ride': return 'car';
        case 'food': return 'burger';
        case 'premium': return 'crown';
        case 'priority': return 'star';
        case 'quick': return 'gift';
        default: return 'gift';
    }
}

function formatValue(value, type) {
    if (type === 'cashback') {
        return value + ' XAF';
    } else if (type === 'ride') {
        return value === 'premium' ? 'Premium Ride' : 'Standard Ride';
    } else if (type === 'food') {
        return value === 'coffee' ? 'Free Coffee' : 'Up to ' + value + ' XAF';
    } else if (type === 'premium') {
        return value + ' Days Premium';
    } else if (type === 'priority') {
        return value + ' Hours Priority';
    }
    return value;
}

function closeRedeemModal() {
    document.getElementById('redeemModal').classList.remove('open');
}

function confirmRedemption() {
    const pointsRequired = parseInt(document.getElementById('pointsRequired').textContent.replace(',', ''));

    // Deduct points
    currentPoints -= pointsRequired;
    updatePointsDisplay();

    // Add to history
    addRedemptionToHistory(pointsRequired);

    // Close modal
    closeRedeemModal();

    // Show success message
    alert('Reward redeemed successfully!');

    // Update button states
    updateRedeemButtons();
}

function updatePointsDisplay() {
    const pointsElement = document.querySelector('.points-number');
    pointsElement.textContent = currentPoints.toLocaleString();

    // Update progress bar
    const progressFill = document.querySelector('.progress-fill');
    const progress = (currentPoints / 3500) * 100;
    progressFill.style.width = Math.min(progress, 100) + '%';

    // Update progress text
    const progressText = document.querySelector('.progress-text span');
    progressText.textContent = `${currentPoints.toLocaleString()} / 3,500 points to next reward`;
}

function addRedemptionToHistory(points) {
    const historyList = document.querySelector('.history-list');

    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.innerHTML = `
        <div class="history-icon redeemed">
            <i class="fa-solid fa-minus"></i>
        </div>
        <div class="history-info">
            <h4>Reward redeemed</h4>
            <p>Just now</p>
        </div>
        <div class="history-points negative">-${points}</div>
    `;

    // Insert at the beginning
    historyList.insertBefore(historyItem, historyList.firstChild);
}

function updateRedeemButtons() {
    // Update catalog buttons
    const catalogButtons = document.querySelectorAll('.redeem-reward-btn');
    catalogButtons.forEach(btn => {
        const points = parseInt(btn.dataset.points);
        if (points > currentPoints) {
            btn.disabled = true;
            btn.textContent = 'Insufficient Points';
        } else {
            btn.disabled = false;
            btn.textContent = 'Redeem';
        }
    });

    // Update quick redeem buttons
    const quickButtons = document.querySelectorAll('.redeem-btn');
    quickButtons.forEach(btn => {
        const option = btn.closest('.redeem-option');
        const points = parseInt(option.dataset.points);
        if (points > currentPoints) {
            btn.disabled = true;
            btn.textContent = 'Insufficient Points';
        } else {
            btn.disabled = false;
            btn.textContent = 'Redeem';
        }
    });
}

// Simulate earning points (for demo purposes)
function earnPoints(points, reason) {
    currentPoints += points;
    updatePointsDisplay();

    // Add to history
    const historyList = document.querySelector('.history-list');
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.innerHTML = `
        <div class="history-icon earned">
            <i class="fa-solid fa-plus"></i>
        </div>
        <div class="history-info">
            <h4>${reason}</h4>
            <p>Just now</p>
        </div>
        <div class="history-points positive">+${points}</div>
    `;

    historyList.insertBefore(historyItem, historyList.firstChild);
    updateRedeemButtons();
}

// Make earnPoints available globally for demo purposes
window.earnPoints = earnPoints;