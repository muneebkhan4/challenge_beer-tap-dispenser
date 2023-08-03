// imports
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const Dispenser = require("../models/Dispenser");

const { expect } = chai;
chai.use(chaiHttp);

describe("POST /dispensers", () => {
  // Test case to create a new dispenser
  it("should add a new dispenser to the database", async () => {
    const dispenserData = {
      flow_volume: 25,
      is_open: false,
    };

    const res = await chai.request(app).post("/dispensers").send(dispenserData);

    expect(res).to.have.status(201);
    expect(res.body).to.be.an("object");
    expect(res.body).to.have.property("flow_volume", dispenserData.flow_volume);
    expect(res.body).to.have.property("is_open", dispenserData.is_open);

    // Check if the dispenser is added to the database
    const createdDispenser = await Dispenser.findById(res.body._id);
    expect(createdDispenser).to.not.be.null;
    expect(createdDispenser.flow_volume).to.equal(dispenserData.flow_volume);
    expect(createdDispenser.is_open).to.equal(dispenserData.is_open);
  });

  // Test case for missing flow_volume field
  it("should return 400 when flow_volume is not provided", async () => {
    const dispenserData = {
      is_open: false,
    };

    const res = await chai.request(app).post("/dispensers").send(dispenserData);

    expect(res).to.have.status(400);
    expect(res.body).to.have.property("message", "Flow volume is required.");
  });

  // Test case for optional fields with default values
  it("should add a new dispenser with default values for optional fields", async () => {
    const dispenserData = {
      flow_volume: 25,
    };

    const res = await chai.request(app).post("/dispensers").send(dispenserData);

    expect(res).to.have.status(201);
    expect(res.body).to.be.an("object");
    expect(res.body).to.have.property("flow_volume", dispenserData.flow_volume);
    expect(res.body).to.have.property("is_open", false);

    // Check if the dispenser is added to the database
    const createdDispenser = await Dispenser.findById(res.body._id);
    expect(createdDispenser).to.not.be.null;
    expect(createdDispenser.flow_volume).to.equal(dispenserData.flow_volume);
    expect(createdDispenser.is_open).to.equal(false);
  });

  // Test case for handling server errors
  it("should return 500 when encountering an error while creating the dispenser", async () => {
    const dispenserData = {
      flow_volume: 25,
      is_open: false,
    };

    // Inject an error by passing an invalid data object
    const res = await chai
      .request(app)
      .post("/dispensers")
      .send({ invalidField: "invalidValue" });

    expect(res).to.have.status(400);
    expect(res.body).to.have.property("message", "Flow volume is required.");
  });
});

describe("PATCH /dispensers/:id", () => {
  it("should update a specific dispenser's is_open status", async () => {
    // Create a new dispenser and save it to the database
    const dispenserData = {
      flow_volume: 25,
      is_open: false,
    };
    const createdDispenser = await Dispenser.create(dispenserData);

    // Make a PATCH request to update the specific dispenser's is_open status
    const updatedIsOpenStatus = true; // Set the is_open status to true
    const res = await chai
      .request(app)
      .patch(`/dispensers/${createdDispenser._id}`)
      .send({ is_open: updatedIsOpenStatus });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("message", "Updated dispenser.");

    // Verify that the dispenser's is_open status is updated in the database
    const updatedDispenser = await Dispenser.findById(createdDispenser._id);
    expect(updatedDispenser).to.have.property("is_open", updatedIsOpenStatus);
  });

  it("should return 404 when updating a non-existent dispenser", async () => {
    // Make a PATCH request to update a dispenser with a non-existent ID
    const nonExistentId = "60c98b8d8d913e001c5840aa"; // Assuming this ID does not exist in the database
    const updatedIsOpenStatus = true;
    const res = await chai
      .request(app)
      .patch(`/dispensers/${nonExistentId}`)
      .send({ is_open: updatedIsOpenStatus });

    expect(res).to.have.status(404);
    expect(res.body).to.have.property("message", "Dispenser not found.");
  });
});

describe("GET /dispensers", () => {
  // Define a hook to run before each test
  beforeEach(async () => {
    // Remove all dispensers from the database before each test
    await Dispenser.deleteMany({});
  });

  // Test case to retrieve all dispensers
  it("should retrieve all dispensers", async () => {
    // Create some test dispensers
    const dispenserData1 = {
      flow_volume: 25,
      is_open: false,
    };
    const dispenserData2 = {
      flow_volume: 30,
      is_open: true,
    };

    await Dispenser.create(dispenserData1);
    await Dispenser.create(dispenserData2);

    const res = await chai.request(app).get("/dispensers");

    expect(res).to.have.status(200);
    expect(res.body).to.be.an("array");
    expect(res.body).to.have.lengthOf(2);

    // Verify the data of the first dispenser
    expect(res.body[0]).to.have.property(
      "flow_volume",
      dispenserData1.flow_volume
    );
    expect(res.body[0]).to.have.property("is_open", dispenserData1.is_open);

    // Verify the data of the second dispenser
    expect(res.body[1]).to.have.property(
      "flow_volume",
      dispenserData2.flow_volume
    );
    expect(res.body[1]).to.have.property("is_open", dispenserData2.is_open);
  });

  // Test case for handling server errors
  it("should return 500 when encountering an error while retrieving dispensers", async () => {
    // Inject an error by passing an invalid query parameter
    const res = await chai.request(app).get("/dispensers?invalidParam=true");

    expect(res).to.have.status(500);
    expect(res.body).to.have.property(
      "message",
      "Error retrieving dispensers."
    );
  });
});

describe("GET /dispensers/:id", () => {
  // Define a hook to run before each test
  beforeEach(async () => {
    // Remove all dispensers from the database before each test
    await Dispenser.deleteMany({});
  });

  // Test case to retrieve a specific dispenser by ID
  it("should retrieve a specific dispenser by ID", async () => {
    // Create a new dispenser and save it to the database
    const dispenserData = {
      flow_volume: 25,
      is_open: false,
    };
    const createdDispenser = await Dispenser.create(dispenserData);

    const res = await chai
      .request(app)
      .get(`/dispensers/${createdDispenser._id}`);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an("object");
    expect(res.body).to.have.property("_id", createdDispenser._id.toString());
    expect(res.body).to.have.property("flow_volume", dispenserData.flow_volume);
    expect(res.body).to.have.property("is_open", dispenserData.is_open);
  });

  // Test case for handling the scenario when the specific dispenser is not found
  it("should return 404 when specific dispenser is not found", async () => {
    // Make a request to get a dispenser with a non-existent ID
    const nonExistentId = "60c98b8d8d913e001c5840aa"; // Assuming this ID does not exist in the database
    const res = await chai.request(app).get(`/dispensers/${nonExistentId}`);

    expect(res).to.have.status(404);
    expect(res.body).to.have.property("message", "Dispenser not found.");
  });

  // Test case for handling server errors
  it("should return 500 when encountering an error while retrieving the dispenser", async () => {
    // Create a new dispenser and save it to the database
    const dispenserData = {
      flow_volume: 25,
      is_open: false,
    };
    const createdDispenser = await Dispenser.create(dispenserData);

    // Inject an error by passing an invalid ID
    const res = await chai.request(app).get(`/dispensers/invalidId`);

    expect(res).to.have.status(500);
    expect(res.body).to.have.property("message", "Error retrieving dispenser.");
  });
});
