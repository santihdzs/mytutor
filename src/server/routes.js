const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session"); // Add express-session
const bcrypt = require("bcrypt"); // Require bcrypt
const app = express();
const sqlite = require("sqlite3").verbose();
const db = new sqlite.Database(
  "./data/database.db",
  sqlite.OPEN_READWRITE,
  (err) => {
    if (err) return console.error(err.message);
  }
);

// Function to get user by ID from the database
async function getUserById(id) {
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

// Configure Passport to use a local strategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    const sql = "SELECT * FROM users WHERE name = ?";
    db.get(sql, [username], async (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      try {
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (isPasswordMatch) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (error) {
        return done(error);
      }
    });
  })
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const sql = "SELECT * FROM users WHERE id = ?";
  db.get(sql, [id], (err, user) => {
    done(err, user);
  });
});

// Add Passport middleware to Express
app.use(
  session({
    secret: "your_secret_here",
    resave: false,
    saveUninitialized: false,
  })
); // Configure express-session
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());

// Middleware to check if user is authenticated
const checkAuthenticatedRoutes = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// Generic function to fetch tutors based on subject
const fetchTutorsBySubject = (subject, res) => {
  const sql =
    "SELECT name, email, subject, date_time FROM tutors WHERE subject = ?";
  db.all(sql, [subject], (err, rows) => {
    if (err) {
      return res.json({ status: 300, success: false, error: err });
    }

    if (rows.length < 1) {
      return res.json({
        status: 400,
        success: false,
        error: `No ${subject} tutors found`,
      });
    }

    // Map the rows to extract name, email, subject, and date_time fields
    const tutors = rows.map((row) => ({
      name: row.name,
      email: row.email,
      subject: row.subject,
      date_time: row.date_time,
    }));

    return res.json({ status: 200, success: true, data: tutors });
  });
};

// Get request
app.get("/database", (req, res) => {
  const sql = "SELECT * FROM users";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.json({ status: 300, success: false, error: err });
    }

    if (rows.length < 1) {
      return res.json({ status: 400, success: false, error: "No users found" });
    }

    return res.json({ status: 200, success: true, data: rows });
  });
});

app.get("/api/tutors", (req, res) => {
  const sql = "SELECT id, name, email, subject, date_time FROM tutors"; // SQL query to select name and email from tutors table
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.json({ status: 300, success: false, error: err });
    }

    if (rows.length < 1) {
      return res.json({
        status: 400,
        success: false,
        error: "No tutors found",
      });
    }

    // Map the rows to extract name and email fields
    const tutors = rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      subject: row.subject,
      date_time: row.date_time,
    }));

    return res.json({ status: 200, success: true, data: tutors });
  });
});

app.get("/api/tutors/math", (req, res) => {
  const sql =
    "SELECT name, email, subject, date_time FROM tutors WHERE subject = 'Maths'";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.json({ status: 300, success: false, error: err });
    }

    if (rows.length < 1) {
      return res.json({
        status: 400,
        success: false,
        error: "No maths tutors found",
      });
    }

    // Map the rows to extract name, email, subject, and date_time fields
    const tutors = rows.map((row) => ({
      name: row.name,
      email: row.email,
      subject: row.subject,
      date_time: row.date_time,
    }));

    return res.json({ status: 200, success: true, data: tutors });
  });
});

app.get("/api/tutors/cs", (req, res) => {
  const sql =
    "SELECT name, email, subject, date_time FROM tutors WHERE subject = 'Computer Science'";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.json({ status: 300, success: false, error: err });
    }

    if (rows.length < 1) {
      return res.json({
        status: 400,
        success: false,
        error: "No maths tutors found",
      });
    }

    // Map the rows to extract name, email, subject, and date_time fields
    const tutors = rows.map((row) => ({
      name: row.name,
      email: row.email,
      subject: row.subject,
      date_time: row.date_time,
    }));

    return res.json({ status: 200, success: true, data: tutors });
  });
});

app.get("/api/tutors/biology", (req, res) => {
  const sql =
    "SELECT name, email, subject, date_time FROM tutors WHERE subject = 'Biology'";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.json({ status: 300, success: false, error: err });
    }

    if (rows.length < 1) {
      return res.json({
        status: 400,
        success: false,
        error: "No maths tutors found",
      });
    }

    // Map the rows to extract name, email, subject, and date_time fields
    const tutors = rows.map((row) => ({
      name: row.name,
      email: row.email,
      subject: row.subject,
      date_time: row.date_time,
    }));

    return res.json({ status: 200, success: true, data: tutors });
  });
});

app.get("/api/tutors/chemistry", (req, res) => {
  const sql =
    "SELECT name, email, subject, date_time FROM tutors WHERE subject = 'Chemistry'";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.json({ status: 300, success: false, error: err });
    }

    if (rows.length < 1) {
      return res.json({
        status: 400,
        success: false,
        error: "No maths tutors found",
      });
    }

    // Map the rows to extract name, email, subject, and date_time fields
    const tutors = rows.map((row) => ({
      name: row.name,
      email: row.email,
      subject: row.subject,
      date_time: row.date_time,
    }));

    return res.json({ status: 200, success: true, data: tutors });
  });
});

