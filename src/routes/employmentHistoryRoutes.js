const express = require("express");
const router = express.Router();
const authenticateAdmin = require("../helpers/authMiddleware");

// Fetch all employment histories
router.get("/", (req, res) => {
  // TODO: Fetch employment histories from the database and return them
  res.send("List of all employment histories");
});

// Fetch a specific employment history by ID
router.get("/:id", (req, res) => {
  // TODO: Fetch the specific employment history by ID from the database and return it
  res.send(`Employment history details for ID: ${req.params.id}`);
});

// Add a new employment history entry
router.post("", authenticateAdmin, (req, res) => {
  // TODO: Add the new employment history entry to the database
  res.send("New employment history added");
});

// Update an existing employment history by ID
router.put("/:id", authenticateAdmin, (req, res) => {
  // If the user is not an admin, respond with a 403 Forbidden status and a relevant message
  if (!req.user.isAdmin) {
    return res
      .status(403)
      .send("You need admin privileges to access this route.");
  }
  // TODO: Update the specified employment history in the database
  res.send(`Updated employment history with ID: ${req.params.id}`);
});

// Delete a specific employment history by ID
router.delete("/:id", authenticateAdmin, (req, res) => {
  // If the user is not an admin, respond with a 403 Forbidden status and a relevant message
  if (!req.user.isAdmin) {
    return res
      .status(403)
      .send("You need admin privileges to access this route.");
  }
  // TODO: Delete the specified employment history from the database
  res.send(`Deleted employment history with ID: ${req.params.id}`);
});

// Export the router to be used in the main server file
module.exports = router;
