const sinon = require("sinon");
const { expect } = require("chai");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../../src/helpers/authMiddleware");
const BlacklistedToken = require("../../src/models/blackListedTokẹn");
const configHelper = require("../../src/helpers/configHelper");

// Main test suite for the authentication middleware
describe("authMiddleware", () => {
  let mockReq, mockRes, nextSpy, sandbox;

  // Run before each test in this describe block
  beforeEach(() => {
    sandbox = sinon.createSandbox(); // Create a sandbox instance for isolated stubbing and spying

    // Mock request object
    mockReq = {
      headers: {},
    };

    // Mock response object
    mockRes = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // Spy on next middleware function
    nextSpy = sinon.spy();
  });

  // Run after each test in this describe block
  afterEach(() => {
    sandbox.restore(); // Restore original methods and clear the sandbox
  });

  // Test suite for missing Authorization header
  it("should return 401 if no Authorization header is present", async () => {
    await authMiddleware(mockReq, mockRes, nextSpy);
    expect(mockRes.status.calledWith(401)).to.be.true;
    expect(
      mockRes.json.calledWithMatch({
        message: "Authentication token is missing or invalid",
      })
    ).to.be.true;
  });

  // Test suite for blacklisted tokens
  it("should return 401 if token is blacklisted", async () => {
    mockReq.headers.authorization = "Bearer blacklistedtoken";
    sandbox
      .stub(BlacklistedToken, "findOne")
      .returns(Promise.resolve({ token: "blacklistedtoken" }));

    await authMiddleware(mockReq, mockRes, nextSpy);
    expect(mockRes.status.calledWith(401)).to.be.true;
    expect(
      mockRes.json.calledWithMatch({
        message: "Session expired. Please log in again.",
      })
    ).to.be.true;
  });

  // Test suite for invalid tokens
  it("should return 401 if token is invalid", async () => {
    mockReq.headers.authorization = "Bearer invalidtoken";
    sandbox.stub(BlacklistedToken, "findOne").returns(Promise.resolve());
    sandbox.stub(jwt, "verify").yields(new Error(), null); // Simulate jwt.verify() callback with an error

    await authMiddleware(mockReq, mockRes, nextSpy);
    expect(mockRes.status.calledWith(401)).to.be.true;
    expect(
      mockRes.json.calledWithMatch({
        message: "Authentication failed. Invalid token.",
      })
    ).to.be.true;
  });

  // Test suite for valid tokens
  it("should proceed to next middleware if token is valid", async () => {
    mockReq.headers.authorization = "Bearer validtoken";
    const fakeDecoded = { username: "john" };
    sandbox.stub(BlacklistedToken, "findOne").returns(Promise.resolve());
    sandbox.stub(jwt, "verify").yields(null, fakeDecoded); // Simulate jwt.verify() callback with no error
    sandbox.stub(configHelper, "getJwtSecret").returns("secret");

    await authMiddleware(mockReq, mockRes, nextSpy);
    expect(nextSpy.calledOnce).to.be.true;
    expect(mockReq.user).to.eql(fakeDecoded);
  });
});
