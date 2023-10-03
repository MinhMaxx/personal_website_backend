const mongoose = require("mongoose");

const degreeSchema = new mongoose.Schema({
  institution: {
    type: String,
    required: true,
    trim: true,
  },
  degree: {
    type: String,
    required: true,
    trim: true,
  },
  fieldOfStudy: {
    type: String,
    required: true,
    trim: true,
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
    trim: true,
  },
});

const Degree = mongoose.model("Degree", degreeSchema);

module.exports = Degree;