app.get("/api/tutors/economics", (req, res) => {
  const sql =
    "SELECT name, email, subject, date_time FROM tutors WHERE subject = 'Economics'";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.json({ status: 300, success: false, error: err });
    }

    if (rows.length < 1) {
      return res.json({
        status: 400,
        success: false,
        error: "No maths tutors found",
      });
    }

    // Map the rows to extract name, email, subject, and date_time fields
    const tutors = rows.map((row) => ({
      name: row.name,
      email: row.email,
      subject: row.subject,
      date_time: row.date_time,
    }));

    return res.json({ status: 200, success: true, data: tutors });
  });
});

app.get("/api/tutors/physics", (req, res) => {
  const sql =
    "SELECT name, email, subject, date_time FROM tutors WHERE subject = 'Physics'";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.json({ status: 300, success: false, error: err });
    }

    if (rows.length < 1) {
      return res.json({
        status: 400,
        success: false,
        error: "No maths tutors found",
      });
    }

    // Map the rows to extract name, email, subject, and date_time fields
    const tutors = rows.map((row) => ({
      name: row.name,
      email: row.email,
      subject: row.subject,
      date_time: row.date_time,
    }));

    return res.json({ status: 200, success: true, data: tutors });
  });
});


//Fetch user info
app.get("/api/user", (req, res) => {
  // Assuming req.user contains the user's ID
  const userId = req.user.id;

  // SQL query to fetch user's name and email based on the user ID
  const sql = "SELECT name, email FROM users WHERE id = ?";

  db.get(sql, [userId], (err, row) => {
    if (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    if (!row) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ name: row.name, email: row.email }); // Send the user's name and email in the response
  });
});

// Update user's name
app.patch("/api/user/name", checkAuthenticatedRoutes, (req, res) => {
  try {
    const newName = req.body.name;
    const userId = req.user.id;
    const sql = "UPDATE users SET name = ? WHERE id = ?";
    db.run(sql, [newName, userId], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to update name" });
      }
      res.status(200).json({ message: "Name updated successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update user's email
app.patch("/api/user/email", checkAuthenticatedRoutes, (req, res) => {
  try {
    const newEmail = req.body.email;
    const userId = req.user.id;
    const sql = "UPDATE users SET email = ? WHERE id = ?";
    db.run(sql, [newEmail, userId], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to update email" });
      }
      res.status(200).json({ message: "Email updated successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Add this route handler to your routes.js file

app.patch("/api/user/password", checkAuthenticatedRoutes, async (req, res) => {
  try {
    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;
    const confirmNewPassword = req.body.confirmNewPassword;
    const userId = req.user.id;

    if (!currentPassword) {
      return res.status(400).json({ message: "Current password is required" });
    }

    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the current password with the hashed password in the database
    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    const sqlUpdatePassword = "UPDATE users SET password = ? WHERE id = ?";
    db.run(sqlUpdatePassword, [hashedPassword, userId], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to update password" });
      }
      res.status(200).json({ message: "Password updated successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Add tutor to favorites
app.patch("/api/tutor/favorite/:tutorId", (req, res) => {
  const userId = req.user.id; // Assuming you have the user ID in the request
  const tutorId = req.params.tutorId;

  // Fetch current favorites list for the user
  db.get("SELECT favorites FROM users WHERE id = ?", [userId], (err, row) => {
    if (err) {
      return res.json({ status: 500, success: false, error: "Internal Server Error" });
    }

    let favorites = row.favorites ? JSON.parse(row.favorites) : [];

    // Check if tutorId is already in favorites
    const index = favorites.indexOf(tutorId);
    if (index !== -1) {
      // Tutor is already in favorites, remove them
      favorites.splice(index, 1);
    } else {
      // Tutor is not in favorites, add them
      favorites.push(tutorId);
    }

    // Update favorites in the database
    db.run("UPDATE users SET favorites = ? WHERE id = ?", [JSON.stringify(favorites), userId], (err) => {
      if (err) {
        return res.json({ status: 500, success: false, error: "Internal Server Error" });
      }

      return res.json({ status: 200, success: true, message: "Tutor added/removed from favorites" });
    });
  });
});

// Fetch user's favorites
app.get("/api/user/favorites", (req, res) => {
  const userId = req.user.id; // Assuming you have the user ID in the request

  if (!userId) {
    return res.status(400).json({ status: 400, success: false, error: "User ID is missing" });
  }

  // Fetch user's favorites from the database
  db.get("SELECT favorites FROM users WHERE id = ?", [userId], (err, row) => {
    if (err) {
      console.error("Error fetching user's favorites:", err);
      return res.status(500).json({ status: 500, success: false, error: "Internal Server Error" });
    }

    const favorites = row ? JSON.parse(row.favorites) : [];

    return res.json({ status: 200, success: true, favorites: favorites });
  });
});


module.exports = app;
