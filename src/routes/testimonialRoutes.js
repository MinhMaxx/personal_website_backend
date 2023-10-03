const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const Testimony = require("../models/testimony");
const TestimonyToken = require("../models/testimonyToken");
const nodemailer = require("nodemailer");
const configHelper = require("../helpers/configHelper");
const authenticateAdmin = require("../helpers/authMiddleware");
const { check, validationResult } = require("express-validator");

const transporter = nodemailer.createTransport({
  service: configHelper.getNotifyEmailAccount().service,
  auth: {
    user: configHelper.getNotifyEmailAccount().email,
    pass: configHelper.getNotifyEmailAccount().password,
  },
});

// Fetch all testimonies
router.get("/", async (req, res) => {
  try {
    const testimonies = await Testimony.find({ adminApproved: true }); // Fetch only verified and admin aprroved testimonies
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
      const { name, email, company, position, link, testimony } = req.body;

      // Check if a testimony with the provided email already exists
      const existingTestimony = await Testimony.findOne({ email });
      if (existingTestimony) {
        return res
          .status(400)
          .send("A testimony with this email already exists.");
      }

      // Check if a testimony token with the provided email already exists
      const existingTestimonyToken = await TestimonyToken.findOne({ email });
      if (existingTestimonyToken) {
        return res
          .status(400)
          .send("A testimony with this email is awaiting verification.");
      }

      // Generate a random token for verification
      const token = crypto.randomBytes(16).toString("hex");
      const expiryDate = Date.now() + 300000; // Token valid for 5 minutes

      const verifyToken = new TestimonyToken({
        name,
        email,
        company,
        position,
        link,
        testimony,
        token,
        expiryDate,
      });

      await verifyToken.save();

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
      return res.status(400).send("Invalid token.");
    }

    // Check for token expiry
    if (Date.now() > verifyToken.expiryDate) {
      // If the current time is greater than the token's expiry time, the token has expired.
      return res.status(400).send("Token has expired.");
    }

    const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const testimony = new Testimony({
      name: verifyToken.name,
      email: verifyToken.email,
      company: verifyToken.company,
      position: verifyToken.position,
      link: verifyToken.link,
      content: verifyToken.testimony,
      adminApproved: false,
      expireAt: sevenDaysFromNow,
    });

    await testimony.save();

    // Notify admin of the new pending testimony
    const adminEmail = configHelper.getContactEmail();
    const subject = "New Pending Testimony for Approval";
    const html = `
      <p>There is a new testimony pending approval from ${testimony.name} (${testimony.email}).</p>
      <p>Testimony: "${testimony.content}"</p>
    `; // Modify the URL to where the admin can approve the testimony

    const mailOptions = {
      from: configHelper.getNotifyEmailAccount().email,
      to: adminEmail,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);

    // Delete the verification token after use
    await TestimonyToken.deleteOne({ _id: verifyToken._id });

    res
      .status(200)
      .send("Testimony verified and saved! Awaiting admin approval.");
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

// Fetch all non-approved testimonies
router.get("/pending", authenticateAdmin, async (req, res) => {
  try {
    const testimonies = await Testimony.find({ adminApproved: false });
    res.status(200).json(testimonies);
  } catch (err) {
    res.status(500).send("Error fetching pending testimonies");
  }
});

// Approve a testimony by ID
router.put("/approve/:id", authenticateAdmin, async (req, res) => {
  try {
    const testimony = await Testimony.findByIdAndUpdate(
      req.params.id,
      {
        adminApproved: true,
        $unset: { expireAt: 1 }, // Remove the expireAt field to ensure the testimony is not auto-deleted
      },
      { new: true }
    );

    if (!testimony) return res.status(404).send("Testimony not found");

    res.status(200).json({
      message: "Testimony approved successfully!",
      testimony,
    });
  } catch (err) {
    res.status(500).send("Error approving the testimony");
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
