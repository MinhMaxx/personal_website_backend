const express = require("express");
const adminRoutes = require("./routes/adminRoutes");
const contactRoutes = require("./routes/contactRoutes");
const employmentHistoryRoutes = require("./routes/employmentHistoryRoutes");
const projectRoutes = require("./routes/projectRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const { mongooseConnection } = require("./databaseMongo");
const configHelper = require("./helpers/configHelper");
const bodyParser = require("body-parser");

// Initialize the Express app
const app = express();

// Middleware to parse JSON payloads
app.use(bodyParser.json());

// Middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Mounting specific routes
app.use("/admin", adminRoutes); // Routes for admin-related tasks
app.use("/contact", contactRoutes); // Routes for handling contact requests
app.use("/employment", employmentHistoryRoutes); // Routes for managing employment histor
app.use("/project", projectRoutes); // Routes for managing projects
app.use("/testimonial", testimonialRoutes); // Routes for managing testimonials

// Function to start the server and establish a connection to the MongoDB database
const startServer = async () => {
  try {
    await mongooseConnection(); // Connecting to the MongoDB database

    // Start the server and listen on the specified port
    app.listen(configHelper.getPort(), () => {
      console.log(`Server is running on port: ${configHelper.getPort()}`);
      console.log(`Mode: ${configHelper.getMode()}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
};

// Invoke the function to start the server
startServer();
