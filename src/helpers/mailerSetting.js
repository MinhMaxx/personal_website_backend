const nodemailer = require("nodemailer");
const configHelper = require("./configHelper");

let transporter;

if (configHelper.isPrivateEmailServiceEnabled()) {
  // This is for private email service
  transporter = nodemailer.createTransport({
    host: configHelper.getPrivateEmailService().host,
    port: configHelper.getPrivateEmailService().port,
    secure: configHelper.getPrivateEmailService().secure,
    auth: {
      user: configHelper.getPrivateEmailService().user,
      pass: configHelper.getPrivateEmailService().pass,
    },
    debug: true, // Enable debug output
    logger: true, // Log information in console
  });

  console.log("Email:", configHelper.getPrivateEmailService().user); // For debugging purposes only, remove afterwards
  console.log("Password:", configHelper.getPrivateEmailService().password); // For debugging purposes only, mask or remove afterwards
} else {
  // This is for services like Gmail, Yahoo, etc.
  transporter = nodemailer.createTransport({
    service: configHelper.getNotifyEmailAccount().service,
    auth: {
      user: configHelper.getNotifyEmailAccount().email,
      pass: configHelper.getNotifyEmailAccount().password,
    },
  });
}

module.exports = transporter;
