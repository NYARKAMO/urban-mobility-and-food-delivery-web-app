// Wallet Page JavaScript

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

// Wallet functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add money modal
    const addMoneyBtn = document.querySelector('.add-money-btn');
    const addMoneyModal = document.getElementById('addMoneyModal');
    const closeAddMoneyModal = document.getElementById('closeAddMoneyModal');
    const confirmAddMoney = document.getElementById('confirmAddMoney');

    addMoneyBtn.addEventListener('click', () => addMoneyModal.classList.add('open'));
    closeAddMoneyModal.addEventListener('click', () => addMoneyModal.classList.remove('open'));

    // Amount selection
    const amountBtns = document.querySelectorAll('.amount-btn');
    const customAmount = document.getElementById('customAmount');

    amountBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            amountBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            customAmount.value = '';
        });
    });

    customAmount.addEventListener('input', function() {
        amountBtns.forEach(b => b.classList.remove('active'));
    });

    // Confirm add money
    confirmAddMoney.addEventListener('click', function() {
        let amount = 0;

        // Get selected amount
        const activeAmountBtn = document.querySelector('.amount-btn.active');
        if (activeAmountBtn) {
            amount = parseInt(activeAmountBtn.dataset.amount);
        } else if (customAmount.value) {
            amount = parseInt(customAmount.value);
        }

        if (amount < 1000) {
            alert('Minimum amount is 1,000 XAF');
            return;
        }

        // Get selected payment method
        const selectedPayment = document.querySelector('input[name="addMoneyPayment"]:checked').value;

        // Simulate adding money
        addMoneyToWallet(amount, selectedPayment);
        addMoneyModal.classList.remove('open');

        // Reset form
        amountBtns.forEach(b => b.classList.remove('active'));
        customAmount.value = '';
    });

    // Quick actions
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.dataset.action;
            handleQuickAction(action);
        });
    });

    // Payment method management
    setupPaymentMethodManagement();

    // Send money functionality
    const sendMoneyBtn = document.querySelector('.send-money-btn');
    sendMoneyBtn.addEventListener('click', function() {
        const recipient = prompt('Enter recipient phone number or email:');
        if (recipient) {
            const amount = prompt('Enter amount to send (XAF):');
            if (amount && parseInt(amount) > 0) {
                sendMoney(recipient, parseInt(amount));
            }
        }
    });
});

function addMoneyToWallet(amount, paymentMethod) {
    // Get current balance
    const balanceElement = document.querySelector('.amount');
    const currentBalance = parseInt(balanceElement.textContent.replace(',', ''));

    // Update balance
    const newBalance = currentBalance + amount;
    balanceElement.textContent = newBalance.toLocaleString();

    // Add transaction to history
    addTransactionToHistory('Wallet Top-up', `+${amount.toLocaleString()} XAF`, 'positive', 'plus');

    alert(`Successfully added ${amount.toLocaleString()} XAF to your wallet!`);
}

function sendMoney(recipient, amount) {
    // Get current balance
    const balanceElement = document.querySelector('.amount');
    const currentBalance = parseInt(balanceElement.textContent.replace(',', ''));

    if (amount > currentBalance) {
        alert('Insufficient balance!');
        return;
    }

    // Update balance
    const newBalance = currentBalance - amount;
    balanceElement.textContent = newBalance.toLocaleString();

    // Add transaction to history
    addTransactionToHistory(`Money Sent to ${recipient}`, `-${amount.toLocaleString()} XAF`, 'negative', 'paper-plane');

    alert(`Successfully sent ${amount.toLocaleString()} XAF to ${recipient}!`);
}

function addTransactionToHistory(description, amount, type, icon) {
    const transactionList = document.querySelector('.transaction-list');
    const now = new Date();

    const transactionElement = document.createElement('div');
    transactionElement.className = 'transaction-item';
    transactionElement.innerHTML = `
        <div class="transaction-icon">
            <i class="fa-solid fa-${icon}"></i>
        </div>
        <div class="transaction-info">
            <h4>${description}</h4>
            <p>Just now</p>
        </div>
        <div class="transaction-amount ${type}">
            ${amount}
        </div>
    `;

    // Insert at the beginning of the list
    transactionList.insertBefore(transactionElement, transactionList.firstChild);
}

function handleQuickAction(action) {
    switch(action) {
        case 'add-card':
            alert('Add new card functionality would open here.');
            break;
        case 'mobile-money':
            alert('Mobile money integration would open here.');
            break;
        case 'bank-transfer':
            alert('Bank transfer functionality would open here.');
            break;
        case 'crypto':
            alert('Cryptocurrency payment option would open here.');
            break;
    }
}

function setupPaymentMethodManagement() {
    // Set default payment method
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('set-default-btn')) {
            // Remove default from all methods
            document.querySelectorAll('.payment-method-card').forEach(card => {
                card.classList.remove('active');
                const defaultBadge = card.querySelector('.default-badge');
                if (defaultBadge) defaultBadge.remove();
            });

            // Set new default
            const card = e.target.closest('.payment-method-card');
            card.classList.add('active');

            const methodActions = card.querySelector('.method-actions');
            const defaultBadge = document.createElement('span');
            defaultBadge.className = 'default-badge';
            defaultBadge.textContent = 'Default';
            methodActions.insertBefore(defaultBadge, methodActions.firstChild);

            alert('Default payment method updated!');
        }

        if (e.target.classList.contains('edit-method-btn')) {
            alert('Edit payment method functionality would open here.');
        }
    });

    // Add new payment method
    const addMethodBtn = document.querySelector('.add-method-btn');
    addMethodBtn.addEventListener('click', function() {
        const methodType = prompt('Choose payment method type:\n1. Credit Card\n2. Mobile Money\n3. Bank Account');
        if (methodType) {
            switch(methodType) {
                case '1':
                    alert('Credit card addition form would open here.');
                    break;
                case '2':
                    alert('Mobile money setup would open here.');
                    break;
                case '3':
                    alert('Bank account linking would open here.');
                    break;
            }
        }
    });
}