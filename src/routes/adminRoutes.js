// Import necessary modules
const express = require("express");
const router = express.Router();

// Middleware for authenticating an admin user
const authenticateAdmin = require("../helpers/authMiddleware");

// Apply the authentication middleware to check if the user is authenticated and has an admin role
router.use(authenticateAdmin);

// Middleware to specifically check if the user is an admin
router.use((req, res, next) => {
  // If the user is not an admin, respond with a 403 Forbidden status and a relevant message
  if (!req.user.isAdmin) {
    return res
      .status(403)
      .send("You need admin privileges to access this route.");
  }
  // Proceed to the next route handler if user is an admin
  next();
});

// Get list of all my admin setting
router.get("/", (req, res) => {
  res.send("List of all admin setting");
});

// Export the router to be used in other parts of the application
module.exports = router;
