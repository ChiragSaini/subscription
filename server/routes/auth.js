const express = require("express");
const jwt = require("jsonwebtoken");
const users = require("../data/users");
const router = express.Router();

// Secret key for JWT
const secretKey = "yourSecretKey";

// Login Route
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    const user = users.find(
        (u) => u.username === username && u.password === password
    );

    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: "1h" });

    res.json({ token, username });
});

// Register Route
router.post("/register", (req, res) => {
    const { username, password } = req.body;

    // In a real-world scenario, you'd handle user registration and database storage here
    users.push({ id: users.length + 1, username, password });

    res.json({ message: "Registration successful" });
});

module.exports = router;