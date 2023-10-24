const request = require("supertest");
const { expect } = require("chai");
const app = require("../../src/server");
const BlacklistedToken = require("../../src/models/blackListedTokẹn");

// Main test suite for the Admin Routes
describe("Admin Routes", async () => {
  // Test suite for the POST /login endpoint
  describe("POST /login", () => {
    // Test scenario: Checking validation failure
    it("should return a 422 if validation fails", async () => {
      const res = await request(app)
        .post("/admin/login")
        .send({ username: "short", password: "12" });
      expect(res.status).to.equal(422);
      expect(res.body.errors).to.be.an("array");
    });

    // Test scenario: Checking incorrect credentials
    it("should return a 401 for incorrect credentials", async () => {
      const res = await request(app)
        .post("/admin/login")
        .send({ username: "wrongUser", password: "wrongPass" });
      expect(res.status).to.equal(401);
      expect(res.body.message).to.equal("Incorrect credentials");
    });

    // Test scenario: Checking successful login
    it("should return a token for valid credentials", async () => {
      const validCredentials = {
        username: process.env.ADMIN_TEST_USERNAME,
        password: process.env.ADMIN_TEST_PASSWORD,
      };
      const res = await request(app)
        .post("/admin/login")
        .send(validCredentials);
      expect(res.status).to.equal(200);
      expect(res.body.token).to.exist;
      expect(res.body.message).to.equal("Login successful");
    });
  });

  // Note: This route is under development and the test is currently commented out.
  // describe("GET /", () => {
  //   it("should return a list of all admin settings", async () => {
  // let token;
  // beforeEach(async () => {
  //   const validCredentials = {
  //     username: process.env.ADMIN_TEST_USERNAME,
  //     password: process.env.ADMIN_TEST_PASSWORD,
  //   };
  //   const loginRes = await request(app)
  //     .post("/admin/login")
  //     .send(validCredentials);
  //   token = loginRes.body.token;
  // });
  //     const res = await request(app)
  //       .get("/admin/")
  //       .set("authorization", `Bearer ${token}`);
  //     expect(res.status).to.equal(200);
  //     expect(res.text).to.equal("List of all admin setting");
  //   });
  // });

  // Test suite for the POST /logout endpoint
  describe("POST /logout", () => {
    let token;

    // Before each test, login and fetch the token to be used in the tests
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

    // Test scenario: Successfully logging out with a token
    it("should return a 200 when logging out with a valid token", async () => {
      const res = await request(app)
        .post("/admin/logout")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).to.equal(200);
      expect(res.text).to.equal("Logged out successfully");
    });

    // Test scenario: Trying to logout without a token
    it("should return a 401 if not authenticated (no token provided)", async () => {
      const res = await request(app).post("/admin/logout");
      expect(res.status).to.equal(401);
    });

    // Cleanup: After all the tests in this suite, clear the blacklisted tokens
    after(async () => {
      await BlacklistedToken.deleteMany();
    });
  });
});
