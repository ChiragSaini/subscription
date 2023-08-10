const express = require("express");
const authRoutes = require("./routes/auth");
const subscriptionRoutes = require("./routes/subscription");
const users = require("./data/users");
const app = express();
const port = 3000; // You can change this to your desired port number

// Middleware: Logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Middleware: Body Parsing (for handling JSON data)
app.use(express.json());

// Middleware: Static Files
app.use(express.static("public")); // Create a 'public' folder for static files (e.g., CSS, images)

// Routes
app.get("/", (req, res) => {
    res.send("Hello, Express!");
});

app.use("/auth", authRoutes);
app.use("/subscriptions", subscriptionRoutes);

app.get("/get-all-users", (req, res) => {
    res.json({
        users: users.map((user) => {
            delete user.password;
            return user;
        }),
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});