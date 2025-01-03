if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
const initializePassport = require("./passport-config");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const sqlite3 = require("sqlite3").verbose(); // Import SQLite module
const routes = require("./routes");

app.use(routes);

initializePassport(
  passport,
  async (email) => {
    // Use SQLite to retrieve user by email
    return await getUserByEmail(email);
  },
  async (id) => {
    // Use SQLite to retrieve user by ID
    return await getUserById(id);
  }
);

const db = new sqlite3.Database(
  "./data/database.db",
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("Connected to the database");
    }
  }
);

app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

// Configuring the register post functionality
app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

// User Registration
app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Capitalize the first letter of every word in the name field
    const capitalizedFullName = req.body.name.replace(/\b\w/g, (char) => char.toUpperCase());

    // Generate ID using the same method
    const userId = Date.now().toString();

    // Insert user into the database with the generated ID and capitalized name
    const sql =
      "INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)";
    db.run(
      sql,
      [userId, capitalizedFullName, req.body.email, hashedPassword],
      (err) => {
        if (err) {
          console.error(err.message);
          req.flash("error", "Registration failed");
          return res.redirect("/register");
        }

        console.log("User added to the database");
        res.redirect("/login");
      }
    );
  } catch (error) {
    console.error(error);
    req.flash("error", "Registration failed");
    res.redirect("/register");
  }
});


// Function to get user by email from the database
function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.get(sql, [email], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

// Function to get user by ID from the database
function getUserById(id) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE id = ?";
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

// Function to get tutor by name from the database
function getTutorByName(name) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM tutors WHERE name = ?";
    db.get(sql, [name], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}
// Set the view engine to use EJS
app.set("view engine", "ejs");

// Server-side route handling for tutor pages
app.get("/tutors/:tutorName", async (req, res) => {
  try {
    const hyphenatedTutorName = req.params.tutorName;
    const tutorNameWithSpaces = hyphenatedTutorName.replace(/-/g, " "); // Replace hyphens with spaces
    const formattedTutorName = capitalizeEachWord(tutorNameWithSpaces); // Convert first letters to uppercase

    // Fetch data for the specified tutor from the database
    const tutorData = await getTutorByName(formattedTutorName);

    if (!tutorData) {
      console.log("Tutor not found:", formattedTutorName);
      // Tutor not found in the database
      return res.status(404).send("Tutor not found");
    }

    // Assuming you have user-specific data available in your route handler
    const user = req.user; // Assuming user information is stored in req.user

    // Render the tutor template with the tutor's information and user data
    res.render("tutor", { tutor: tutorData, user: user });
  } catch (error) {
    console.error("Error fetching tutor data:", error);
    res.status(500).send("Internal Server Error");
  }
});


// Function to capitalize the first letter of each word
function capitalizeEachWord(str) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

// Function to capitalize the first letter of each word
function capitalizeEachWord(str) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

// Middleware to check for specific routes based on authentication
const checkAuthenticatedRoutes = async (req, res, next) => {
  try {
    // If user is authenticated, fetch user details
    if (req.isAuthenticated()) {
      // Fetch user details using your getUserById function or database query
      const user = await getUserById(req.user.id);

      // Include user details in res.locals for all routes
      res.locals.user = {
        name: user.name,
        email: user.email,
      };

      // Redirect authenticated users from /login and /register to /
      if (req.path === "/login" || req.path === "/register") {
        return res.redirect("/");
      }
    } else {
      // Set an empty user object in res.locals for unauthenticated users
      res.locals.user = {
        name: "",
        email: "",
      };

      // Redirect unauthenticated users to /about for any route other than /login and /register
      if (req.path !== "/login" && req.path !== "/register") {
        return res.redirect("/about");
      }
    }

    // Allow access to all routes for authenticated users
    next();
  } catch (error) {
    console.error(error);
    // Handle any error fetching user details
    res.redirect("/about"); // Redirect to a safe location in case of an error
  }
};

// Routes
app.get("/about", (req, res) => {
  res.render("about.ejs", { user: res.locals.user });
});

app.use(express.static(__dirname + "/../../public"));

// Add the middleware to all routes
app.get("/*", checkAuthenticatedRoutes, (req, res) => {
  // For authenticated users, render the requested route's view
  const viewName = req.path.substring(1) || "index"; // Use 'index' as default if no route specified
  res.render(`${viewName}.ejs`, { user: res.locals.user }); // Pass the user details to the view
});

app.delete("/logout", (req, res) => {
  req.logout(req.user, (err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

app.listen(3000);
