const mongoose = require("mongoose");

const testimonialTokenSchema = new mongoose.Schema({
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
  link: {
    type: String,
    trim: true,
  },
  testimonial: {
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
    index: { expires: "900s" }, // This token will expire in 15 mins
  },
});

const TestimonialToken = mongoose.model(
  "TestimonialToken",
  testimonialTokenSchema
);

module.exports = TestimonialToken;
