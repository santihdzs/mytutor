let favorites = []; // Initialize favorites as an empty array

// Fetch user's favorites
fetch(`/api/user/favorites`)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to fetch user's favorites");
    }
    return response.json();
  })
  .then((data) => {
    favorites = data.favorites || []; // Use fetched favorites or initialize as empty array

    // Update button states for all tutor buttons
    document.querySelectorAll(".js-favorite-btn").forEach((button) => {
      const tutorId = button.dataset.tutorId;
      updateButtonState(tutorId);
    });
  })
  .catch((error) => {
    console.error("Error fetching user's favorites:", error);
  });

// Function to handle favoriting/unfavoriting a tutor
function toggleFavorite(tutorId) {
  const isCurrentlyFavorited = favorites.includes(tutorId);

  fetch(`/api/tutor/favorite/${tutorId}`, {
    method: "PATCH",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to favorite tutor");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      console.log("Tutor favorited/unfavorited successfully");
      if (isCurrentlyFavorited) {
        // Tutor was previously favorited, so remove from favorites
        favorites = favorites.filter((id) => id !== tutorId);
      } else {
        // Tutor was not favorited, so add to favorites
        favorites.push(tutorId);
      }
      updateButtonState(tutorId);
    })
    .catch((error) => {
      console.error("Error favoriting/unfavoriting tutor:", error);
    });
}

// Function to update the button text based on the current state
function updateButtonState(tutorId) {
  const button = document.querySelector(`.js-favorite-btn[data-tutor-id="${tutorId}"]`);
  if (button) {
    button.textContent = favorites.includes(tutorId) ? "Remove from Favorites" : "Add to Favorites";
  }
}

// Add event listener to favorite button
document.querySelectorAll(".js-favorite-btn").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    const tutorId = button.dataset.tutorId;
    toggleFavorite(tutorId);
  });
});
