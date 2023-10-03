const express = require("express");
const router = express.Router();
const authenticateAdmin = require("../helpers/authMiddleware");
const Project = require("../models/project");
const { body, validationResult } = require("express-validator");

// Define the validation array
const projectValidation = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Name is required"),
  body("description")
    .isString()
    .withMessage("Description must be a string")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Description is required"),
  body("startDate").isDate().withMessage("Start Date must be a valid date"),
  body("endDate")
    .optional({ checkFalsy: true })
    .isDate()
    .withMessage("End Date must be a valid date"),
  body("technologiesUsed")
    .isArray()
    .withMessage("Technologies Used must be an array of strings"),
  body("link")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("Link must be a valid URL"),
];

// Fetch all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ startDate: -1 }); // Sorting by startDate in descending order
    res.json(projects);
  } catch (err) {
    res.status(500).send("Error fetching projects");
  }
});

// Fetch a specific project by ID
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).send("Project not found");
    res.json(project);
  } catch (err) {
    res.status(500).send("Error fetching the project");
  }
});

// Add a new project
router.post("", authenticateAdmin, async (req, res) => {
  const project = new Project(req.body);
  try {
    await project.save();
    res.status(201).json(`New project ${project.name} added successfully`);
  } catch (err) {
    res.status(500).send("Error saving the project");
  }
});

// Update an existing project by ID
router.put("/:id", authenticateAdmin, projectValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProject) return res.status(404).send("Project not found");
    res.json(`Update project ${updatedProject.name} successfully!`);
  } catch (err) {
    res.status(500).send("Error updating the project");
  }
});

// Delete a project by ID
router.delete("/:id", authenticateAdmin, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).send("Project not found");
    res.send(`Deleted project with ID: ${req.params.id}`);
  } catch (err) {
    res.status(500).send("Error deleting the project");
  }
});

module.exports = router;
