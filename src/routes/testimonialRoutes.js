const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const Testimonial = require("../models/testimonial");
const TestimonialToken = require("../models/testimonialToken");
const nodemailer = require("nodemailer");
const configHelper = require("../helpers/configHelper");
const authenticateAdmin = require("../helpers/authMiddleware");
const { check, validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");
const transporter = require("../helpers/mailerSetting");

const testimonialLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 requests per windowMs
  message:
    "Too many testimonials created from this IP, please try again after an hour",
});

// Fetch all testimonies
router.get("/", async (req, res) => {
  try {
    const testimonies = await Testimonial.find({ adminApproved: true }); // Fetch only verified and admin aprroved testimonies
    res.status(200).json(testimonies);
  } catch (err) {
    res.status(500).send("Error fetching testimonial");
  }
});

router.post(
  "/submit",
  [
    // Validation middleware
    check("name").notEmpty().withMessage("Name is required"),
    check("email").isEmail().withMessage("Provide a valid email address"),
    check("testimonial").notEmpty().withMessage("Testimonial cannot be empty"),
  ],
  testimonialLimiter,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, company, position, link, testimonial } = req.body;

      // Check if a testimonial with the provided email already exists
      const existingTestimonial = await Testimonial.findOne({ email });
      if (existingTestimonial) {
        return res
          .status(400)
          .send("A testimonial with this email already exists.");
      }

      // Check if a testimonial token with the provided email already exists
      const existingTestimonialToken = await TestimonialToken.findOne({
        email,
      });
      if (existingTestimonialToken) {
        return res
          .status(400)
          .send("A testimonial with this email is awaiting verification.");
      }

      // Generate a random token for verification
      const token = crypto.randomBytes(16).toString("hex");
      const expiryDate = Date.now() + 300000; // Token valid for 5 minutes

      const verifyToken = new TestimonialToken({
        name,
        email,
        company,
        position,
        link,
        testimonial,
        token,
        expiryDate,
      });

      await verifyToken.save();

      //Switch to using frontend link in non-development mode
      const verificationLink =
        configHelper.getMode() == "development"
          ? `${configHelper.getProtocol()}://${configHelper.getServerUrl()}:${configHelper.getPort()}/testimonial/verify/${token}`
          : `${configHelper.getProtocol()}://${configHelper.getFrontendWebUrlLink()}/testimonial/verify/${token}`;

      //Support using private email
      let sender;
      if (configHelper.getPrivateEmailService().enabled) {
        sender = configHelper.getPrivateEmailService().user;
      } else {
        sender = configHelper.getNotifyEmailAccount().email;
      }

      const mailOptions = {
        from: {
          name: configHelper.getFrontendWebUrlLink(),
          address: sender,
        },
        name: configHelper.getFrontendWebUrlLink(),
        to: email,
        subject: "Please Confirm Your Testimonial for Binh Minh Nguyen",
        text: `Hello ${name},

          Thank you for your kind words about me. Your testimonial is "${testimonial}".

          To confirm your testimonial, please click the following link: ${verificationLink}

          Or copy and paste the URL into your browser: ${verificationLink}

          This link will expire in 5 minutes.

          Best regards,
          Minh Nguyen`,

        html: `
        <p>Hello ${name},</p>
        <p>Thank you for your kind words about me. Your testimonial is: "${testimonial}"</p>
        <p>To confirm your testimonial, please <a href="${verificationLink}" style="text-decoration:none;color:#007BFF;">click here</a>.</p>
        <p>Or copy and paste this URL into your browser: <span style="word-wrap:break-word;">${verificationLink}</span></p>
        <p><small>This link will expire in 5 minutes.</small></p>
        <p>Best regards,</p>
        <p>Minh Nguyen</p>`,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).send("Please check your email for verification.");
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
    }
  }
);

router.get("/verify/:token", async (req, res) => {
  try {
    const verifyToken = await TestimonialToken.findOne({
      token: req.params.token,
    });

    if (!verifyToken) {
      return res
        .status(400)
        .send("The verification link has expired, please try again");
    }

    // Check for token expiry
    if (Date.now() > verifyToken.expiryDate) {
      // If the current time is greater than the token's expiry time, the token has expired.
      return res
        .status(400)
        .send("The verification link has expired, please try again");
    }

    const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const testimonial = new Testimonial({
      name: verifyToken.name,
      email: verifyToken.email,
      company: verifyToken.company,
      position: verifyToken.position,
      link: verifyToken.link,
      content: verifyToken.testimonial,
      adminApproved: false,
      expireAt: sevenDaysFromNow,
    });

    await testimonial.save();

    // Notify admin of the new pending testimonial
    const adminEmail = configHelper.getContactEmail();
    const subject = "New Pending Testimonial for Approval";
    const html = `
      <p>There is a new testimonial pending approval from ${testimonial.name} (${testimonial.email}).</p>
      <p>Testimonial: "${testimonial.content}"</p>
    `;

    //Support using private email
    let sender;
    if (configHelper.getPrivateEmailService().enabled) {
      sender = configHelper.getPrivateEmailService().user;
    } else {
      sender = configHelper.getNotifyEmailAccount().email;
    }

    const mailOptions = {
      from: {
        name: configHelper.getFrontendWebUrlLink(),
        address: sender,
      },
      name: configHelper.getFrontendWebUrlLink(),
      to: adminEmail,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);

    // Delete the verification token after use
    await TestimonialToken.deleteOne({ _id: verifyToken._id });

    res.status(200).send("Testimonial verified! Awaiting admin approval.");
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

// Fetch all non-approved testimonies
router.get("/pending", authenticateAdmin, async (req, res) => {
  try {
    const testimonies = await Testimonial.find({ adminApproved: false });
    res.status(200).json(testimonies);
  } catch (err) {
    res.status(500).send("Error fetching pending testimonies");
  }
});

// Approve a testimonial by ID
router.put("/approve/:id", authenticateAdmin, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      {
        adminApproved: true,
        $unset: { expireAt: 1 }, // Remove the expireAt field to ensure the testimonial is not auto-deleted
      },
      { new: true }
    );

    if (!testimonial) return res.status(404).send("Testimonial not found");

    res.status(200).json({
      message: "Testimonial approved successfully!",
      testimonial,
    });
  } catch (err) {
    res.status(500).send("Error approving the testimonial");
  }
});

// Delete a project by ID
router.delete("/:id", authenticateAdmin, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) return res.status(404).send("Testimonial not found");
    res.send(`Deleted testimonial with ID: ${req.params.id}`);
  } catch (err) {
    res.status(500).send("Error deleting the testimonial");
  }
});

module.exports = router;
