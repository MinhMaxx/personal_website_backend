const express = require("express");
const router = express.Router();
const authenticateAdmin = require("../helpers/authMiddleware");

// Fetch all projects
router.get("/", (req, res) => {
  // TODO: Fetch projects from the database and return them
  res.send("All of my projects");
});

// Fetch a specific project by ID
router.get("/:id", (req, res) => {
  // TODO: Fetch the specific project by ID from the database and return it
  res.send(`Project with ID: ${req.params.id}`);
});

// Add a new project
router.post("", authenticateAdmin, (req, res) => {
  // If the user is not an admin, respond with a 403 Forbidden status and a relevant message
  if (!req.user.isAdmin) {
    return res
      .status(403)
      .send("You need admin privileges to access this route.");
  }
  // TODO: Add the new project to the database
  res.send("New project added");
});

// Update an existing project by ID
router.put("/:id", authenticateAdmin, (req, res) => {
  // If the user is not an admin, respond with a 403 Forbidden status and a relevant message
  if (!req.user.isAdmin) {
    return res
      .status(403)
      .send("You need admin privileges to access this route.");
  }
  // TODO: Update the specified project in the database
  res.send(`Updated project with ID: ${req.params.id}`);
});

// Delete a project by ID
router.delete("/:id", authenticateAdmin, (req, res) => {
  // If the user is not an admin, respond with a 403 Forbidden status and a relevant message
  if (!req.user.isAdmin) {
    return res
      .status(403)
      .send("You need admin privileges to access this route.");
  }
  // TODO: Delete the specified project from the database
  res.send(`Deleted project with ID: ${req.params.id}`);
});

module.exports = router;
