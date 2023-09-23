const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const Testimony = require("../models/testimony");
const TestimonyToken = require("../models/testimonyToken");
const nodemailer = require("nodemailer");
const configHelper = require("../helpers/configHelper");
const authenticateAdmin = require("../helpers/authMiddleware");
const { check, validationResult } = require("express-validator");

// Fetch all testimonies
router.get("/", async (req, res) => {
  try {
    const testimonies = await Testimony.find(); // Fetch only verified testimonies
    res.status(200).json(testimonies);
  } catch (err) {
    res.status(500).send("Error fetching testimony");
  }
});

router.post(
  "/submit",
  [
    // Validation middleware
    check("name").notEmpty().withMessage("Name is required"),
    check("email").isEmail().withMessage("Provide a valid email address"),
    check("testimony").notEmpty().withMessage("Testimony cannot be empty"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, testimony } = req.body;

      // Generate a random token for verification
      const token = crypto.randomBytes(16).toString("hex");
      const expiryDate = Date.now() + 300; // Token valid for 5 minutes

      const verifyToken = new TestimonyToken({
        name,
        email,
        testimony,
        token,
        expiryDate,
      });

      await verifyToken.save();

      const transporter = nodemailer.createTransport({
        service: configHelper.getNotifyEmailAccount().service,
        auth: {
          user: configHelper.getNotifyEmailAccount().email,
          pass: configHelper.getNotifyEmailAccount().password,
        },
      });

      const verificationLink =
        configHelper.getMode() == "development"
          ? `${configHelper.getProtocol()}://${configHelper.getServerUrl()}:${configHelper.getPort()}/testimonial/verify/${token}`
          : `${configHelper.getProtocol()}://${configHelper.getServerUrl()}/testimonial/verify/${token}`;

      const mailOptions = {
        from: configHelper.getNotifyEmailAccount().email,
        to: email,
        subject: "Verify your testimony for Binh Minh Nguyen",
        html: `
        <p>Hi ${name},</p>
        <p>Your testimony for Minh Nguyen is: "${testimony}"</p>
        <a href="${verificationLink}">Click here to verify your testimony.</a>
        <p>Thank you,</p>
        <p>Minh Nguyen.</p>`,
      };

      console.log();

      await transporter.sendMail(mailOptions);

      res
        .status(200)
        .send("Testimony submitted! Please check your email for verification.");
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
    }
  }
);

router.get("/verify/:token", async (req, res) => {
  try {
    const verifyToken = await TestimonyToken.findOne({
      token: req.params.token,
    });

    if (!verifyToken) {
      return res.status(400).send("Invalid or expired token.");
    }

    const testimony = new Testimony({
      name: verifyToken.name,
      email: verifyToken.email,
      content: verifyToken.testimony,
    });

    await testimony.save();

    // Delete the verification token after use
    await TestimonyToken.deleteOne({ _id: verifyToken._id });

    res.status(200).send("Testimony verified and saved!");
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

// Delete a project by ID
router.delete("/:id", authenticateAdmin, async (req, res) => {
  try {
    const testimony = await Testimony.findByIdAndDelete(req.params.id);
    if (!testimony) return res.status(404).send("Testimony not found");
    res.send(`Deleted testimony with ID: ${req.params.id}`);
  } catch (err) {
    res.status(500).send("Error deleting the testimony");
  }
});

module.exports = router;
