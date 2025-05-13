const nameInput = document.getElementById("name-input");
const bioInput = document.getElementById("bio-input");
const projectTitle = document.getElementById("project-title");
const projectDescription = document.getElementById("project-description");
const projectTech = document.getElementById("project-tech");
const projectLink = document.getElementById("project-link");
const addProjectButton = document.getElementById("add-project");
const projectsList = document.getElementById("projects-list");

nameInput.addEventListener("input", () => {
  document.getElementById("preview-name").textContent =
    nameInput.value || "Your Name";
});

bioInput.addEventListener("input", () => {
  document.getElementById("preview-bio").textContent =
    bioInput.value || "Short bio will appear here.";
});
// #######################################
// #######################################
// #######################################
addProjectButton.addEventListener("click", () => {
  const title = projectTitle.value.trim();
  const description = projectDescription.value.trim();
  const techUsed = projectTech.value.trim();
  const link = projectLink.value.trim();

  if (!title || !description) {
    alert("Title and description are required!");
    return;
  }

  const projectCard = document.createElement("div");
  projectCard.classList.add("project-card", "roll-in-left");

  projectCard.innerHTML = `
    <h3>${title}</h3>
    <p>${description}</p>
    <p><strong>Tech Used:</strong> ${techUsed}</p>
    <p><a href="${
      link.startsWith("http") ? link : "https://" + link
    }" target="_blank">View Project</a></p>
    <button class="delete-btn">Delete</button>
    <button class="edit-btn">Edit</button>
  `;

  const deleteBtn = projectCard.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", () => {
  projectCard.classList.add("rotate-out-center");
  projectCard.addEventListener("animationend", () => {
    projectCard.remove();
    saveToLocalStorage(); // Important to update localStorage after deletion
  }, { once: true });
  });

  const editBtn = projectCard.querySelector(".edit-btn");
  editBtn.addEventListener("click", () => {
    // Pre-fill the input fields with the current project data
    projectTitle.value = title;
    projectDescription.value = description;
    projectTech.value = techUsed;
    projectLink.value = link;

    // Remove the current project card
    projectCard.remove();
    saveToLocalStorage(); // Update localStorage after editing the card
  });

  projectsList.appendChild(projectCard);

  projectTitle.value = "";
  projectDescription.value = "";
  projectTech.value = "";
  projectLink.value = "";
});

function saveToLocalStorage() {
  const data = {
    name: nameInput.value,
    bio: bioInput.value,
    projects: Array.from(projectsList.children).map((card) => {
      return {
        title: card.querySelector("h3").textContent,
        description: card.querySelectorAll("p")[0].textContent,
        techUsed: card
          .querySelectorAll("p")[1]
          .textContent.replace("Tech Used: ", ""),
        link: card.querySelector("a").href,
      };
    }),
  };
  localStorage.setItem("portfolioData", JSON.stringify(data));
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem("portfolioData");
  if (!saved) return; 

  const data = JSON.parse(saved);

  nameInput.value = data.name || "";
  bioInput.value = data.bio || "";
  document.getElementById("preview-name").textContent =
    data.name || "Your Name";
  document.getElementById("preview-bio").textContent =
    data.bio || "Short bio will appear here.";

  data.projects.forEach((proj) => {
    const projectCard = document.createElement("div");
    projectCard.classList.add("project-card");
    projectCard.innerHTML = `
      <h3>${proj.title}</h3>
      <p>${proj.description}</p>
      <p><strong>Tech Used:</strong> ${proj.techUsed}</p>
      <p><a href="${proj.link}" target="_blank">View Project</a></p>
      <button class="delete-btn">Delete</button>
      <button class="edit-btn">Edit</button>
    `;

    const deleteBtn = projectCard.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => {
    projectCard.classList.add("rotate-out-center");
    projectCard.addEventListener("animationend", () => {
      projectCard.remove();
      saveToLocalStorage();
  }, { once: true });
    });

    const editBtn = projectCard.querySelector(".edit-btn");
    editBtn.addEventListener("click", () => {
      projectTitle.value = proj.title;
      projectDescription.value = proj.description;
      projectTech.value = proj.techUsed;
      projectLink.value = proj.link;

      projectCard.remove();
      saveToLocalStorage();
    });

    projectsList.appendChild(projectCard);
  });
}

nameInput.addEventListener("input", saveToLocalStorage);
bioInput.addEventListener("input", saveToLocalStorage);

addProjectButton.addEventListener("click", () => {
  saveToLocalStorage();
});

window.addEventListener("DOMContentLoaded", loadFromLocalStorage);
