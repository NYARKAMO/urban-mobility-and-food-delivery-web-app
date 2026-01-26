// Order Food JavaScript

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

// Cart functionality
let cart = [];
let currentRestaurant = 'italian';
let deliveryFee = 500;

document.addEventListener('DOMContentLoaded', function() {
    // Restaurant selection
    const restaurantCards = document.querySelectorAll('.restaurant-card');
    restaurantCards.forEach(card => {
        card.addEventListener('click', function() {
            restaurantCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');

            currentRestaurant = this.dataset.restaurant;
            updateDeliveryFee();
            filterMenuByRestaurant();
            filterMenuByCategory('all');
        });
    });

    // Category filtering
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const category = this.dataset.category;
            filterMenuByCategory(category);
        });
    });

    // Add to cart functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const item = e.target.dataset.item;
            const price = parseInt(e.target.dataset.price);
            const name = e.target.parentElement.querySelector('h4').textContent;
            const image = e.target.parentElement.parentElement.querySelector('.menu-image').src;

            addToCart(item, name, price, image);
        }
    });

    // Cart toggle
    document.getElementById('cartBtn').addEventListener('click', toggleCart);
    document.getElementById('closeCart').addEventListener('click', toggleCart);

    // Checkout
    document.getElementById('checkoutBtn').addEventListener('click', openOrderModal);

    // Modal controls
    document.getElementById('closeModal').addEventListener('click', closeOrderModal);
    document.getElementById('confirmOrderBtn').addEventListener('click', confirmOrder);

    // Payment option selection
    const paymentOptions = document.querySelectorAll('.payment-option input[type="radio"]');
    paymentOptions.forEach(option => {
        option.addEventListener('change', function() {
            document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('active'));
            this.parentElement.classList.add('active');
        });
    });

    // Initialize
    updateDeliveryFee();
    filterMenuByRestaurant();
});

function updateDeliveryFee() {
    const restaurantCard = document.querySelector(`.restaurant-card[data-restaurant="${currentRestaurant}"]`);
    const feeText = restaurantCard.querySelector('.delivery-fee').textContent;
    deliveryFee = parseInt(feeText.replace(' XAF', ''));

    document.getElementById('cartDelivery').textContent = deliveryFee + ' XAF';
    document.getElementById('orderDelivery').textContent = deliveryFee + ' XAF';
    updateCartDisplay();
}

function filterMenuByRestaurant() {
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach(item => {
        if (item.dataset.restaurant === currentRestaurant) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function filterMenuByCategory(category) {
    const menuItems = document.querySelectorAll(`.menu-item[data-restaurant="${currentRestaurant}"]`);

    menuItems.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function addToCart(itemId, name, price, image) {
    const existingItem = cart.find(item => item.id === itemId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: itemId,
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }

    updateCartDisplay();
    updateCartCount();
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartSubtotal.textContent = '0 XAF';
        cartTotal.textContent = '0 XAF';
        checkoutBtn.disabled = true;
        return;
    }

    let subtotal = 0;
    cartItems.innerHTML = '';

    cart.forEach(item => {
        subtotal += item.price * item.quantity;

        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <span class="cart-item-price">${item.price} XAF</span>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="changeQuantity('${item.id}', -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="changeQuantity('${item.id}', 1)">+</button>
            </div>
        `;
        cartItems.appendChild(itemElement);
    });

    cartSubtotal.textContent = subtotal + ' XAF';
    cartTotal.textContent = (subtotal + deliveryFee) + ' XAF';
    checkoutBtn.disabled = false;
}

function changeQuantity(itemId, change) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== itemId);
        }
        updateCartDisplay();
        updateCartCount();
    }
}

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('open');
}

function openOrderModal() {
    const modal = document.getElementById('orderModal');
    const orderSummaryItems = document.getElementById('orderSummaryItems');
    const orderSubtotal = document.getElementById('orderSubtotal');
    const orderTotal = document.getElementById('orderTotal');

    // Populate order summary
    orderSummaryItems.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        const itemElement = document.createElement('div');
        itemElement.className = 'summary-row';
        itemElement.innerHTML = `
            <span>${item.name} x${item.quantity}</span>
            <span>${item.price * item.quantity} XAF</span>
        `;
        orderSummaryItems.appendChild(itemElement);
    });

    orderSubtotal.textContent = subtotal + ' XAF';
    orderTotal.textContent = (subtotal + deliveryFee) + ' XAF';

    modal.classList.add('open');
}

function closeOrderModal() {
    document.getElementById('orderModal').classList.remove('open');
}

function confirmOrder() {
    const deliveryAddress = document.getElementById('deliveryAddress').value;
    const deliveryInstructions = document.getElementById('deliveryInstructions').value;
    const paymentMethod = document.querySelector('input[name="orderPayment"]:checked').value;

    if (!deliveryAddress.trim()) {
        alert('Please enter a delivery address');
        return;
    }

    // Here you would typically send the order to a server
    alert('Order placed successfully! You will receive a confirmation shortly.');

    // Clear cart and close modal
    cart = [];
    updateCartDisplay();
    updateCartCount();
    closeOrderModal();
    toggleCart();

    // Reset form
    document.getElementById('deliveryAddress').value = '';
    document.getElementById('deliveryInstructions').value = '';
}