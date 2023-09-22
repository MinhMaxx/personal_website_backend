const mongoose = require("mongoose");

const testimonySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: [/\S+@\S+\.\S+/, "Email is invalid"], // Basic email validation
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Testimony = mongoose.model("Testimony", testimonySchema);

module.exports = Testimony;
