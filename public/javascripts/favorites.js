// Function to create a tutor card
function createTutorCard(tutor) {
    const card = document.createElement("div");
    card.classList.add("card");
  
    const name = document.createElement("h2");
    name.textContent = tutor.name;
  
    const email = document.createElement("p");
    email.textContent = tutor.subject;
  
    card.appendChild(name);
    card.appendChild(email);
  
    // Add event listener to navigate to tutor's route when clicked
    card.addEventListener("click", () => {
      const tutorNameSlug = tutor.name.toLowerCase().replace(/\s+/g, "-"); // Replace spaces with hyphens
      window.location.href = `/tutors/${tutorNameSlug}`;
    });
  
    return card;
  }
  
  // Function to display tutors in cards
  function displayTutors(tutors) {
    const tutorsContainer = document.getElementById("tutorsContainer");
    const searchInput = document.getElementById("searchInput");
  
    // Fetch user's favorites list
    fetch("/api/user/favorites")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch user's favorites");
        }
        return response.json();
      })
      .then((data) => {
        const favorites = data.favorites || []; // Assuming favorites is an array of tutor IDs
        console.log("Favorites:", favorites);
  
        // Filter tutors based on favorites
        const filteredTutors = tutors.filter((tutor) =>
          favorites.includes(String(tutor.id))
        );
  
        // Sort tutors alphabetically
        filteredTutors.sort((a, b) => a.name.localeCompare(b.name));
  
        // Filter tutors based on search input
        function filterTutors(searchQuery) {
          const filtered = filteredTutors.filter(
            (tutor) =>
              tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              tutor.subject.toLowerCase().includes(searchQuery.toLowerCase())
          );
          tutorsContainer.innerHTML = ""; // Clear the container
          filtered.forEach((tutor) => {
            const card = createTutorCard(tutor);
            tutorsContainer.appendChild(card);
          });
        }
  
        // Display all tutors initially
        filterTutors("");
  
        // Add event listener to search input
        searchInput.addEventListener("input", (event) => {
          const searchQuery = event.target.value;
          filterTutors(searchQuery);
        });
      })
      .catch((error) => {
        console.error("Error fetching user's favorites:", error);
      });
  }
  
  // Fetch tutor data from backend API using fetch
  fetch("http://localhost:3000/api/tutors")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const tutors = data.data;
      console.log("Tutors:", tutors);
      displayTutors(tutors);
    })
    .catch((error) => {
      console.error("Error fetching tutor data:", error);
    });
  