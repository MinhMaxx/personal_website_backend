const nodemailer = require("nodemailer");
const configHelper = require("./configHelper");

let transporter;

if (configHelper.getPrivateEmailService().enabled) {
  // This is for private email service
  transporter = nodemailer.createTransport({
    host: configHelper.getPrivateEmailService().host,
    port: configHelper.getPrivateEmailService().port,
    secure: configHelper.getPrivateEmailService().secure,
    auth: {
      user: configHelper.getPrivateEmailService().user, // Ensure this is getting the correct email
      pass: configHelper.getPrivateEmailService().password, // Ensure this is getting the correct password
    },
    debug: true, // will log more information
    logger: true, // will log information in console
  });

  console.log(configHelper.getPrivateEmailService().user); // For debug, ensure this is printing the correct email
  console.log(
    "Password is set:",
    !!configHelper.getPrivateEmailService().password
  ); // For debug, it will print true if password is set, false otherwise. Avoid logging the actual password in production.
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
