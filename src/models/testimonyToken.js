const mongoose = require("mongoose");

const testimonyTokenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  company: {
    type: String,
    required: true,
    trim: true,
  },
  position: {
    type: String,
    required: true,
    trim: true,
  },
  testimony: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
    default: Date.now,
    index: { expires: "300s" }, // This token will expire in 5 mins
  },
});

const TestimonyToken = mongoose.model("TestimonyToken", testimonyTokenSchema);

module.exports = TestimonyToken;
