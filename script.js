// Bottom nav functionality
const navItems = document.querySelectorAll(".bottom-nav div:not(.fab)");
const sections = document.querySelectorAll(".section");

navItems.forEach(item => {
  item.addEventListener("click", () => {
    // Set active tab
    const activeNav = document.querySelector(".bottom-nav .active");
    if(activeNav) activeNav.classList.remove("active");
    item.classList.add("active");

    // Show corresponding section
    sections.forEach(sec => sec.classList.remove("active"));
    const target = document.getElementById(item.dataset.name);
    if(target) target.classList.add("active");
  });
});

// Side Navigation functions
function openNav() {
    const sidenav = document.getElementById("mySidenav");
    sidenav.style.width = "280px";
    sidenav.classList.add("sidenav-open");
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

function closeNav() {
    const sidenav = document.getElementById("mySidenav");
    sidenav.style.width = "0";
    sidenav.classList.remove("sidenav-open");
    document.body.style.backgroundColor = "#f3f3f3";
}

// Close nav when clicking outside
document.addEventListener('click', function(event) {
    const sidenav = document.getElementById("mySidenav");
    const menuToggle = document.querySelector('.menu-toggle');

    if (sidenav && menuToggle && !sidenav.contains(event.target) && !menuToggle.contains(event.target) && (sidenav.style.width === "280px" || sidenav.classList.contains("sidenav-open"))) {
        closeNav();
    }
});

// Home toggle buttons (Ride Map / Restaurants)
const homeButtons = document.querySelectorAll(".home-toggle button");
const mapContent = document.getElementById("MapContent");
const restaurantContent = document.getElementById("RestaurantContent");

homeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    homeButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    if(btn.dataset.show === "Map"){
      mapContent.style.display = "block";
      restaurantContent.style.display = "none";
    } else {
      mapContent.style.display = "none";
      restaurantContent.style.display = "block";
    }
  });
});

// FAB functionality (context-sensitive)
const fab = document.querySelector(".fab");
fab.addEventListener("click", () => {
  const homeActive = document.querySelector(".bottom-nav .active").dataset.name === "Home";
  if(homeActive){
    const mapActive = document.querySelector(".home-toggle button.active").dataset.show === "Map";
    if(mapActive){
      alert("Quick Ride Booking triggered!");
    } else {
      alert("Open Food Cart!");
    }
  } else {
    alert("FAB action not available in this tab.");
  }
});
