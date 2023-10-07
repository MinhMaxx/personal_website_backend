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
  });
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
