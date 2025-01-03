// Function to get the next occurrence of a weekday
function getNextWeekday(targetDay) {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const currentDate = new Date();
    const currentDayIndex = currentDate.getDay();
    const targetDayIndex = daysOfWeek.indexOf(targetDay);
    
    let daysToAdd = targetDayIndex - currentDayIndex;
    if (daysToAdd < 0) {
      daysToAdd += 7;
    }
  
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + daysToAdd);
    
    return nextDate;
  }
  
  // Function to display tutors in cards
  function displayTutors(tutors) {
      const boxes = document.querySelectorAll(".day-and-activity .day p");
  
      boxes.forEach((box, index) => {
          const date = tutors[index].date_time.split(' ')[0]; // Get the weekday from the date_time string
          const weekday = date.substring(0, 3); // Get the first three characters of the weekday
          box.textContent = weekday;
          
          const currentDate = new Date(); // Get the current date
          const nextDate = getNextWeekday(weekday); // Get the next occurrence of the weekday
          const dayNumber = nextDate.getDate(); // Get the day number
          document.querySelectorAll(".day-and-activity .day h1")[index].textContent = dayNumber; // Set the day number in h1
      });
  
      const buttons = document.querySelectorAll(".day-and-activity .btn");
  
      buttons.forEach((button, index) => {
          const tutorNameSlug = tutors[index].name.toLowerCase().replace(/\s+/g, "-");
          button.setAttribute("href", `/tutors/${tutorNameSlug}`);
  
          // Add event listener to each button
          button.addEventListener("click", (event) => {
              event.preventDefault(); // Prevent the default action of the button
              window.location.href = button.getAttribute("href"); // Navigate to the tutor's page
          });
      });
  
      const boxOne = document.querySelector(".activity-one .activity h2");
      const boxTwo = document.querySelector(".activity-two .activity h2");
      const boxThree = document.querySelector(".activity-three .activity h2");
      const boxFour = document.querySelector(".activity-four .activity h2");
  
      boxOne.textContent = `${tutors[0].subject} Revision`;
      boxTwo.textContent = `${tutors[1].subject} Revision`;
      boxThree.textContent = `${tutors[2].subject} Revision`;
      boxFour.textContent = `${tutors[3].subject} Revision`;
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
      const tutors = data.data; // Assuming tutors are in data field of the response
  
      // Function to parse date and time string and return a Date object
      const parseDateTime = (dateTimeStr) => {
        const [day, time, meridian] = dateTimeStr.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        const adjustedHours = meridian === 'PM' ? hours + 12 : hours;
        const date = new Date();
        date.setHours(adjustedHours, minutes, 0, 0);
  
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const currentDay = date.getDay();
        const targetDay = daysOfWeek.indexOf(day);
  
        let daysToAdd = targetDay - currentDay;
        if (daysToAdd <= 0) {
          daysToAdd += 7;
        }
        date.setDate(date.getDate() + daysToAdd);
  
        return date;
      };
  
      // Sort tutors by date and time
      tutors.sort((a, b) => {
        const dateA = parseDateTime(a.date_time);
        const dateB = parseDateTime(b.date_time);
  
        return dateA - dateB;
      });
  
      // Display tutors in cards
      displayTutors(tutors);
    })
    .catch((error) => {
      console.error("Error fetching tutor data:", error);
    });
  
  // Function to shuffle array randomly
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  // Function to display tutors in cards in a random order
  function displayRandomTutors(tutors) {
    // Shuffle the tutors array randomly
    const shuffledTutors = shuffleArray(tutors);
  
    // Get references to the boxes in the HTML
    const boxOne = document.querySelector(".tutor-box.box-one");
    const boxTwo = document.querySelector(".tutor-box.box-two");
    const boxThree = document.querySelector(".tutor-box.box-three");
  
    // Assign tutors to each box
    boxOne.innerHTML = `<h2>${shuffledTutors[0].name} - ${shuffledTutors[0].subject}</h2>`;
    boxTwo.innerHTML = `<h2>${shuffledTutors[1].name} - ${shuffledTutors[1].subject}</h2>`;
    boxThree.innerHTML = `<h2>${shuffledTutors[2].name} - ${shuffledTutors[2].subject}</h2>`;
  
    // Add click functionality to each card
    boxOne.addEventListener('click', () => {
      const tutorNameSlug = shuffledTutors[0].name.toLowerCase().replace(/\s+/g, '-');
      window.location.href = `/tutors/${tutorNameSlug}`;
    });
  
    boxTwo.addEventListener('click', () => {
      const tutorNameSlug = shuffledTutors[1].name.toLowerCase().replace(/\s+/g, '-');
      window.location.href = `/tutors/${tutorNameSlug}`;
    });
  
    boxThree.addEventListener('click', () => {
      const tutorNameSlug = shuffledTutors[2].name.toLowerCase().replace(/\s+/g, '-');
      window.location.href = `/tutors/${tutorNameSlug}`;
    });
  }
  
  // Fetch tutor data from backend API using fetch for random tutors
  fetch("http://localhost:3000/api/tutors")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const tutors = data.data; // Assuming tutors are in data field of the response
      displayRandomTutors(tutors);
    })
    .catch((error) => {
      console.error("Error fetching tutor data for random tutors:", error);
    });
  