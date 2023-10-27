const request = require("supertest");
const sinon = require("sinon");
const { expect } = require("chai");
const app = require("../../src/server");
const EmploymentHistory = require("../../src/models/employmentHistory");
const jwt = require("jsonwebtoken");

describe("Employment History Routes", () => {
  let token;

  // Run before all tests in this describe block
  before(() => {
    // Stubbing jwt.verify method
    token = sinon.stub(jwt, "verify");
    // Setup stub to simulate successful token verification
    token.yields(null, { username: process.env.ADMIN_TEST_USERNAME });
  });

  // Run after all tests in this describe block
  after(() => {
    // Restore the original behavior
    token.restore();
  });

  describe("GET /employment", () => {
    it("should fetch all employment histories", async () => {
      const res = await request(app).get("/employment");
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
    });
  });

  describe("GET /employment/:id", () => {
    let historyId;

    before(async () => {
      const history = new EmploymentHistory({
        position: "Test Position",
        company: "Test Company",
        startDate: new Date(),
      });
      await history.save();
      historyId = history._id;
    });

    it("should fetch a valid employment history", async () => {
      const res = await request(app).get(`/employment/${historyId}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("position", "Test Position");
      expect(res.body).to.have.property("company", "Test Company");
    });

    after(async () => {
      await EmploymentHistory.findByIdAndDelete(historyId);
    });
  });

  describe("POST /employment", () => {
    it("should return a 400 for invalid employment history data", async () => {
      const invalidData = {
        position: "",
        company: "",
      };
      const res = await request(app)
        .post("/employment")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidData);
      expect(res.status).to.equal(400);
    });

    it("should successfully create an employment history", async () => {
      const historyData = {
        position: "New Position",
        company: "New Company",
        startDate: new Date().toISOString().split("T")[0],
      };
      const res = await request(app)
        .post("/employment")
        .set("Authorization", `Bearer ${token}`)
        .send(historyData);
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("position", "New Position");
      expect(res.body).to.have.property("company", "New Company");

      // Cleanup
      after(async () => {
        await EmploymentHistory.findByIdAndDelete(res.body._id);
      });
    });

    it("should return a 401 if the token is missing or invalid", async () => {
      const historyData = {
        position: "Unauth Position",
        company: "Unauth Company",
        startDate: new Date().toISOString().split("T")[0],
      };
      const res = await request(app).post("/employment").send(historyData);
      expect(res.status).to.equal(401);
    });
  });

  // Test suite for PUT request to update an employment history
  describe("PUT /employment/:id", () => {
    let historyId;

    before(async () => {
      const history = new EmploymentHistory({
        position: "Developer",
        company: "Test Company",
        startDate: new Date(),
        description: "Test description",
      });
      await history.save();
      historyId = history._id;
    });

    it("should successfully update an employment history", async () => {
      const updateData = {
        position: "Updated Developer",
        company: "Updated Company",
        startDate: new Date().toISOString().split("T")[0],
        description: "Updated description",
        endDate: new Date().toISOString().split("T")[0],
      };
      const res = await request(app)
        .put(`/employment/${historyId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("position", "Updated Developer");
      expect(res.body).to.have.property("company", "Updated Company");
      expect(res.body).to.have.property("description", "Updated description");
    });

    after(async () => {
      await EmploymentHistory.findByIdAndDelete(historyId);
    });
  });

  // Test suite for DELETE request to delete an employment history
  describe("DELETE /employment/:id", () => {
    let historyId;

    before(async () => {
      const history = new EmploymentHistory({
        position: "To Delete Developer",
        company: "To Delete Company",
        startDate: new Date(),
        description: "To delete description",
      });
      await history.save();
      historyId = history._id;
    });

    it("should successfully delete an employment history", async () => {
      const res = await request(app)
        .delete(`/employment/${historyId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).to.equal(200);
      expect(res.text).to.include(
        `Deleted employment history with ID: ${historyId}`
      );
    });

    after(async () => {
      await EmploymentHistory.findByIdAndDelete(historyId);
    });
  });
});
