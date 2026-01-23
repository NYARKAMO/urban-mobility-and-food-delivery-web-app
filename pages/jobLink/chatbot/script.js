const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const chatBox = document.getElementById("chatBox");

// Simple bot responses
function botResponse(msg) {
    let reply = "Sorry, I didn't understand that.";

    const text = msg.toLowerCase();
    if (text.includes("hello") || text.includes("hi")) reply = "Hello! How can I assist you today?";
    if (text.includes("job") || text.includes("apply")) reply = "You can browse jobs on the Jobs page and apply directly.";
    if (text.includes("freelance")) reply = "Check the Freelance page to see available projects.";
    if (text.includes("internship")) reply = "Explore internships on the Internships page.";
    if (text.includes("training")) reply = "Visit the Training section to enhance your skills.";
    return reply;
}

function addMessage(text, sender) {
    const div = document.createElement("div");
    div.classList.add("message", sender === "user" ? "user-message" : "bot-message");
    div.innerText = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = messageInput.value.trim();
    if (!msg) return;

    // Add user message
    addMessage(msg, "user");
    messageInput.value = "";

    // Add bot response after short delay
    setTimeout(() => {
        const reply = botResponse(msg);
        addMessage(reply, "bot");
    }, 600);
});
