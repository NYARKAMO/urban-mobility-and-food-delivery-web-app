const dateInput = document.getElementById("dateInput");
const timeInput = document.getElementById("timeInput");
const scheduleBtn = document.getElementById("scheduleBtn");
const confirmationMsg = document.getElementById("confirmationMsg");

// Set minimum date to today
const today = new Date().toISOString().split("T")[0];
dateInput.setAttribute("min", today);

scheduleBtn.addEventListener("click", () => {
    const selectedDate = dateInput.value;
    const selectedTime = timeInput.value;

    if (!selectedDate || !selectedTime) {
        alert("Please select both a date and time.");
        return;
    }

    // Display confirmation
    confirmationMsg.style.display = "block";
    confirmationMsg.innerHTML = `
        ✅ Interview Scheduled on <strong>${selectedDate}</strong> at <strong>${selectedTime}</strong>.<br>
        You will receive a link to join via Zoom/Google Meet.
    `;

    // Clear selections
    dateInput.value = "";
    timeInput.value = "";
});
