const fs = require("fs");
const path = require("path");

// Set the current environment, defaulting to "development" if not explicitly set
const env = process.env.NODE_ENV || "development";

// Determine the path of the appropriate config file based on the environment
const configFile = path.join(__dirname, "../../config", `${env}.json`);
// Read the content of the config file synchronously and convert it to string
const rawData = fs.readFileSync(configFile, "utf-8");
// Parse the string content to obtain a JavaScript object
const configData = JSON.parse(rawData);

// Extract the configuration specific to the current environment
const currentConfig = configData[env];

// Exporting various functions to fetch specific configuration values
module.exports = {
  // Fetch application name
  getAppName: () => currentConfig.name,
  // Fetch port number
  getPort: () => currentConfig.port,
  // Fetch mode (e.g. development or production)
  getMode: () => currentConfig.mode,
  // Fetch the protocol (e.g. http or https)
  getProtocol: () => currentConfig.protocol,
  // Fetch the server URL
  getServerUrl: () => currentConfig.serverUrl,
  // Fetch the server web URL link
  getServerWebUrlLink: () => currentConfig.serverUrlWebUrlLink,
  // Fetch MongoDB specific configurations
  getMongoConfig: () => ({
    multipleStatements: currentConfig.mongo.multipleStatements,
    host: currentConfig.mongo.host,
    port: currentConfig.mongo.port,
    user: currentConfig.mongo.user,
    password: currentConfig.mongo.password,
    database: currentConfig.mongo.database,
    additionalParameters: currentConfig.mongo.additionalParameters,
  }),
  // Fetch admin credentials (username and password)
  getAdminCredentials: () => ({
    username: currentConfig.admin.username,
    password: currentConfig.admin.password,
  }),
  // Fetch notification email account details (service, email, password)
  getNotifyEmailAccount: () => ({
    service: currentConfig.notifyEmailAccount.service,
    email: currentConfig.notifyEmailAccount.email,
    password: currentConfig.notifyEmailAccount.password,
  }),
  // Fetch the contact email address
  getContactEmail: () => currentConfig.contactEmail,
};
