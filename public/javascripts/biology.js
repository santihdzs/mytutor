// Function to create a tutor card
function createTutorCard(tutor) {
  const card = document.createElement('div');
  card.classList.add('card');

  const name = document.createElement('h2');
  name.textContent = tutor.name;

  const email = document.createElement('p');
  email.textContent = tutor.email;

  card.appendChild(name);
  card.appendChild(email);

  // Add event listener to navigate to tutor's route when clicked
  card.addEventListener('click', () => {
    const tutorNameSlug = tutor.name.toLowerCase().replace(/\s+/g, '-'); // Replace spaces with hyphens
    window.location.href = `/tutors/${tutorNameSlug}`;
  });

  return card;
}


// Function to display tutors in cards
function displayTutors(tutors) {
  const tutorsContainer = document.getElementById("tutorsContainer");
  const searchInput = document.getElementById("searchInput");

  // Sort tutors alphabetically
  tutors.sort((a, b) => a.name.localeCompare(b.name));

 // Filter tutors based on search input
function filterTutors(searchQuery) {
  const filteredTutors = tutors.filter((tutor) =>
    tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutor.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );
  tutorsContainer.innerHTML = ""; // Clear the container
  filteredTutors.forEach((tutor) => {
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
}

// Fetch tutor data from backend API using fetch
fetch('http://localhost:3000/api/tutors/biology')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    const tutors = data.data; // Assuming tutors are in data field of the response
    displayTutors(tutors);
  })
  .catch(error => {
    console.error('Error fetching tutor data:', error);
  });
