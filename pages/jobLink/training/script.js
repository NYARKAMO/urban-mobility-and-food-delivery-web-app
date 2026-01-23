const modulesContainer = document.getElementById("modulesContainer");

// Sample training modules
const trainingModules = [
    {
        title: "CV & Resume Building",
        description: "Learn to create a professional CV that stands out to employers.",
        link: "#"
    },
    {
        title: "Soft Skills Development",
        description: "Improve communication, teamwork, and problem-solving skills.",
        link: "#"
    },
    {
        title: "Interview Preparation",
        description: "Practice common interview questions and learn strategies to succeed.",
        link: "#"
    },
    {
        title: "Basic Digital Literacy",
        description: "Enhance your computer and internet skills for modern workplaces.",
        link: "#"
    },
    {
        title: "Freelancing Essentials",
        description: "Learn how to start freelancing, bid on projects, and manage clients.",
        link: "#"
    }
];

// Render modules
trainingModules.forEach(module => {
    const div = document.createElement("div");
    div.classList.add("module-card");

    div.innerHTML = `
        <h3>${module.title}</h3>
        <p>${module.description}</p>
        <button onclick="window.location.href='${module.link}'">Start Module</button>
    `;

    modulesContainer.appendChild(div);
});
