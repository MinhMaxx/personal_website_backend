const request = require("supertest");
const sinon = require("sinon");
const { expect } = require("chai");
const app = require("../../src/server");
const Project = require("../../src/models/project");
const jwt = require("jsonwebtoken");

// Main test suite for the Project routes
describe("Project Routes", () => {
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

  describe("GET /project", () => {
    it("should fetch all projects", async () => {
      const res = await request(app).get("/project");
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
    });
  });

  describe("GET /project/:id", () => {
    let projectId;

    before(async () => {
      const project = new Project({
        name: "Test Project",
        description: "Test Description",
        startDate: new Date(),
      });
      await project.save();
      projectId = project._id;
    });

    it("should fetch a valid project", async () => {
      const res = await request(app).get(`/project/${projectId}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("name", "Test Project");
      expect(res.body).to.have.property("description", "Test Description");
    });

    after(async () => {
      await Project.findByIdAndDelete(projectId);
    });
  });

  describe("POST /project", () => {
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

      // Cleanup
      after(async () => {
        await Project.findByIdAndDelete(res.body._id);
      });
    });
  });

  describe("PUT /project/:id", () => {
    let projectId;

    before(async () => {
      const project = new Project({
        name: "Project to Update",
        description: "Description to update",
        startDate: new Date(),
      });
      await project.save();
      projectId = project._id;
    });

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

    after(async () => {
      await Project.findByIdAndDelete(projectId);
    });
  });

  describe("DELETE /project/:id", () => {
    let projectId;

    before(async () => {
      const project = new Project({
        name: "Project to Delete",
        description: "Description to delete",
        startDate: new Date(),
      });
      await project.save();
      projectId = project._id;
    });

    it("should successfully delete a project", async () => {
      const res = await request(app)
        .delete(`/project/${projectId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).to.equal(200);
      expect(res.text).to.include(`Deleted project with ID: ${projectId}`);
    });

    after(async () => {
      await Project.findByIdAndDelete(projectId);
    });
  });
});
