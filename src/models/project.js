const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
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
  technologiesUsed: {
    type: [String],
  },
  link: {
    type: String,
    trim: true,
  },
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
