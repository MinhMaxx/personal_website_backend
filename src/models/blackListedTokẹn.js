const mongoose = require("mongoose");

const blacklistedTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
    required: true,
    index: { expires: "1h" }, // This token will expire in 1 hour
  },
});

const BlacklistedToken = mongoose.model(
  "BlacklistedToken",
  blacklistedTokenSchema
);

module.exports = BlacklistedToken;
