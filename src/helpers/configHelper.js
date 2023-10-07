const fs = require("fs");
const path = require("path");

// Set the current environment, defaulting to "development" if not explicitly set
const env = process.env.NODE_ENV || "development";

const configFile = path.join(__dirname, "../../config", `${env}.json`);
const rawData = fs.readFileSync(configFile, "utf-8");
const configData = JSON.parse(rawData);
const currentConfig = configData[env];

// Exporting various functions to fetch specific configuration values
module.exports = {
  // Fetch application name
  getAppName: () => process.env.NAME || currentConfig.name,
  // Fetch port number
  getPort: () => process.env.PORT || currentConfig.port,
  // Fetch mode (e.g. development or production)
  getMode: () => process.env.MODE || currentConfig.mode,
  // Fetch the protocol (e.g. http or https)
  getProtocol: () => process.env.PROTOCOL || currentConfig.protocol,
  // Fetch the server URL
  getServerUrl: () => process.env.SERVER_URL || currentConfig.serverUrl,
  // Fetch the server web URL link
  getServerWebUrlLink: () =>
    process.env.SERVER_URL_WEB_URL_LINK || currentConfig.serverUrlWebUrlLink,
  // Fetch MongoDB specific configurations
  getMongoConfig: () => ({
    host: process.env.MONGO_HOST || currentConfig.mongo.host,
    port: process.env.MONGO_PORT || currentConfig.mongo.port,
    user: process.env.MONGO_USER || currentConfig.mongo.user,
    password: process.env.MONGO_PASSWORD || currentConfig.mongo.password,
    database: process.env.MONGO_DATABASE || currentConfig.mongo.database,
    additionalParameters:
      process.env.MONGO_ADDITIONAL_PARAMETERS ||
      currentConfig.mongo.additionalParameters,
  }),
  // Fetch admin credentials (username and password)
  getAdminCredentials: () => ({
    username: process.env.ADMIN_USERNAME || currentConfig.admin.username,
    password: process.env.ADMIN_PASSWORD || currentConfig.admin.password,
  }),
  // Fetch notification email account details (service, email, password)
  getNotifyEmailAccount: () => ({
    service:
      process.env.NOTIFY_EMAIL_SERVICE ||
      currentConfig.notifyEmailAccount.service,
    email: process.env.NOTIFY_EMAIL || currentConfig.notifyEmailAccount.email,
    password:
      process.env.NOTIFY_EMAIL_PASSWORD ||
      currentConfig.notifyEmailAccount.password,
  }),
  // Fetch the contact email address
  getContactEmail: () =>
    process.env.CONTACT_EMAIL || currentConfig.contactEmail,
  getTokenExpireDate: () =>
    process.env.TOKEN_EXPIRE_DATE || currentConfig.tokenExpireDate, // Added method to get token expiry
  getJwtSecret: () => process.env.JWT_SECRET || currentConfig.jwtSecret, // Added method to get JWT secret
  getFrontendWebUrlLink: () =>
    process.env.FRONTEND_URL_WEB_URL_LINK ||
    currentConfig.frontendUrlWebUrlLink, // Added method to get frontend URL

  // Private email service
  getPrivateEmailService: () => ({
    enabled:
      process.env.PRIVATE_EMAIL_ENABLED || currentConfig.privateEmail.enabled,
    host: process.env.PRIVATE_EMAIL_HOST || currentConfig.privateEmail.host,
    port: process.env.PRIVATE_EMAIL_PORT || currentConfig.privateEmail.port,
    user: process.env.PRIVATE_EMAIL_USER || currentConfig.privateEmail.user,
    password:
      process.env.PRIVATE_EMAIL_PASSWORD || currentConfig.privateEmail.password,
    secure:
      process.env.PRIVATE_EMAIL_SECURE || currentConfig.privateEmail.secure,
  }),
};
