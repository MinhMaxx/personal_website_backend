const express = require("express");
const router = express.Router();
const authenticateAdmin = require("../helpers/authMiddleware");
const EmploymentHistory = require("../models/employmentHistory");
const { body, validationResult } = require("express-validator");

const employmentHistoryValidation = [
  body("position")
    .isString()
    .withMessage("Position must be a string")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Position is required"),

  body("company")
    .isString()
    .withMessage("Company must be a string")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Company is required"),

  body("startDate").isDate().withMessage("Start Date must be a valid date"),

  body("endDate")
    .optional({ checkFalsy: true })
    .isDate()
    .withMessage("End Date must be a valid date"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .trim()
    .isLength({ min: 1 }),
];

// Fetch all employment histories
router.get("/", async (req, res) => {
  try {
    const histories = await EmploymentHistory.find().sort({ startDate: -1 }); // Sorting by startDate in descending order
    res.json(histories);
  } catch (err) {
    res.status(500).send("Error fetching employment histories");
  }
});

// Fetch a specific employment history by ID
router.get("/:id", async (req, res) => {
  try {
    const history = await EmploymentHistory.findById(req.params.id);
    if (!history) return res.status(404).send("Employment history not found");
    res.json(history);
  } catch (err) {
    res.status(500).send("Error fetching the employment history");
  }
});

// Add a new employment history entry
router.post(
  "",
  authenticateAdmin,
  employmentHistoryValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const history = new EmploymentHistory(req.body);
    try {
      await history.save();
      res.status(201).send(history);
    } catch (err) {
      res.status(500).send("Error saving the employment history");
    }
  }
);

// Update an existing employment history by ID
router.put(
  "/:id",
  authenticateAdmin,
  employmentHistoryValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const updatedHistory = await EmploymentHistory.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedHistory)
        return res.status(404).send("Employment history not found");
      res.send(updatedHistory);
    } catch (err) {
      res.status(500).send("Error updating the employment history");
    }
  }
);

// Delete a specific employment history by ID
router.delete("/:id", authenticateAdmin, async (req, res) => {
  try {
    const history = await EmploymentHistory.findByIdAndDelete(req.params.id);
    if (!history) return res.status(404).send("Employment history not found");
    res.send(`Deleted employment history with ID: ${req.params.id}`);
  } catch (err) {
    res.status(500).send("Error deleting the employment history");
  }
});

// Export the router to be used in other parts of the application
module.exports = router;
