const request = require("supertest");
const { expect } = require("chai");
const sinon = require("sinon");
const app = require("../../src/server");
const transporter = require("../../src/helpers/mailerSetting");

// Main test suite for the Contact Routes
describe("Contact Routes", () => {
  // Test suite for the POST /contact endpoint
  describe("POST /contact", () => {
    let sendMailStub; // Define a variable to hold the stubbed method

    // Before each test, stub the sendMail method of the transporter to prevent actual emails being sent
    beforeEach(() => {
      sendMailStub = sinon.stub(transporter, "sendMail").resolves();
    });

    // After each test, restore the stubbed method to its original state
    afterEach(() => {
      sendMailStub.restore();
    });

    // Test case for successfully sending an email through the /contact/submit endpoint
    it("should successfully send an email", async () => {
      const contactData = {
        name: "John Smith",
        email: "johnsmith@example.com",
        message: "Hello! This is a test message.",
      };

      const res = await request(app).post("/contact/submit").send(contactData);

      // Assert that the response status is 200 (OK) and contains the expected message
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("status", "Message sent");
    });

    // Test case for handling errors when there's an issue sending an email
    it("should handle errors when sending an email", async () => {
      sendMailStub.rejects(new Error("Failed to send email"));

      const contactData = {
        name: "John Smith",
        email: "johnsmith@example.com",
        message: "Hello! This is a test message.",
      };

      const res = await request(app).post("/contact/submit").send(contactData);

      // Assert that the response status is 500 (Internal Server Error) and contains the expected error message
      expect(res.status).to.equal(500);
      expect(res.body).to.equal("Error when sending email");
    });
  });
});
