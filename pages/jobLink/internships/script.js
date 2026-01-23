const searchInput = document.getElementById("searchInput");
const locationFilter = document.getElementById("locationFilter");
const typeFilter = document.getElementById("typeFilter");
const internships = document.querySelectorAll(".internship-card");

// Filtering Function
function filterInternships() {
    const searchText = searchInput.value.toLowerCase();
    const selectedLocation = locationFilter.value;
    const selectedType = typeFilter.value;

    internships.forEach(card => {
        const title = card.querySelector("h2").textContent.toLowerCase();
        const location = card.getAttribute("data-location");
        const type = card.getAttribute("data-type");

        const matchSearch = title.includes(searchText);
        const matchLocation = selectedLocation === "" || location === selectedLocation;
        const matchType = selectedType === "" || type === selectedType;

        card.style.display = (matchSearch && matchLocation && matchType) ? "block" : "none";
    });
}

searchInput.addEventListener("input", filterInternships);
locationFilter.addEventListener("change", filterInternships);
typeFilter.addEventListener("change", filterInternships);
