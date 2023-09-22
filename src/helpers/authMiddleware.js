const jwt = require("jsonwebtoken");
const configHelper = require("./configHelper");
const BlacklistedToken = require("../models/blackListedTokẹn");

// Middleware function to authenticate admin requests
module.exports = async (req, res, next) => {
  // Retrieve the 'authorization' header from the incoming request
  const authHeader = req.headers["authorization"];

  // Check if the 'authorization' header is missing or doesn't start with 'Bearer'
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authentication token is missing or invalid" });
  }

  // Extract the token from the header
  const token = authHeader.split(" ")[1];

  const blacklistedToken = await BlacklistedToken.findOne({ token: token });
  if (blacklistedToken) {
    return res
      .status(401)
      .json({ message: "Session expired. Please log in again." });
  }

  // Verify the token using JWT
  jwt.verify(token, configHelper.getJwtSecret(), (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "Authentication failed. Invalid token." });
    }

    // If token verification is successful, attach the decoded payload to the request object
    req.user = decoded;

    // Move to the next middleware or route handler
    next();
  });
};
