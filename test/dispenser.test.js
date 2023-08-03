// imports
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const Dispenser = require("../models/Dispenser");

const { expect } = chai;
chai.use(chaiHttp);

it("should add a new dispenser to the database", async () => {
  const dispenserData = {
    flow_volume: 25,
    is_open: false,
    total_usage_time: 0,
    total_money_made: 0,
  };

  const res = await chai.request(app).post("/dispensers").send(dispenserData);

  expect(res).to.have.status(201);
  expect(res.body).to.be.an("object");
  expect(res.body).to.have.property("flow_volume", dispenserData.flow_volume);
  expect(res.body).to.have.property("is_open", dispenserData.is_open);
  expect(res.body).to.have.property(
    "total_usage_time",
    dispenserData.total_usage_time
  );
  expect(res.body).to.have.property(
    "total_money_made",
    dispenserData.total_money_made
  );

  // Check if the dispenser is added to the database
  const createdDispenser = await Dispenser.findById(res.body._id);
  expect(createdDispenser).to.not.be.null;
  expect(createdDispenser.flow_volume).to.equal(dispenserData.flow_volume);
  expect(createdDispenser.is_open).to.equal(dispenserData.is_open);
  expect(createdDispenser.total_usage_time).to.equal(
    dispenserData.total_usage_time
  );
  expect(createdDispenser.total_money_made).to.equal(
    dispenserData.total_money_made
  );
});

// Describe the test suite
describe("Dispenser API", () => {
  // Define a hook to run before each test
  beforeEach(async () => {
    // Remove all dispensers from the database before each test
    await Dispenser.deleteMany({});
  });

  // Test case to check if a dispenser is added to the database successfully
  it("should add a dispenser to the database", async () => {
    const dispenserData = {
      flow_volume: 25,
      is_open: false,
      total_usage_time: 0,
      total_money_made: 0,
    };

    const res = await chai.request(app).post("/dispensers").send(dispenserData);

    expect(res).to.have.status(201);
    expect(res.body).to.be.an("object");
    expect(res.body).to.have.property("_id");
    expect(res.body).to.have.property("flow_volume", dispenserData.flow_volume);
    expect(res.body).to.have.property("is_open", dispenserData.is_open);
    expect(res.body).to.have.property(
      "total_usage_time",
      dispenserData.total_usage_time
    );
    expect(res.body).to.have.property(
      "total_money_made",
      dispenserData.total_money_made
    );

    // Verify that there is exactly one dispenser in the database after adding
    const dispensers = await Dispenser.find();
    expect(dispensers).to.have.lengthOf(1);
  });
});

// Describe the test suite
describe("Dispenser API", () => {
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
      total_usage_time: 0,
      total_money_made: 0,
    };
    const createdDispenser = await Dispenser.create(dispenserData);

    // Make a request to get the specific dispenser by ID
    const res = await chai
      .request(app)
      .get(`/dispensers/${createdDispenser._id}`);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an("object");
    expect(res.body).to.have.property("_id", createdDispenser._id.toString());
    expect(res.body).to.have.property("flow_volume", dispenserData.flow_volume);
    expect(res.body).to.have.property("is_open", dispenserData.is_open);
    expect(res.body).to.have.property(
      "total_usage_time",
      dispenserData.total_usage_time
    );
    expect(res.body).to.have.property(
      "total_money_made",
      dispenserData.total_money_made
    );
  });

  // Test case for handling the scenario when the specific dispenser is not found
  it("should return 404 when specific dispenser is not found", async () => {
    // Make a request to get a dispenser with a non-existent ID
    const nonExistentId = "60c98b8d8d913e001c5840aa"; // Assuming this ID does not exist in the database
    const res = await chai.request(app).get(`/dispensers/${nonExistentId}`);

    expect(res).to.have.status(404);
    expect(res.body).to.have.property("message", "Dispenser not found.");
  });
});

// Describe the test suite
describe("Dispenser API", () => {
  // Define a hook to run before each test
  beforeEach(async () => {
    // Remove all dispensers from the database before each test
    await Dispenser.deleteMany({});
  });

  // Test case to update a specific dispenser's is_open status
  it("should update a specific dispenser's is_open status", async () => {
    // Create a new dispenser and save it to the database
    const dispenserData = {
      flow_volume: 25,
      is_open: false,
      total_usage_time: 0,
      total_money_made: 0,
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

  // Test case for handling the scenario when updating a non-existent dispenser
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
