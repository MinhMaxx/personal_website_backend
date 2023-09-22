const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const Testimony = require("../models/testimony");
const TestimonyToken = require("../models/testimonyToken");
const nodemailer = require("nodemailer");
const configHelper = require("../helpers/configHelper");
const { check, validationResult } = require("express-validator");

// Fetch all testimonials
router.get("/", async (req, res) => {
  try {
    const testimonials = await Testimony.find(); // Fetch only verified testimonials
    res.status(200).json(testimonials);
  } catch (err) {
    res.status(500).send("Error fetching testimonials");
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
        service: configHelper.getNotifyEmailAccount.service,
        auth: {
          user: configHelper.getNotifyEmailAccount().email,
          pass: configHelper.getNotifyEmailAccount().password,
        },
      });

      const mailOptions = {
        from: configHelper.getNotifyEmailAccount().email,
        to: email,
        subject: "Verify your testimonial for Binh Minh Nguyen",
        html: `
        <p>Hi ${name},</p>
        <p>Your testimonial for Minh Nguyen is: "${testimony}"</p>
        <a href="${configHelper.getProtocol()}://${configHelper.getServerWebUrlLink()}/testimonial/verify/${token}">Click here to verify your testimonial.</a>
        <p>Thank you,</p>
        <p>Minh Nguyen.</p>`,
      };

      await transporter.sendMail(mailOptions);

      res
        .status(200)
        .send("Testimony submitted! Please check your email for verification.");
    } catch (err) {
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

module.exports = router;
