const express = require("express");
const users = require("../data/users");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Sample subscription data (for demonstration purposes)
const subscriptions = [
    { id: 1, name: "Basic Plan", priceMonthly: 9.99, priceYearly: 99.99 },
    { id: 2, name: "Premium Plan", priceMonthly: 14.99, priceYearly: 149.99 },
    { id: 3, name: "Ultra Plan", priceMonthly: 19.99, priceYearly: 199.99 },
];

// Middleware: Verify JWT Token
const verifyToken = (req, res, next) => {
    let token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    token = token.replace("Bearer ", "");

    jwt.verify(token, "yourSecretKey", (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        }
        req.userId = decoded.userId;
        next();
    });
};

// Route to get available subscriptions
router.get("/subscriptions", (req, res) => {
    res.json(subscriptions);
});

// Route to purchase a subscription
router.post("/purchase", verifyToken, (req, res) => {
    const { subscriptionId, billingCycle } = req.body;
    const subscription = subscriptions.find((sub) => sub.id === subscriptionId);

    if (!subscription) {
        return res.status(404).json({ message: "Subscription not found" });
    }

    const price =
        billingCycle === "yearly" ?
        subscription.priceYearly :
        subscription.priceMonthly;

    const today = new Date();
    const startDate = today.toISOString();

    const endDate = new Date(today);
    endDate.setMonth(endDate.getMonth() + (billingCycle === "yearly" ? 12 : 1));
    const formattedEndDate = endDate.toISOString();

    // In a real-world scenario, you'd handle the subscription purchase and storage here
    // For now, let's simulate storing the purchase for the user
    const userSubscription = {
        userId: req.userId,
        subscription,
        billingCycle,
        price,
        startDate,
        endDate: formattedEndDate,
        status: "active",
    };

    let idx = users.findIndex((user) => user.id === req.userId);
    users[idx] = {
        ...users[idx],
        ...userSubscription,
    };

    res.json({
        message: "Subscription purchased successfully",
        subscription: userSubscription,
    });
});

router.get("/user-subscriptions", verifyToken, (req, res) => {
    // In a real-world scenario, you'd retrieve the user's subscriptions from the database here
    // For now, let's simulate returning the user's active subscriptions
    const { userId } = req.params;
    const userSubscriptions = users.find((user) => user.id === userId);

    res.json(userSubscriptions);
});

module.exports = router;