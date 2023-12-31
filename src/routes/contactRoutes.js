// Import necessary modules
const express = require("express");
const router = express.Router();
const configHelper = require("../helpers/configHelper");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");
const transporter = require("../helpers/mailerSetting");

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 requests per windowMs
  message:
    "Too many requests created from this IP, please try again after an hour",
});

// Define a route to handle the submission of the contact form
router.post("/submit", contactLimiter, async (req, res) => {
  try {
    // Destructuring the name, email, and message from the request body
    const { name, email, message } = req.body;

    //Using private email or normal email service
    let sender;
    if (configHelper.getPrivateEmailService().enabled) {
      sender = configHelper.getPrivateEmailService().user;
    } else {
      sender = configHelper.getNotifyEmailAccount().email;
    }

    // Mail options specifying sender, recipient, subject, and body
    const mailOptions = {
      from: {
        name: configHelper.getFrontendWebUrlLink(),
        address: sender,
      },
      to: configHelper.getContactEmail(), // Destination email address as the personal email from config
      subject: `You have an message from ${name} at ${email}`, // Subject line of the email
      text: message, // Body of the email
    };

    // Sending the email using the nodemailer transport
    await transporter.sendMail(mailOptions);

    // If email was sent successfully, send a success response back to the client
    res.status(200).json({ status: "Message sent" });
  } catch (err) {
    // If there's any error in the process, send an error response to the client
    res.status(500).json("Error when sending email");
  }
});

// Export the router for use in other parts of the application
module.exports = router;
