const request = require("supertest");
const sinon = require("sinon");
const { expect } = require("chai");
const app = require("../../src/server");
const Project = require("../../src/models/project");
const jwt = require("jsonwebtoken");

// Main test suite for Project routes
describe("Project Routes", () => {
  let token;

  // Runs before all tests in this suite
  before(() => {
    // Stubbing the jwt.verify method for token verification
    token = sinon.stub(jwt, "verify");
    // Configuring the stub to simulate successful token verification
    token.yields(null, { username: process.env.ADMIN_TEST_USERNAME });
  });

  // Cleanup: Runs after all tests in this suite
  after(() => {
    // Restoring the original jwt.verify method
    token.restore();
  });

  // Test suite for GET /project endpoint
  describe("GET /project", () => {
    // Test case for fetching all projects
    it("should fetch all projects", async () => {
      const res = await request(app).get("/project");
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
    });
  });

  // Test suite for GET /project/:id endpoint
  describe("GET /project/:id", () => {
    let projectId;
    // Runs before tests in this inner suite
    before(async () => {
      // Creating a test project and saving it to the database
      const project = new Project({
        name: "Test Project",
        description: "Test Description",
        startDate: new Date(),
      });
      await project.save();
      projectId = project._id;
    });

    // Test case for fetching a valid project
    it("should fetch a valid project", async () => {
      const res = await request(app).get(`/project/${projectId}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("name", "Test Project");
      expect(res.body).to.have.property("description", "Test Description");
    });

    // Cleanup: Runs after tests in this inner suite
    after(async () => {
      // Deleting the test project from the database
      await Project.findByIdAndDelete(projectId);
    });
  });

  // Test suite for POST /project endpoint
  describe("POST /project", () => {
    // Test case for invalid project data
    it("should return a 400 for invalid project data", async () => {
      const invalidData = {
        name: "",
        description: "",
      };
      const res = await request(app)
        .post("/project")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidData);
      expect(res.status).to.equal(400);
    });

    // Test case for successfully creating a project
    it("should successfully create a project", async () => {
      const projectData = {
        name: "New Project",
        description: "New Description",
        startDate: new Date().toISOString().split("T")[0],
      };
      const res = await request(app)
        .post("/project")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData);
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("name", "New Project");

      // Cleanup: Runs after tests in this inner suite
      after(async () => {
        // Deleting the newly created project from the database
        await Project.findByIdAndDelete(res.body._id);
      });
    });
  });

  // Test suite for PUT /project/:id endpoint
  describe("PUT /project/:id", () => {
    let projectId;

    // Runs before tests in this inner suite
    before(async () => {
      // Creating a test project and saving it to the database
      const project = new Project({
        name: "Project to Update",
        description: "Description to update",
        startDate: new Date(),
      });
      await project.save();
      projectId = project._id;
    });

    // Test case for successfully updating a project
    it("should successfully update a project", async () => {
      const updateData = {
        name: "Updated Project",
        description: "Updated Description",
        startDate: new Date().toISOString().split("T")[0],
      };
      const res = await request(app)
        .put(`/project/${projectId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("name", "Updated Project");
      expect(res.body).to.have.property("description", "Updated Description");
    });

    // Cleanup: Runs after tests in this inner suite
    after(async () => {
      // Deleting the test project from the database
      await Project.findByIdAndDelete(projectId);
    });
  });

  // Test suite for DELETE /project/:id endpoint
  describe("DELETE /project/:id", () => {
    let projectId;

    // Runs before tests in this inner suite
    before(async () => {
      // Creating a test project and saving it to the database
      const project = new Project({
        name: "Project to Delete",
        description: "Description to delete",
        startDate: new Date(),
      });
      await project.save();
      projectId = project._id;
    });

    // Test case for successfully deleting a project
    it("should successfully delete a project", async () => {
      const res = await request(app)
        .delete(`/project/${projectId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).to.equal(200);
      expect(res.text).to.include(`Deleted project with ID: ${projectId}`);
    });

    // Cleanup: Runs after tests in this inner suite
    after(async () => {
      // Deleting the test project from the database (if not already deleted)
      await Project.findByIdAndDelete(projectId);
    });
  });
});
