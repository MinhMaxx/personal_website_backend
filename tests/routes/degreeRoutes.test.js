const request = require("supertest");
const sinon = require("sinon");
const { expect } = require("chai");
const app = require("../../src/server");
const Degree = require("../../src/models/degree");
const jwt = require("jsonwebtoken");

// Main test suite for Degree Routes testing
describe("Degree Routes", async () => {
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

  // Test for for GET request to fetch all degrees
  describe("GET /degree", () => {
    it("should fetch all degrees", async () => {
      const res = await request(app).get("/degree");
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
    });
  });

  // Test for fetching a specific degree by ID
  describe("GET /degree/:id", () => {
    let degreeId;

    // Before running tests, create a sample degree for testing
    before(async () => {
      const degree = new Degree({
        institution: "Test Institution",
        degree: "Test Degree",
        fieldOfStudy: "Test Field",
        startDate: new Date(),
        description: "Test Description",
      });
      await degree.save();
      degreeId = degree._id;
    });

    it("should fetch a valid degree", async () => {
      const res = await request(app).get(`/degree/${degreeId}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("institution", "Test Institution");
      expect(res.body).to.have.property("degree", "Test Degree");
    });

    // Cleanup: Remove the test degree
    after(async () => {
      await Degree.findByIdAndDelete(degreeId);
    });
  });

  // Test suite for creating a new degree
  describe("POST /degree", () => {
    // Test case for invalid degree data
    it("should return a 400 for invalid degree data", async () => {
      const invalidData = {
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        description: "",
      };
      const res = await request(app)
        .post("/degree")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidData);
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("errors");
    });

    // Test case for creating a valid degree
    it("should successfully create a degree", async () => {
      const degreeData = {
        institution: "New Institution",
        degree: "New Degree",
        fieldOfStudy: "New Field",
        startDate: new Date().toISOString().split("T")[0],
        description: "New Description",
      };
      const res = await request(app)
        .post("/degree")
        .set("Authorization", `Bearer ${token}`)
        .send(degreeData);
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("institution", "New Institution");
      expect(res.body).to.have.property("degree", "New Degree");

      // Cleanup: Remove the newly created degree
      after(async () => {
        await Degree.findByIdAndDelete(res.body._id);
      });
    });

    // Test case for unauthorized request (missing/invalid token)
    it("should return a 401 if the token is missing or invalid", async () => {
      const degreeData = {
        institution: "Without Auth Institution",
        degree: "Without Auth Degree",
        fieldOfStudy: "Without Auth Field",
        startDate: new Date().toISOString().split("T")[0],
        description: "Without Auth Description",
      };
      const res = await request(app).post("/degree").send(degreeData);
      expect(res.status).to.equal(401);
    });
  });

  // Test suite for updating an existing degree
  describe("PUT /degree/:id", () => {
    let degreeId;

    // Before running tests, create a sample degree for testing
    before(async () => {
      const degree = new Degree({
        institution: "Old Institution",
        degree: "Old Degree",
        fieldOfStudy: "Old Field",
        startDate: new Date().toISOString().split("T")[0],
        description: "Old Description",
      });
      await degree.save();
      degreeId = degree._id;
    });

    // Test case for invalid update data
    it("should return a 400 for invalid update data", async () => {
      const invalidData = {
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startDate: new Date().toISOString().split("T")[0],
        description: "",
      };
      const res = await request(app)
        .put(`/degree/${degreeId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(invalidData);
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("errors");
    });

    // Test case for updating a degree
    it("should successfully update a degree", async () => {
      const updateData = {
        institution: "Updated Institution",
        degree: "Updated Degree",
        fieldOfStudy: "Updated Field",
        startDate: new Date().toISOString().split("T")[0],
        description: "Updated Description",
      };
      const res = await request(app)
        .put(`/degree/${degreeId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("institution", "Updated Institution");
      expect(res.body).to.have.property("degree", "Updated Degree");
    });

    // Test case for a non-existent degree ID
    it("should return a 404 for a non-existent degree ID", async () => {
      const nonExistentId = "603f650a095aad2e3c7e4a44";
      const updateData = {
        institution: "Non Existent ID Institution",
        degree: "Non Existent ID Degree",
        fieldOfStudy: "Non Existent ID Field",
        startDate: new Date().toISOString().split("T")[0],
        description: "Non Existent ID Description",
      };
      const res = await request(app)
        .put(`/degree/${nonExistentId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData);
      expect(res.status).to.equal(404);
    });

    // Test case for unauthorized request
    it("should return a 401 if the token is missing or invalid", async () => {
      const updateData = {
        institution: "No Auth Updated Institution",
        degree: "No Auth Updated Degree",
        fieldOfStudy: "No Auth Updated Field",
        startDate: new Date().toISOString().split("T")[0],
        description: "No Auth Updated Description",
      };
      const res = await request(app)
        .put(`/degree/${degreeId}`)
        .send(updateData);
      expect(res.status).to.equal(401);
    });

    // Cleanup: Remove the test degree
    after(async () => {
      await Degree.findByIdAndDelete(degreeId);
    });
  });

  // Test for deleting a existing degree
  describe("DELETE /degree/:id", () => {
    let degreeId;

    // Before running tests, create a sample degree for testing
    before(async () => {
      const degree = new Degree({
        institution: "To Be Deleted Institution",
        degree: "To Be Deleted Degree",
        fieldOfStudy: "To Be Deleted Field",
        startDate: new Date().toISOString().split("T")[0],
        description: "To Be Deleted Description",
      });
      await degree.save();
      degreeId = degree._id;
    });

    // Test case for deleting a degree
    it("should successfully delete a degree", async () => {
      const res = await request(app)
        .delete(`/degree/${degreeId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).to.equal(200);
    });

    // Test case for a non-existent degree ID
    it("should return a 404 for a non-existent degree ID", async () => {
      const nonExistentId = "603f650a095aad2e3c7e4a44";
      const res = await request(app)
        .delete(`/degree/${nonExistentId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).to.equal(404);
    });

    // Test case for unauthorized request
    it("should return a 401 if the token is missing or invalid", async () => {
      const res = await request(app).delete(`/degree/${degreeId}`);
      expect(res.status).to.equal(401);
    });

    // Cleanup: Remove the created degree after test completion (if test failed)
    after(async () => {
      await Degree.findByIdAndDelete(degreeId);
    });
  });
});
