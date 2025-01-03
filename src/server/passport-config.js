const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initialize(passport, getUserByEmail, getUserById) {
  // Function to authenticate users
  const authenticateUsers = async (email, password, done) => {
    // Get users by email
    const user = await getUserByEmail(email);
    if (user == null) {
      return done(null, false, { message: "No user found with that email" });
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password Incorrect" });
      }
    } catch (e) {
      console.error(e);
      return done(e);
    }
  };

  passport.use(
    new LocalStrategy({ usernameField: "email" }, authenticateUsers)
  );

  passport.serializeUser((user, done) => {
    // Serialize the user by storing only the user's ID in the session
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      // Deserialize the user by retrieving the user from the database using the stored ID
      const user = await getUserById(id);
      done(null, user);
    } catch (error) {
      console.error(error);
      done(error);
    }
  });
}

module.exports = initialize;
