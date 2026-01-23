// Dummy Job Data (You can replace with backend API later)
const jobs = [
    {
        title: "Junior Web Developer",
        company: "TechLabs",
        location: "Cameroon",
        type: "Full-time",
        experience: "Entry Level",
        description: "We are hiring a junior web developer...",
    },
    {
        title: "Graphic Design Intern",
        company: "Creative Studio",
        location: "Remote",
        type: "Internship",
        experience: "No Experience",
        description: "Perfect for students and beginners.",
    },
    {
        title: "Customer Support Officer",
        company: "FastServe",
        location: "Nigeria",
        type: "Full-time",
        experience: "Intermediate",
        description: "Manage customer inquiries via phone and email.",
    },
    {
        title: "Freelance Writer",
        company: "MediaPlus",
        location: "Remote",
        type: "Contract",
        experience: "No Experience",
        description: "Write blog articles and earn per task.",
    }
];

const jobList = document.getElementById("jobList");

function displayJobs(list) {
    jobList.innerHTML = "";

    list.forEach(job => {
        const div = document.createElement("div");
        div.classList.add("job-card");

        div.innerHTML = `
            <h3>${job.title}</h3>
            <p><strong>Company:</strong> ${job.company}</p>
            <p><strong>Location:</strong> ${job.location}</p>
            <p><strong>Job Type:</strong> ${job.type}</p>
            <p><strong>Experience:</strong> ${job.experience}</p>
            <p>${job.description}</p>

            <div class="actions">
                <button class="save-btn">Save</button>
                <button class="apply-btn">Apply Now</button>
            </div>
        `;

        jobList.appendChild(div);
    });
}

displayJobs(jobs);

// Filtering
document.getElementById("filterBtn").onclick = () => {
    const keyword = document.getElementById("searchInput").value.toLowerCase();
    const loc = document.getElementById("locationFilter").value;
    const exp = document.getElementById("experienceFilter").value;
    const type = document.getElementById("typeFilter").value;

    const filtered = jobs.filter(job => {
        return (
            job.title.toLowerCase().includes(keyword) &&
            (loc === "" || job.location === loc) &&
            (exp === "" || job.experience === exp) &&
            (type === "" || job.type === type)
        );
    });

    displayJobs(filtered);
};
