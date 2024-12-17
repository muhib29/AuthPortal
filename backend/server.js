const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"], 
    allowedHeaders: ["Content-Type", "Authorization"], 
  })
);
app.use(bodyParser.json()); 

const pool = mysql.createPool({
  host: "localhost",
  user: "root", 
  password: "Your_Password", 
  database: "signuppage", 
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL");
    connection.release();
  }
});

// Middleware to Authenticate Token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Extract token

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  jwt.verify(token, "your_secret_key", (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token." });
    }
    req.user = user; 
    next();
  });
};

app.get("/create-table", (req, res) => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL
    );
  `;
  pool.query(query, (err) => {
    if (err) {
      return res.status(500).json({ error: "Error creating table." });
    }
    res.json({ message: "Table created successfully." });
  });
});

app.get("/me", authenticateToken, (req, res) => {
  const userId = req.user.userId;


  const token = req.headers.authorization.split(" ")[1]; 
  const decoded = jwt.decode(token); 

  pool.query(
    "SELECT email, username FROM users WHERE id = ?",
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Error fetching user data." });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "User not found." });
      }

      
      if (decoded && decoded.iat) {
        res.json({
          username: results[0].username,
          email: results[0].email,
          iat: decoded.iat, 
        });
      } else {
        res
          .status(400)
          .json({ error: "Invalid or missing token information." });
      }
    }
  );
});

app.get("/users", (req, res) => {
  const query = "SELECT email, username FROM users";
  pool.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching users." });
    }
    res.json(results); 
  });
});

app.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;

  pool.query(
    "SELECT * FROM users WHERE email = ? OR username = ?",
    [email, username],
    async (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Server error" });
      }
      if (results.length > 0) {
        return res
          .status(400)
          .json({ error: "Email or username already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      pool.query(
        "INSERT INTO users (email, username, password) VALUES (?, ?, ?)",
        [email, username, hashedPassword],
        (err, results) => {
          if (err) {
            return res.status(500).json({ error: "Error saving user" });
          }

          // Generate a token for the user
          const token = jwt.sign(
            { userId: results.insertId },
            "your_secret_key",
            { expiresIn: "1h" }
          );

          res.status(201).json({ message: "User created successfully", token });
        }
      );
    }
  );
});

// Login Route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  pool.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Server error." });
      }
      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid username or password." });
      }
      // Compare password with hashed password
      const isMatch = await bcrypt.compare(password, results[0].password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid username or password." });
      }
      // Create JWT token
      const token = jwt.sign({ userId: results[0].id }, "your_secret_key", {
        expiresIn: "1h",
      });

      res.json({ message: "Login successful.", token });
    }
  );
});

// Start the Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
