const sqlite3 = require("sqlite3").verbose();

// Connect to DB
const db = new sqlite3.Database("./data/database.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);

    // Delete all rows from the users table
    db.run("DELETE FROM users", [], (err) => {
        if (err) return console.error(err.message);
        console.log("All users deleted from the users table");
    });
});
