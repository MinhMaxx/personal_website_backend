const express = require("express");
const router = express.Router();
const authenticateAdmin = require("../helpers/authMiddleware");
const Certificate = require("../models/certificate");
const { body, validationResult } = require("express-validator");

const certificateValidation = [
  body("organization")
    .isString()
    .withMessage("Organization must be a string")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Organization is required"),
  body("certificateName")
    .isString()
    .withMessage("Certificate Name must be a string")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Certificate Name is required"),
  body("dateReceived")
    .isDate()
    .withMessage("Date Received must be a valid date"),
  body("link")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("Link must be a valid URL"),
];

// Fetch all certificates
router.get("/", async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ dateReceived: -1 });
    res.json(certificates);
  } catch (err) {
    res.status(500).send("Error fetching certificates");
  }
});

// Fetch a specific certificate by ID
router.get("/:id", async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) return res.status(404).send("Certificate not found");
    res.json(certificate);
  } catch (err) {
    res.status(500).send("Error fetching the certificate");
  }
});

// Add a new certificate
router.post("/", authenticateAdmin, certificateValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const certificate = new Certificate(req.body);
  try {
    await certificate.save();
    res.status(201).json(certificate);
  } catch (err) {
    res.status(500).send("Error saving the certificate");
  }
});

// Update an existing certificate by ID
router.put(
  "/:id",
  authenticateAdmin,
  certificateValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const updatedCertificate = await Certificate.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedCertificate)
        return res.status(404).send("Certificate not found");
      res.json(updatedCertificate);
    } catch (err) {
      res.status(500).send("Error updating the certificate");
    }
  }
);

// Delete a certificate by ID
router.delete("/:id", authenticateAdmin, async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndDelete(req.params.id);
    if (!certificate) return res.status(404).send("Certificate not found");
    res.send(`Deleted certificate with ID: ${req.params.id}`);
  } catch (err) {
    res.status(500).send("Error deleting the certificate");
  }
});

module.exports = router;
