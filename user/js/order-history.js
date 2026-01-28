// Order History Page JavaScript

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

// Order History functionality
document.addEventListener('DOMContentLoaded', function() {
    // Filter tabs
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            const filter = this.dataset.filter;
            filterOrders(filter);
        });
    });

    // Date range filter
    document.getElementById('dateRange').addEventListener('change', function() {
        const dateRange = this.value;
        filterOrdersByDate(dateRange);
    });

    // Order actions
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('reorder-btn') || e.target.closest('.reorder-btn')) {
            const orderCard = e.target.closest('.order-card');
            handleReorder(orderCard);
        }

        if (e.target.classList.contains('details-btn') || e.target.closest('.details-btn')) {
            const orderCard = e.target.closest('.order-card');
            showOrderDetails(orderCard);
        }
    });

    // Load more button
    document.querySelector('.load-more-btn').addEventListener('click', loadMoreOrders);

    // Modal controls
    document.getElementById('closeDetailsModal').addEventListener('click', closeOrderDetailsModal);
});

function filterOrders(filter) {
    const orderCards = document.querySelectorAll('.order-card');

    orderCards.forEach(card => {
        if (filter === 'all') {
            card.style.display = 'block';
        } else if (filter === 'rides' && card.classList.contains('ride-order')) {
            card.style.display = 'block';
        } else if (filter === 'food' && card.classList.contains('food-order')) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    // Hide empty date groups
    updateDateGroupVisibility();
}

function filterOrdersByDate(dateRange) {
    const dateGroups = document.querySelectorAll('.date-group');
    const now = new Date();

    dateGroups.forEach(group => {
        const groupDate = parseDateFromHeader(group.querySelector('.date-header').textContent);

        if (dateRange === 'all') {
            group.style.display = 'block';
        } else if (dateRange === 'today' && isToday(groupDate, now)) {
            group.style.display = 'block';
        } else if (dateRange === 'week' && isThisWeek(groupDate, now)) {
            group.style.display = 'block';
        } else if (dateRange === 'month' && isThisMonth(groupDate, now)) {
            group.style.display = 'block';
        } else if (dateRange === '3months' && isLast3Months(groupDate, now)) {
            group.style.display = 'block';
        } else {
            group.style.display = 'none';
        }
    });
}

function parseDateFromHeader(headerText) {
    if (headerText === 'Today') {
        return new Date();
    } else if (headerText === 'Yesterday') {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        return date;
    } else {
        // Parse date like "January 22, 2026"
        return new Date(headerText);
    }
}

function isToday(date, now) {
    return date.toDateString() === now.toDateString();
}

function isThisWeek(date, now) {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    return date >= weekStart && date <= weekEnd;
}

function isThisMonth(date, now) {
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
}

function isLast3Months(date, now) {
    const threeMonthsAgo = new Date(now);
    threeMonthsAgo.setMonth(now.getMonth() - 3);
    return date >= threeMonthsAgo;
}

function updateDateGroupVisibility() {
    const dateGroups = document.querySelectorAll('.date-group');
    dateGroups.forEach(group => {
        const visibleOrders = group.querySelectorAll('.order-card[style*="display: block"], .order-card:not([style*="display"])');
        if (visibleOrders.length === 0) {
            group.style.display = 'none';
        } else {
            group.style.display = 'block';
        }
    });
}

function handleReorder(orderCard) {
    if (orderCard.classList.contains('ride-order')) {
        // Redirect to book-ride page with pre-filled data
        alert('Redirecting to book ride page with similar preferences...');
        // In a real app, you'd store the order data and redirect
        // window.location.href = 'book-ride.html?reorder=' + orderId;
    } else if (orderCard.classList.contains('food-order')) {
        // Redirect to order-food page with pre-filled cart
        alert('Redirecting to order food page with same items...');
        // In a real app, you'd store the order data and redirect
        // window.location.href = 'order-food.html?reorder=' + orderId;
    }
}

function showOrderDetails(orderCard) {
    const modal = document.getElementById('orderDetailsModal');
    const content = document.getElementById('orderDetailsContent');

    // Extract order information
    const orderTitle = orderCard.querySelector('h4').textContent;
    const orderTime = orderCard.querySelector('.order-time').textContent;
    const orderStatus = orderCard.querySelector('.order-status').textContent;
    const orderAmount = orderCard.querySelector('.order-amount').textContent;
    const isRideOrder = orderCard.classList.contains('ride-order');

    // Create detailed content
    let detailsHTML = `
        <div class="order-details-content">
            <div class="detail-section">
                <h4>Order Summary</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span>Order Type:</span>
                        <span>${isRideOrder ? 'Ride' : 'Food Delivery'}</span>
                    </div>
                    <div class="detail-item">
                        <span>Order Time:</span>
                        <span>${orderTime}</span>
                    </div>
                    <div class="detail-item">
                        <span>Status:</span>
                        <span>${orderStatus}</span>
                    </div>
                    <div class="detail-item">
                        <span>Total Amount:</span>
                        <span>${orderAmount}</span>
                    </div>
                </div>
            </div>

            <div class="detail-section">
                <h4>Order Details</h4>
                <div class="detail-grid">
    `;

    // Add specific details based on order type
    const detailRows = orderCard.querySelectorAll('.detail-row');
    detailRows.forEach(row => {
        const label = row.querySelector('span:first-child').textContent;
        const value = row.querySelector('span:last-child').textContent;
        detailsHTML += `
            <div class="detail-item">
                <span>${label}</span>
                <span>${value}</span>
            </div>
        `;
    });

    detailsHTML += `
                </div>
            </div>

            <div class="detail-section">
                <h4>Order Timeline</h4>
                <div class="order-timeline">
    `;

    // Add timeline based on order type and status
    if (isRideOrder) {
        detailsHTML += `
            <div class="timeline-item active">
                <div class="timeline-content">
                    <div class="timeline-title">Ride Requested</div>
                    <div class="timeline-time">${orderTime}</div>
                </div>
            </div>
            <div class="timeline-item active">
                <div class="timeline-content">
                    <div class="timeline-title">Driver Assigned</div>
                    <div class="timeline-time">2 min later</div>
                </div>
            </div>
            <div class="timeline-item active">
                <div class="timeline-content">
                    <div class="timeline-title">Ride Started</div>
                    <div class="timeline-time">5 min later</div>
                </div>
            </div>
            <div class="timeline-item active">
                <div class="timeline-content">
                    <div class="timeline-title">Ride Completed</div>
                    <div class="timeline-time">30 min later</div>
                </div>
            </div>
        `;
    } else {
        detailsHTML += `
            <div class="timeline-item active">
                <div class="timeline-content">
                    <div class="timeline-title">Order Placed</div>
                    <div class="timeline-time">${orderTime}</div>
                </div>
            </div>
            <div class="timeline-item active">
                <div class="timeline-content">
                    <div class="timeline-title">Order Confirmed</div>
                    <div class="timeline-time">2 min later</div>
                </div>
            </div>
            <div class="timeline-item active">
                <div class="timeline-content">
                    <div class="timeline-title">Being Prepared</div>
                    <div class="timeline-time">5 min later</div>
                </div>
            </div>
            <div class="timeline-item active">
                <div class="timeline-content">
                    <div class="timeline-title">Out for Delivery</div>
                    <div class="timeline-time">20 min later</div>
                </div>
            </div>
            <div class="timeline-item active">
                <div class="timeline-content">
                    <div class="timeline-title">Delivered</div>
                    <div class="timeline-time">35 min later</div>
                </div>
            </div>
        `;
    }

    detailsHTML += `
                </div>
            </div>
        </div>
    `;

    content.innerHTML = detailsHTML;
    modal.classList.add('open');
}

function closeOrderDetailsModal() {
    document.getElementById('orderDetailsModal').classList.remove('open');
}

function loadMoreOrders() {
    const loadBtn = document.querySelector('.load-more-btn');
    loadBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading...';
    loadBtn.disabled = true;

    // Simulate loading more orders
    setTimeout(() => {
        // In a real app, you'd fetch more orders from the server
        const newOrderHTML = `
            <div class="date-group">
                <h3 class="date-header">January 20, 2026</h3>
                <div class="order-card ride-order">
                    <div class="order-header">
                        <div class="order-icon">
                            <i class="fa-solid fa-car"></i>
                        </div>
                        <div class="order-basic-info">
                            <h4>Ride to City Center</h4>
                            <p class="order-time">4:20 PM</p>
                        </div>
                        <div class="order-status completed">
                            <i class="fa-solid fa-check"></i> Completed
                        </div>
                    </div>
                    <div class="order-details">
                        <div class="detail-row">
                            <span>Distance:</span>
                            <span>6.8 km</span>
                        </div>
                        <div class="detail-row">
                            <span>Duration:</span>
                            <span>22 min</span>
                        </div>
                        <div class="detail-row">
                            <span>Vehicle:</span>
                            <span>Standard Ride</span>
                        </div>
                        <div class="detail-row">
                            <span>Driver:</span>
                            <span>Sarah Johnson (4.6★)</span>
                        </div>
                    </div>
                    <div class="order-footer">
                        <div class="order-amount">2,100 XAF</div>
                        <div class="order-actions">
                            <button class="action-btn reorder-btn">
                                <i class="fa-solid fa-redo"></i> Reorder
                            </button>
                            <button class="action-btn details-btn">
                                <i class="fa-solid fa-info-circle"></i> Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const ordersList = document.querySelector('.orders-list');
        ordersList.insertAdjacentHTML('beforeend', newOrderHTML);

        loadBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Load More Orders';
        loadBtn.disabled = false;
    }, 1500);
}