const mongoose = require("mongoose");

const employmentHistorySchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
    index: true,
  },
  endDate: {
    type: Date,
  },
  description: {
    type: String,
  },
});

const EmploymentHistory = mongoose.model(
  "EmploymentHistory",
  employmentHistorySchema
);

module.exports = EmploymentHistory;
