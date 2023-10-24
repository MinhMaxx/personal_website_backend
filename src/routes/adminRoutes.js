// Import necessary modules
const express = require("express");
const router = express.Router();
const configHelper = require("../helpers/configHelper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const authMiddleware = require("../helpers/authMiddleware");
const BlacklistedToken = require("../models/blackListedTokẹn");

const loginValidationRules = [
  body("username")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Username is required.")
    .isLength({ min: 3 })
    .withMessage("Username should be at least 3 characters long."),

  body("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 characters long."),
];

//Login route
router.post("/login", loginValidationRules, async (req, res) => {
  //Validating username and password
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { username, password } = req.body;
  const { username: adminUsername, password: hashedAdminPassword } =
    configHelper.getAdminCredentials();
  const secret = configHelper.getJwtSecret();

  // bcrypt compare
  const passwordMatch = await bcrypt.compare(password, hashedAdminPassword);

  if (username === adminUsername && passwordMatch) {
    // If credentials are correct, generate a JWT
    const token = jwt.sign({ isAdmin: true }, secret, { expiresIn: "1h" });
    res.status(200).json({
      message: "Login successful",
      token: token,
    });
  } else {
    res.status(401).json({ message: "Incorrect credentials" });
  }
});

// Get list of all my admin setting
router.get("/", authMiddleware, (req, res) => {
  res.send("List of all admin setting");
});

router.post("/logout", authMiddleware, async (req, res) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const newBlacklistedToken = new BlacklistedToken({
      token: token,
    });

    await newBlacklistedToken.save();

    res.status(200).send("Logged out successfully");
  } catch (err) {
    res.status(500).send("Error logging out");
  }
});

// Export the router to be used in other parts of the application
module.exports = router;
