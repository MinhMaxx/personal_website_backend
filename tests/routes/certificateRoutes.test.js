const request = require("supertest");
const { expect } = require("chai");
const app = require("../../src/server");
const Certificate = require("../../src/models/certificate");

// Main test suite for the Certificate routes
describe("Certificate Routes", async () => {
  // Test suite for GET request to fetch all certificates
  describe("GET /certificate", () => {
    it("should fetch all certificates", async () => {
      const res = await request(app).get("/certificate");
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
    });
  });

  // Test suite for fetching a single certificate by ID
  describe("GET /certificate/:id", () => {
    let certificateId;

    // Before running tests, create a sample certificate for testing
    before(async () => {
      const certificate = new Certificate({
        organization: "Test Org",
        certificateName: "Test Certificate",
        dateReceived: new Date(),
      });
      await certificate.save();
      certificateId = certificate._id;
    });

    it("should fetch a valid certificate", async () => {
      const res = await request(app).get(`/certificate/${certificateId}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("organization", "Test Org");
      expect(res.body).to.have.property("certificateName", "Test Certificate");
    });

    // Cleanup: Remove the test certificate after test completion
    after(async () => {
      await Certificate.findByIdAndDelete(certificateId);
    });
  });

  // Test suite for creating a new certificate
  describe("POST /certificate", () => {
    let token;

    // Before each test, authenticate to get a token for making authorized requests
    beforeEach(async () => {
      const validCredentials = {
        username: process.env.ADMIN_TEST_USERNAME,
        password: process.env.ADMIN_TEST_PASSWORD,
      };
      const loginRes = await request(app)
        .post("/admin/login")
        .send(validCredentials);
      token = loginRes.body.token;
    });

    // Test case for invalid certificate data
    it("should return a 400 for invalid certificate data", async () => {
      const invalidData = {
        organization: "",
        certificateName: "",
      };
      const res = await request(app)
        .post("/certificate")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidData);
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("errors");
    });

    // Test case for creating a valid certificate
    it("should successfully create a certificate", async () => {
      const certificateData = {
        organization: "New Org",
        certificateName: "New Certificate",
        dateReceived: new Date().toISOString().split("T")[0], // Sending date in 'YYYY-MM-DD' format
      };
      const res = await request(app)
        .post("/certificate")
        .set("Authorization", `Bearer ${token}`)
        .send(certificateData);
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("organization", "New Org");
      expect(res.body).to.have.property("certificateName", "New Certificate");

      // Cleanup: Remove the created certificate after test completion
      after(async () => {
        await Certificate.findByIdAndDelete(res.body._id);
      });
    });

    // Test case for unauthorized request (missing/invalid token)
    it("should return a 401 if the token is missing or invalid", async () => {
      const certificateData = {
        organization: "Without Auth",
        certificateName: "Without Auth Certificate",
        dateReceived: new Date().toISOString().split("T")[0],
      };
      const res = await request(app).post("/certificate").send(certificateData);
      expect(res.status).to.equal(401);
    });
  });

  // Test suite for updating an existing certificate
  describe("PUT /certificate/:id", () => {
    let token;
    let certificateId;

    // Authenticate and get a token for making authorized requests
    beforeEach(async () => {
      const validCredentials = {
        username: process.env.ADMIN_TEST_USERNAME,
        password: process.env.ADMIN_TEST_PASSWORD,
      };
      const loginRes = await request(app)
        .post("/admin/login")
        .send(validCredentials);
      token = loginRes.body.token;
    });

    // Before running tests, create a sample certificate for testing
    before(async () => {
      const certificate = new Certificate({
        organization: "Old Org",
        certificateName: "Old Certificate",
        dateReceived: new Date().toISOString().split("T")[0],
      });
      await certificate.save();
      certificateId = certificate._id;
    });

    // Test case for invalid update data
    it("should return a 400 for invalid update data", async () => {
      const invalidData = {
        organization: "",
        certificateName: "",
        dateReceived: new Date().toISOString().split("T")[0],
      };
      const res = await request(app)
        .put(`/certificate/${certificateId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(invalidData);
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("errors");
    });

    // Test case for updating a certificate
    it("should successfully update a certificate", async () => {
      const updateData = {
        organization: "Updated Org",
        certificateName: "Updated Certificate",
        dateReceived: new Date().toISOString().split("T")[0],
      };
      const res = await request(app)
        .put(`/certificate/${certificateId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("organization", "Updated Org");
      expect(res.body).to.have.property(
        "certificateName",
        "Updated Certificate"
      );
    });

    // Test case for a non-existent certificate ID
    it("should return a 404 for a non-existent certificate ID", async () => {
      const nonExistentId = "603f650a095aad2e3c7e4a44";
      const updateData = {
        organization: "Non Existent ID Org",
        certificateName: "Non Existent ID Certificate",
        dateReceived: new Date().toISOString().split("T")[0],
      };
      const res = await request(app)
        .put(`/certificate/${nonExistentId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData);
      expect(res.status).to.equal(404);
    });

    // Test case for unauthorized request
    it("should return a 401 if the token is missing or invalid", async () => {
      const updateData = {
        organization: "Without Auth Update",
        certificateName: "Without Auth Update",
        dateReceived: new Date().toISOString().split("T")[0],
      };
      const res = await request(app)
        .put(`/certificate/${certificateId}`)
        .send(updateData);
      expect(res.status).to.equal(401);
    });

    // Cleanup: Remove the test certificate after test completion
    after(async () => {
      await Certificate.findByIdAndDelete(certificateId);
    });
  });

  // Test suite for deleting an existing certificate
  describe("DELETE /certificate/:id", () => {
    let token;
    let certificateId;

    // Authenticate and get a token for making authorized requests
    beforeEach(async () => {
      const validCredentials = {
        username: process.env.ADMIN_TEST_USERNAME,
        password: process.env.ADMIN_TEST_PASSWORD,
      };
      const loginRes = await request(app)
        .post("/admin/login")
        .send(validCredentials);
      token = loginRes.body.token;
    });

    // Before running tests, create a sample certificate for testing
    before(async () => {
      const certificate = new Certificate({
        organization: "To Delete Org",
        certificateName: "To Delete Certificate",
        dateReceived: new Date(),
      });
      await certificate.save();
      certificateId = certificate._id;
    });

    // Test case for deleting a certificate
    it("should successfully delete a certificate", async () => {
      const res = await request(app)
        .delete(`/certificate/${certificateId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).to.equal(200);
      expect(res.text).to.include(
        `Deleted certificate with ID: ${certificateId}`
      );
    });

    // Test case for a non-existent certificate ID
    it("should return a 404 for a non-existent certificate ID", async () => {
      const nonExistentId = "603f650a095aad2e3c7e4a44";
      const res = await request(app)
        .delete(`/certificate/${nonExistentId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).to.equal(404);
    });

    // Test case for unauthorized request
    it("should return a 401 if the token is missing or invalid", async () => {
      const res = await request(app).delete(`/certificate/${certificateId}`);
      expect(res.status).to.equal(401);
    });
  });
});
