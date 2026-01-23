// Sample Freelancing Projects (replace with backend API later)
const projects = [
    {
        title: "Build a Personal Portfolio Website",
        skill: "Web Development",
        budget: "Medium",
        experience: "Beginner",
        description: "Need a simple responsive portfolio.",
    },
    {
        title: "Logo Design for Clothing Brand",
        skill: "Graphic Design",
        budget: "High",
        experience: "Intermediate",
        description: "Looking for a creative minimalist logo.",
    },
    {
        title: "Write 10 Blog Articles",
        skill: "Writing",
        budget: "Low",
        experience: "Beginner",
        description: "Articles about tech trends and gadgets.",
    },
    {
        title: "Data Entry Specialist Needed",
        skill: "Data Entry",
        budget: "Low",
        experience: "Beginner",
        description: "Copy and organize data into spreadsheets.",
    },
    {
        title: "Run Facebook Ads Campaign",
        skill: "Digital Marketing",
        budget: "High",
        experience: "Expert",
        description: "Need help running engagement and sales ads.",
    }
];

const projectList = document.getElementById("projectList");

function displayProjects(list) {
    projectList.innerHTML = "";

    list.forEach(project => {
        const div = document.createElement("div");
        div.classList.add("project-card");

        div.innerHTML = `
            <h3>${project.title}</h3>
            <p><strong>Skill Required:</strong> ${project.skill}</p>
            <p><strong>Budget:</strong> ${project.budget}</p>
            <p><strong>Experience:</strong> ${project.experience}</p>
            <p>${project.description}</p>

            <div class="actions">
                <button class="save-btn">Save</button>
                <button class="bid-btn">Bid Now</button>
            </div>
        `;

        projectList.appendChild(div);
    });
}

displayProjects(projects);

document.getElementById("filterBtn").onclick = () => {
    const keyword = document.getElementById("searchInput").value.toLowerCase();
    const skill = document.getElementById("skillFilter").value;
    const budget = document.getElementById("budgetFilter").value;
    const exp = document.getElementById("experienceFilter").value;

    const filtered = projects.filter(project => {
        return (
            project.title.toLowerCase().includes(keyword) ||
            project.skill.toLowerCase().includes(keyword)
        ) && (
            (skill === "" || project.skill === skill) &&
            (budget === "" || project.budget === budget) &&
            (exp === "" || project.experience === exp)
        );
    });

    displayProjects(filtered);
};
