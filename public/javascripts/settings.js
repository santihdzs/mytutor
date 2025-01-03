function updateName(event) {
  event.preventDefault();
  console.log("Update Name function called");
  let newName = document.getElementById("newName").value;
  const confirmName = document.getElementById("confirmName").value;
  console.log("New Name:", newName);
  console.log("Confirm Name:", confirmName);

  if (newName !== confirmName) {
      alert("Name fields do not match.");
      return;
  }

  // Capitalize the first letter of each word in the name
  newName = newName.replace(/\b\w/g, (char) => char.toUpperCase());

  fetch("http://localhost:3000/api/user/name", {
      method: "PATCH",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: newName })
  })
  .then(response => {
      if (!response.ok) {
          throw new Error("Network response was not ok");
      }
      return response.json();
  })
  .then(data => {
      alert("Name updated successfully");
      location.reload(); // Reload the page to reflect the updated name
  })
  .catch(error => {
      console.error("Error updating name:", error.message);
      alert("Error updating name. Please try again.");
  });
}


function updateEmail(event) {
    event.preventDefault();
    const newEmail = document.getElementById("newEmail").value;
    const confirmEmail = document.getElementById("confirmEmail").value;

    if (newEmail !== confirmEmail) {
        alert("Email fields do not match.");
        return;
    }

    fetch("http://localhost:3000/api/user/email", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: newEmail })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {
        alert("Email updated successfully");
        location.reload(); // Reload the page to reflect the updated email
    })
    .catch(error => {
        console.error("Error updating email:", error.message);
        alert("Error updating email. Please try again.");
    });
}

// Fetch user data from backend API using fetch
fetch("http://localhost:3000/api/user")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    const user = data.data; // Assuming user data is in data field of the response
    console.log("User data:", user);
  })
  .catch((error) => {
    console.error("Error fetching user data:", error);
  });

  const changePasswordForm = document.getElementById("change-password-form");

  changePasswordForm.addEventListener("submit", async (event) => {
    event.preventDefault();
  
    const formData = new FormData(changePasswordForm);
    const currentPassword = formData.get("current-password"); // Use name attribute here
    const newPassword = formData.get("new-password"); // Use name attribute here
    const confirmNewPassword = formData.get("confirm-new-password"); // Use name attribute here
  
    const response = await fetch("/api/user/password", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
        confirmNewPassword,
      }),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      alert(data.message); // Display the error message as a popup
    } else {
      alert(data.message); // Display success message as a popup
      changePasswordForm.reset(); // Reset the form
    }
  });
  