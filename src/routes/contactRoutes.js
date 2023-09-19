// Import necessary modules
const express = require("express");
// Create an express router instance
const router = express.Router();

// Import the contact controller to handle contact form submissions
const contactController = require("../controllers/contactController");

// Define a route to serve the contact form page
router.get("/", (req, res) => {
  // TODO: Render a proper contact form template instead of sending a placeholder text
  res.send("Contact form page");
});

// Define a route to handle the submission of the contact form
router.post("/submit", contactController.handleContactForm);

// Export the router for use in other parts of the application
module.exports = router;
