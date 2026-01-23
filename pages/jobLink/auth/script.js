// Switch tabs
const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const switchToRegister = document.getElementById("switchToRegister");
const switchToLogin = document.getElementById("switchToLogin");

loginTab.onclick = () => {
    loginTab.classList.add("active");
    registerTab.classList.remove("active");
    loginForm.classList.add("active");
    registerForm.classList.remove("active");
};

registerTab.onclick = () => {
    registerTab.classList.add("active");
    loginTab.classList.remove("active");
    registerForm.classList.add("active");
    loginForm.classList.remove("active");
};

// Text link switching
switchToRegister.onclick = () => registerTab.onclick();
switchToLogin.onclick = () => loginTab.onclick();

// Login form submit
loginForm.onsubmit = (e) => {
    e.preventDefault();
    let email = document.getElementById("loginEmail").value;
    let pass = document.getElementById("loginPassword").value;

    alert("Login Successful!\nEmail: " + email);
};

// Register form submit
registerForm.onsubmit = (e) => {
    e.preventDefault();
    let name = document.getElementById("regName").value;
    let email = document.getElementById("regEmail").value;

    alert("Account Created!\nWelcome: " + name);
};
