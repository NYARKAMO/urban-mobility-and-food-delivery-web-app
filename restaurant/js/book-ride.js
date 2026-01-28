// Book Ride JavaScript

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

// Ride option selection
document.addEventListener('DOMContentLoaded', function() {
    // Ride type selection
    const rideOptions = document.querySelectorAll('.ride-option');
    rideOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            rideOptions.forEach(opt => opt.classList.remove('active'));
            // Add active class to clicked option
            this.classList.add('active');
            // Check the radio button
            const radio = this.querySelector('input[type="radio"]');
            radio.checked = true;
        });
    });

    // Payment option selection
    const paymentOptions = document.querySelectorAll('.payment-option');
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            paymentOptions.forEach(opt => opt.classList.remove('active'));
            // Add active class to clicked option
            this.classList.add('active');
            // Check the radio button
            const radio = this.querySelector('input[type="radio"]');
            radio.checked = true;
        });
    });

    // Form submission
    const bookingForm = document.getElementById('bookingForm');
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(bookingForm);
        const bookingData = {
            pickup: formData.get('pickup'),
            destination: formData.get('destination'),
            rideType: formData.get('rideType'),
            date: formData.get('date'),
            time: formData.get('time'),
            passengers: formData.get('passengers'),
            instructions: formData.get('instructions'),
            payment: formData.get('payment')
        };

        // Calculate estimated fare (simple calculation)
        let baseFare = 500; // XAF
        if (bookingData.rideType === 'premium') {
            baseFare = 12000;
        } else if (bookingData.rideType === 'xl') {
            baseFare = 8000;
        }

        // Add passenger surcharge
        const passengerSurcharge = (parseInt(bookingData.passengers) - 1) * 200;
        const estimatedFare = baseFare + passengerSurcharge;

        // Show booking summary
        showBookingSummary(bookingData, estimatedFare);
    });
});

function showBookingSummary(data, fare) {
    // Hide form
    document.getElementById('bookingForm').style.display = 'none';

    // Show summary
    const summary = document.getElementById('bookingSummary');
    summary.style.display = 'block';

    // Populate summary
    document.getElementById('summaryPickup').textContent = data.pickup;
    document.getElementById('summaryDestination').textContent = data.destination;
    document.getElementById('summaryRideType').textContent = capitalizeFirstLetter(data.rideType) + ' Ride';
    document.getElementById('summaryDateTime').textContent = formatDateTime(data.date, data.time);
    document.getElementById('summaryPassengers').textContent = data.passengers;
    document.getElementById('summaryFare').textContent = fare + ' XAF';

    // Scroll to summary
    summary.scrollIntoView({ behavior: 'smooth' });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatDateTime(date, time) {
    const dateObj = new Date(date + 'T' + time);
    return dateObj.toLocaleDateString() + ' at ' + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

// Set minimum date to today
document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    dateInput.value = today;

    // Set default time to current time + 30 minutes
    const timeInput = document.getElementById('time');
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    const defaultTime = now.toTimeString().slice(0, 5);
    timeInput.value = defaultTime;
});