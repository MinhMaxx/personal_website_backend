const express = require("express");
const router = express.Router();
const Degree = require("../models/degree");
const authenticateAdmin = require("../helpers/authMiddleware");
const { body, validationResult } = require("express-validator");

const degreeValidation = [
  body("institution").not().isEmpty().withMessage("Institution is required"),
  body("degree").not().isEmpty().withMessage("Degree is required"),
  body("fieldOfStudy")
    .not()
    .isEmpty()
    .withMessage("Field of Study is required"),
  body("startDate").isDate().withMessage("Start Date must be a valid date"),
  body("endDate")
    .optional({ checkFalsy: true })
    .isDate()
    .withMessage("End Date must be a valid date"),
];

// Fetch all degrees
router.get("/", async (req, res) => {
  try {
    const degrees = await Degree.find().sort({ startDate: 1 }); // Sort degrees by startDate in ascending order
    res.json(degrees);
  } catch (err) {
    res.status(500).send("Error fetching degrees");
  }
});

// Fetch a specific degree by ID
router.get("/:id", async (req, res) => {
  try {
    const degree = await Degree.findById(req.params.id);
    if (!degree) return res.status(404).send("Degree not found");
    res.json(degree);
  } catch (err) {
    res.status(500).send("Error fetching the degree");
  }
});

// Add a new degree
router.post("/", authenticateAdmin, degreeValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const degree = new Degree(req.body);
    await degree.save();
    res.status(201).json(degree);
  } catch (err) {
    res.status(500).send("Error saving the degree");
  }
});

// Update an existing degree by ID
router.put("/:id", authenticateAdmin, degreeValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const degree = await Degree.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!degree) {
      return res.status(404).send("Degree not found");
    }
    res.json(degree);
  } catch (err) {
    res.status(500).send("Error updating the degree");
  }
});

// Delete a degree by ID
router.delete("/:id", authenticateAdmin, async (req, res) => {
  try {
    const degree = await Degree.findByIdAndDelete(req.params.id);
    if (!degree) {
      return res.status(404).send("Degree not found");
    }
    res.send(`Deleted degree with ID: ${req.params.id}`);
  } catch (err) {
    res.status(500).send("Error deleting the degree");
  }
});

module.exports = router;
