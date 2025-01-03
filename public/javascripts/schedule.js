$(function () {
  // Get the current date
  var currentDate = new Date();
  var formattedDate =
    currentDate.getFullYear() +
    "-" +
    ("0" + (currentDate.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + currentDate.getDate()).slice(-2);

  // Initialize datepicker with current date
  $("#datepicker")
    .datepicker({
      firstDay: 1,
      dayNamesMin: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      dateFormat: "yy-mm-dd", // Set the date format explicitly
      onSelect: function (dateText, inst) {
        updateTutorCards(dateText);
      },
    })
    .datepicker("setDate", formattedDate); // Set datepicker to current date

  // Display tutors for current date
  updateTutorCards(formattedDate);
});

function updateTutorCards(selectedDate) {
  const date = new Date(selectedDate);
  date.setDate(date.getDate() + 1); // Add one day to the selected date
  const selectedDay = date.toLocaleString("en-us", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  fetch("http://localhost:3000/api/tutors")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const tutors = data.data; // Assuming tutors are in data field of the response
      const filteredTutors = tutors.filter((tutor) => {
        const tutorDay = tutor.date_time.split(" ")[0]; // Get the day part from tutor.date_time
        return (
          tutorDay.toLowerCase() ===
          date.toLocaleString("en-us", { weekday: "long" }).toLowerCase()
        );
      });

      // Sort the filteredTutors array based on time
      filteredTutors.sort((a, b) => {
        const timeA =
          a.date_time.split(" ")[1] + " " + a.date_time.split(" ")[2]; // Get time part
        const timeB =
          b.date_time.split(" ")[1] + " " + b.date_time.split(" ")[2]; // Get time part
        return (
          new Date("1970/01/01 " + timeA) - new Date("1970/01/01 " + timeB)
        );
      });

      const tutorCardsHtml = filteredTutors
        .map((tutor) => {
          const time =
            tutor.date_time.split(" ")[1] + " " + tutor.date_time.split(" ")[2]; // Get the time part from tutor.date_time
          const tutorNameSlug = tutor.name.toLowerCase().replace(/\s+/g, "-"); // Replace spaces with hyphens
          return `
              <a href="/tutors/${tutorNameSlug}" class="card-link">
                <div class="card">
                  <div class="card-body">
                    <h3 class="card-title">${tutor.name} - ${tutor.subject}</h3>
                    <h3 class="card-text">${time}</h3>
                  </div>
                </div>
              </a>
            `;
        })
        .join("");

      $("#tutorCardsContainer").html(
        `<h3 class="selected-date">${selectedDay}</h3>${tutorCardsHtml}`
      );
    })
    .catch((error) => {
      console.error("Error fetching tutor data:", error);
    });
}

fetch("http://localhost:3000/api/tutors")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    const tutors = data.data; // Assuming tutors are in data field of the response
    displayTutors(tutors);
  })
  .catch((error) => {
    console.error("Error fetching tutor data:", error);
  });

function displayTutors(tutors) {
  // Display tutors on the page
}
