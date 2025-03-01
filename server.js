const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve HTML files from "public" folder

// MySQL Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "CRORES#2512", // Your MySQL password (if any)
  database: "activity_tracker",
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed: ", err);
  } else {
    console.log("✅ Connected to MySQL Database!");
  }
});

// **📌 Route to Insert Activity into MySQL**
app.post("/submit", (req, res) => {
  const { day, date, activities, notes, final_notes } = req.body;
  const sql = "INSERT INTO activities (day, date, activities, notes, final_notes) VALUES (?, ?, ?, ?, ?)";
  
  db.query(sql, [day, date, activities, notes, final_notes], (err, result) => {
    if (err) {
      console.error("❌ Error inserting data: ", err);
      res.send("Error saving data.");
    } else {
      console.log("✅ Activity saved to database!");
      res.redirect("/"); // Redirect to home page
    }
  });
});

// **📌 Route to Fetch All Activities**
app.get("/activities", (req, res) => {
  const sql = "SELECT * FROM activities";
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching activities: ", err);
      res.json([]);
    } else {
      res.json(results);
    }
  });
});

// **📌 Start the Server**
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
