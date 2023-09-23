// Import necessary modules
const express = require("express");
const router = express.Router();
const configHelper = require("../helpers/configHelper");
const nodemailer = require("nodemailer");

// Define a route to serve the contact form page
router.get("/", (req, res) => {
  // TODO: Render a proper contact form template instead of sending a placeholder text
  res.send("Contact form page");
});

// Define a route to handle the submission of the contact form
router.post("/submit", async (req, res) => {
  try {
    // Destructuring the name, email, and message from the request body
    const { name, email, message } = req.body;

    // Setting up nodemailer transport with configurations fetched from the helper
    const transporter = nodemailer.createTransport({
      service: configHelper.getNotifyEmailAccount().service,
      auth: {
        user: configHelper.getNotifyEmailAccount().email,
        pass: configHelper.getNotifyEmailAccount().password,
      },
    });

    // Mail options specifying sender, recipient, subject, and body
    const mailOptions = {
      from: configHelper.getNotifyEmailAccount().email, // Use the email used to notify from config for the "from" field
      to: configHelper.getContactEmail(), // Destination email address as the personal email from config
      subject: `You have an message from ${name} at ${email}`, // Subject line of the email
      text: message, // Body of the email
    };

    // Sending the email using the nodemailer transport
    await transporter.sendMail(mailOptions);

    // If email was sent successfully, send a success response back to the client
    res.status(200).json({ status: "Message sent" });
  } catch (err) {
    // If there's any error in the process, log it and send an error response to the client
    console.log(`Error when sending email: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

// Export the router for use in other parts of the application
module.exports = router;
