// Load user name from localStorage (set after login)
let user = localStorage.getItem("username") || "User";
document.getElementById("userName").innerText = user;

// Fake data (replace with real backend later)
document.getElementById("savedJobs").innerText = 4;
document.getElementById("appliedJobs").innerText = 2;
document.getElementById("freelanceCount").innerText = 3;
document.getElementById("internshipCount").innerText = 1;

// Logout button
document.querySelector(".logout-btn").onclick = () => {
    alert("Logged out!");
    window.location.href = "../auth/login.html";
};
