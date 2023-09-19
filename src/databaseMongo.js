const mongoose = require("mongoose");
const configHelper = require("./helpers/configHelper");

// Export a function to connect to MongoDB using configuration from configHelper
exports.mongooseConnection = async () => {
  // Retrieve MongoDB configuration from the helper
  const mongoConfig = configHelper.getMongoConfig();

  // Determine the user and password for the MongoDB connection string
  var userPass =
    mongoConfig.user && mongoConfig.password
      ? `${mongoConfig.user}:${mongoConfig.password}@`
      : "";

  // Determine the authSource for the MongoDB connection string
  const authSource = mongoConfig.authSource
    ? `?authSource=${mongoConfig.database}`
    : "";

  // Determine the port for the MongoDB connection string
  const port = mongoConfig.port ? `:${mongoConfig.port}` : "";

  // Construct the full MongoDB connection URI
  var mongoDB = `mongodb+srv://${userPass}${mongoConfig.host}${
    mongoConfig.port ? mongoConfig.port + "/" : ""
  }${mongoConfig.database}${authSource}${mongoConfig.additionalParameters}`;

  //Invoked function expression to handle the actual connection
  (async () => {
    try {
      console.log(`Connecting to MongoDB...`);

      // Attempt to connect to MongoDB with the constructed URI
      await mongoose.connect(mongoDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      console.log(`Connected to MongoDB`);
    } catch (err) {
      // Log any error that occurs during connection
      console.error(`Database error: ${err.message}`);
    }
  })();
};
