const sinon = require("sinon");
const request = require("supertest");
const { expect } = require("chai");
const mongoose = require("mongoose");
const app = require("../../src/server");
const Testimonial = require("../../src/models/testimonial");
const TestimonialToken = require("../../src/models/testimonialToken");
const transporter = require("../../src/helpers/mailerSetting");
const jwt = require("jsonwebtoken");

describe("Testimonial Routes", () => {
  let token;
  let testimonialId;
  let sendMailStub;

  before(async () => {
    token = sinon.stub(jwt, "verify");
    token.yields(null, { username: process.env.ADMIN_TEST_USERNAME });
    const testimonial = new Testimonial({
      name: "Test Name",
      email: "test@example.com",
      company: "Test Company",
      position: "Test Position",
      content: "Test content",
    });
    await testimonial.save();
    testimonialId = testimonial._id;
    sendMailStub = sinon
      .stub(transporter, "sendMail")
      .returns(Promise.resolve());
  });

  after(() => {
    token.restore();
    sendMailStub.restore();
  });

  describe("GET /testimonial", () => {
    it("should fetch all approved testimonials", async () => {
      const res = await request(app).get("/testimonial");
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
    });
  });

  describe("POST /testimonial/submit", () => {
    it("should successfully submit a testimonial", async () => {
      const testimonialData = {
        name: "John Smith",
        email: "johnsmith@example.com",
        testimonial: "Post Testimonial Test",
        company: "Home",
        position: "Gamer",
      };

      const res = await request(app)
        .post("/testimonial/submit")
        .send(testimonialData);

      expect(sendMailStub.calledOnce).to.be.true;
      expect(res.status).to.equal(200);
      expect(res.text).to.include("Please check your email for verification.");
    });

    after(async () => {
      await TestimonialToken.deleteMany({
        testimonial: "Post Testimonial Test",
      });
    });
  });

  describe("GET /testimonial/verify/:token", () => {
    let verificationToken;

    before(async () => {
      // Create a sample TestimonialToken
      const tokenData = {
        token: "someToken",
        name: "John Smith",
        email: "johnsmith@example.com",
        testimonial: "Get Testimonial Verify Test",
        company: "Home",
        position: "Gamer",
        expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Set expiration 1 day into the future
      };

      const testimonialToken = new TestimonialToken(tokenData);
      await testimonialToken.save();
      verificationToken = testimonialToken.token;
    });

    it("should verify the testimonial token and create a new testimonial", async () => {
      const res = await request(app).get(
        `/testimonial/verify/${verificationToken}`
      );
      expect(res.status).to.equal(200);
      expect(res.text).to.include(
        "Testimonial verified! Awaiting admin approval."
      );

      // Additional tests to confirm that a Testimonial was actually created and an email was sent
      const createdTestimonial = await Testimonial.findOne({
        content: "Get Testimonial Verify Test",
      });
      expect(createdTestimonial).to.not.be.null;
      expect(createdTestimonial.name).to.equal("John Smith");
      expect(sendMailStub.called).to.be.true;
    });

    after(async () => {
      await TestimonialToken.deleteMany({ token: verificationToken });
      await Testimonial.deleteMany({
        content: "Get Testimonial Verify Test",
      });
    });
  });

  describe("GET /testimonial/pending", () => {
    it("should fetch all non-approved testimonials", async () => {
      const res = await request(app)
        .get("/testimonial/pending")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
    });
  });

  describe("PUT /testimonial/approve/:id", () => {
    it("should approve a testimonial", async () => {
      const res = await request(app)
        .put(`/testimonial/approve/${testimonialId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("adminApproved", true);
    });
  });

  describe("DELETE /testimonial/:id", () => {
    it("should delete a testimonial", async () => {
      console.log(testimonialId);
      const res = await request(app)
        .delete(`/testimonial/${testimonialId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).to.equal(200);
      expect(res.text).to.include(
        `Deleted testimonial with ID: ${testimonialId}`
      );
    });

    after(async () => {
      await Testimonial.findByIdAndDelete(testimonialId);
    });
  });
});
