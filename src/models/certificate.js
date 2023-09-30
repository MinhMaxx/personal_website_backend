const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  organization: {
    type: String,
    required: true,
    trim: true,
  },
  certificateName: {
    type: String,
    required: true,
    trim: true,
  },
  dateReceived: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  link: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model("Certificate", certificateSchema);
