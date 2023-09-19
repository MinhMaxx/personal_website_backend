const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const configHelper = require("../helpers/configHelper");

// Fetch all testimonials
router.get("/", (req, res) => {
  // Show only the verified testimonial in the database
  res.send("All testimonials");
});

// Add a new testimonial
router.post("/submit", async (req, res) => {
  const { name, email, testimony } = req.body;

  // Generate a unique token
  // This can be done using crypto or any other method you prefer.
  const verificationToken = `Encryepted_Token_${email}`;

  // Store the testimonial in the database with a flag indicating it's not yet verified along with the token.

  // Send an email with nodemailer containing the verification token or link
  const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: configHelper.getNotifyEmailAccount().email,
      pass: configHelper.getNotifyEmailAccount().password,
    },
  });

  const mailOptions = {
    from: configHelper.getNotifyEmailAccount().email,
    to: email,
    subject: "Verify your testimonial for Binh Minh Nguyen",
    text: `Hi ${name},\n\nYour testimonial for Minh Nguyen is "${testimony}"\nYour verification token is: ${verificationToken}\nPlease use it to verify on the my website\n\nThank you,\nMinh Nguyen.`,
  };

  await transporter.sendMail(mailOptions);

  res.send("Please verify it with the code sent to your email.");
});

router.post("/verify", (req, res) => {
  const { token, email } = req.body;
  // Verify the token and email. If valid, mark the testimonial as verified.
  if (token === `Encryepted_Token_${email}`) res.send("Testimonial verified.");
  else {
    return res.status(406).send("Token Expired or Incorrect");
  }
});

module.exports = router;
