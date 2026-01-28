// Profile Page JavaScript

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

// Profile functionality
document.addEventListener('DOMContentLoaded', function() {
    // Form submission
    const personalForm = document.getElementById('personalForm');
    personalForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(personalForm);
        const profileData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            dateOfBirth: formData.get('dateOfBirth')
        };

        // Here you would typically send the data to a server
        alert('Profile updated successfully!');

        // Update the display name in navigation
        updateNavigationName(profileData.firstName + ' ' + profileData.lastName);
    });

    // Avatar upload simulation
    const editAvatarBtn = document.querySelector('.edit-avatar-btn');
    editAvatarBtn.addEventListener('click', function() {
        // In a real app, this would open a file picker
        alert('Avatar upload feature would open here. For demo purposes, avatar remains unchanged.');
    });

    // Location management
    setupLocationManagement();

    // Emergency contact management
    setupEmergencyContactManagement();

    // Preference toggles
    setupPreferenceToggles();
});

function updateNavigationName(fullName) {
    const navName = document.querySelector('.sidenav-user h5');
    if (navName) {
        navName.textContent = fullName;
    }
}

function setupLocationManagement() {
    const addLocationBtn = document.querySelector('.add-location-btn');
    addLocationBtn.addEventListener('click', function() {
        const locationName = prompt('Enter location name (e.g., Home, Work):');
        if (locationName) {
            const locationAddress = prompt('Enter address:');
            if (locationAddress) {
                addLocation(locationName, locationAddress);
            }
        }
    });

    // Edit and delete functionality for existing locations
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('edit-btn') && e.target.closest('.location-item')) {
            const locationItem = e.target.closest('.location-item');
            const locationName = locationItem.querySelector('h4').textContent;
            const locationAddress = locationItem.querySelector('p').textContent;

            const newName = prompt('Edit location name:', locationName);
            if (newName) {
                const newAddress = prompt('Edit address:', locationAddress);
                if (newAddress) {
                    locationItem.querySelector('h4').textContent = newName;
                    locationItem.querySelector('p').textContent = newAddress;
                }
            }
        }

        if (e.target.classList.contains('delete-btn') && e.target.closest('.location-item')) {
            if (confirm('Are you sure you want to delete this location?')) {
                e.target.closest('.location-item').remove();
            }
        }
    });
}

function addLocation(name, address) {
    const locationsList = document.querySelector('.locations-list');
    const addBtn = locationsList.querySelector('.add-location-btn');

    const locationElement = document.createElement('div');
    locationElement.className = 'location-item';
    locationElement.innerHTML = `
        <div class="location-info">
            <h4>${name}</h4>
            <p>${address}</p>
        </div>
        <div class="location-actions">
            <button class="edit-btn"><i class="fa-solid fa-edit"></i></button>
            <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
        </div>
    `;

    locationsList.insertBefore(locationElement, addBtn);
}

function setupEmergencyContactManagement() {
    const addContactBtn = document.querySelector('.add-contact-btn');
    addContactBtn.addEventListener('click', function() {
        const contactName = prompt('Enter contact name:');
        if (contactName) {
            const relationship = prompt('Enter relationship (e.g., Brother, Friend):');
            if (relationship) {
                const phoneNumber = prompt('Enter phone number:');
                if (phoneNumber) {
                    addEmergencyContact(contactName, relationship, phoneNumber);
                }
            }
        }
    });

    // Edit and delete functionality for existing contacts
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('edit-btn') && e.target.closest('.contact-item')) {
            const contactItem = e.target.closest('.contact-item');
            const contactName = contactItem.querySelector('h4').textContent;
            const contactDetails = contactItem.querySelector('p').textContent;
            const [relationship, phone] = contactDetails.split(' - ');

            const newName = prompt('Edit contact name:', contactName);
            if (newName) {
                const newRelationship = prompt('Edit relationship:', relationship);
                if (newRelationship) {
                    const newPhone = prompt('Edit phone number:', phone);
                    if (newPhone) {
                        contactItem.querySelector('h4').textContent = newName;
                        contactItem.querySelector('p').textContent = `${newRelationship} - ${newPhone}`;
                    }
                }
            }
        }

        if (e.target.classList.contains('delete-btn') && e.target.closest('.contact-item')) {
            if (confirm('Are you sure you want to delete this emergency contact?')) {
                e.target.closest('.contact-item').remove();
            }
        }
    });
}

function addEmergencyContact(name, relationship, phone) {
    const contactsList = document.querySelector('.emergency-contacts');
    const addBtn = contactsList.querySelector('.add-contact-btn');

    const contactElement = document.createElement('div');
    contactElement.className = 'contact-item';
    contactElement.innerHTML = `
        <div class="contact-info">
            <h4>${name}</h4>
            <p>${relationship} - ${phone}</p>
        </div>
        <div class="contact-actions">
            <button class="edit-btn"><i class="fa-solid fa-edit"></i></button>
            <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
        </div>
    `;

    contactsList.insertBefore(contactElement, addBtn);
}

function setupPreferenceToggles() {
    const checkboxes = document.querySelectorAll('.preference-label input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Here you would typically save the preference to a server
            const preferenceName = this.parentElement.textContent.trim();
            const isEnabled = this.checked;

            console.log(`${preferenceName}: ${isEnabled ? 'Enabled' : 'Disabled'}`);
            // In a real app, you'd send this to your backend
        });
    });
}