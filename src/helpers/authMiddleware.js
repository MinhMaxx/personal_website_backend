// Import necessary modules
const configHelper = require("./configHelper");

// Middleware function to authenticate admin requests
module.exports = (req, res, next) => {
  // Extract admin credentials from the configuration
  const { username, password } = configHelper.getAdminCredentials();

  // Retrieve the 'authorization' header from the incoming request
  const authHeader = req.headers["authorization"];

  // Check if the 'authorization' header is missing
  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Authentication header is missing" });
  }

  // Parse the 'authorization' header, which is expected to be in the format: Basic base64(username:password)
  const base64Credentials = authHeader.split(" ")[1];
  // Convert the base64 encoded string back to its original form (ascii)
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii"
  );
  // Split the credentials into username and password
  const [inputUsername, inputPassword] = credentials.split(":");

  // Compare the provided credentials with the expected credentials
  if (inputUsername !== username || inputPassword !== password) {
    return res.status(401).json({ message: "Incorrect credentials" });
  }

  // If authentication is successful, attach a user object to the request object
  req.user = { isAdmin: true };

  // Move to the next middleware or route handler
  next();
};
