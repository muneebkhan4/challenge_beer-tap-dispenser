// imports
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const Dispenser = require("../models/Dispenser");
const DispenserUsage = require("../models/DispenserUsage");
const dispenserUsageWorker = require("../dispenserUsageWorker");

const { expect } = chai;
chai.use(chaiHttp);

describe("GET /dispenser_usage/:id/usage_count", () => {
  it("should return the correct usage count for a valid dispenser", async () => {
    // Create a new dispenser
    const dispenser = await Dispenser.create({
      flow_volume: 25,
      is_open: false,
    });

    // Create two dispenser usages associated with the dispenser
    await DispenserUsage.create({ dispenser: dispenser._id });
    await DispenserUsage.create({ dispenser: dispenser._id });

    const res = await chai
      .request(app)
      .get(`/dispenser_usage/${dispenser._id}/usage_count`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("usage_count", 2);
  });

  it("should return 0 for a dispenser without any usage", async () => {
    // Create a new dispenser
    const dispenser = await Dispenser.create({
      flow_volume: 25,
      is_open: false,
    });

    const res = await chai
      .request(app)
      .get(`/dispenser_usage/${dispenser._id}/usage_count`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("usage_count", 0);
  });

  it("should return 404 for a non-existent dispenser", async () => {
    const nonExistentId = "60c98b8d8d913e001c5840aa"; // Assuming this ID does not exist in the database
    const res = await chai
      .request(app)
      .get(`/dispenser_usage/${nonExistentId}/usage_count`);

    expect(res).to.have.status(404);
    expect(res.body).to.have.property("message", "Dispenser not found.");
  });
});

describe("GET /dispenser_usage/:id/total_usage_time", () => {
  it("should return the correct total usage time for a valid dispenser", async () => {
    // Create a new dispenser
    const dispenser = await Dispenser.create({
      flow_volume: 25,
      is_open: false,
    });

    // Create two dispenser usages associated with the dispenser
    const usage1 = await DispenserUsage.create({
      dispenser: dispenser._id,
      start_time: new Date(),
      end_time: new Date(Date.now() + 5000),
    });
    const usage2 = await DispenserUsage.create({
      dispenser: dispenser._id,
      start_time: new Date(),
      end_time: new Date(Date.now() + 10000),
    });

    const res = await chai
      .request(app)
      .get(`/dispenser_usage/${dispenser._id}/total_usage_time`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("total_usage_time", 15); // 5 seconds + 10 seconds = 15 seconds
  });

  it("should return 0 for a dispenser without any usage", async () => {
    // Create a new dispenser
    const dispenser = await Dispenser.create({
      flow_volume: 25,
      is_open: false,
    });

    const res = await chai
      .request(app)
      .get(`/dispenser_usage/${dispenser._id}/total_usage_time`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("total_usage_time", 0);
  });

  it("should return 404 for a non-existent dispenser", async () => {
    const nonExistentId = "60c98b8d8d913e001c5840aa"; // Assuming this ID does not exist in the database
    const res = await chai
      .request(app)
      .get(`/dispenser_usage/${nonExistentId}/total_usage_time`);

    expect(res).to.have.status(404);
    expect(res.body).to.have.property("message", "Dispenser not found.");
  });
});

describe("GET /dispenser_usage/:id/total_money_made", () => {
  it("should return the correct total money made for a valid dispenser", async () => {
    // Create a new dispenser
    const dispenser = await Dispenser.create({
      flow_volume: 10, // $ per second
      is_open: false,
    });

    // Create two dispenser usages associated with the dispenser
    const usage1 = await DispenserUsage.create({
      dispenser: dispenser._id,
      start_time: new Date(),
      end_time: new Date(Date.now() + 5000),
      money_made: 50,
    });
    const usage2 = await DispenserUsage.create({
      dispenser: dispenser._id,
      start_time: new Date(),
      end_time: new Date(Date.now() + 10000),
      money_made: 100,
    });

    const res = await chai
      .request(app)
      .get(`/dispenser_usage/${dispenser._id}/total_money_made`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("total_money_made", 150); // $50 + $100 = $150
  });

  it("should return 0 for a dispenser without any usage", async () => {
    // Create a new dispenser
    const dispenser = await Dispenser.create({
      flow_volume: 10, // $ per second
      is_open: false,
    });

    const res = await chai
      .request(app)
      .get(`/dispenser_usage/${dispenser._id}/total_money_made`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("total_money_made", 0);
  });

  it("should return 404 for a non-existent dispenser", async () => {
    const nonExistentId = "60c98b8d8d913e001c5840aa"; // Assuming this ID does not exist in the database
    const res = await chai
      .request(app)
      .get(`/dispenser_usage/${nonExistentId}/total_money_made`);

    expect(res).to.have.status(404);
    expect(res.body).to.have.property("message", "Dispenser not found.");
  });
});

describe("POST /dispenser_usage", () => {
  it("should record dispenser usage and update the dispenser status to open", async () => {
    // Create a new dispenser
    const dispenser = await Dispenser.create({
      flow_volume: 10,
      is_open: false,
    });

    const res = await chai
      .request(app)
      .post("/dispenser_usage")
      .send({ dispenserId: dispenser._id });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("message", "Opened");

    // Check if the dispenser's status is updated to open
    const updatedDispenser = await Dispenser.findById(dispenser._id);
    expect(updatedDispenser).to.have.property("is_open", true);
  });

  it("should return 400 when dispenser ID is not provided", async () => {
    const res = await chai.request(app).post("/dispenser_usage").send({});

    expect(res).to.have.status(400);
    expect(res.body).to.have.property("message", "Dispenser ID is required.");
  });

  it("should return 404 when the dispenser does not exist", async () => {
    const nonExistentId = "60c98b8d8d913e001c5840aa"; // Assuming this ID does not exist in the database
    const res = await chai
      .request(app)
      .post("/dispenser_usage")
      .send({ dispenserId: nonExistentId });

    expect(res).to.have.status(404);
    expect(res.body).to.have.property("message", "Dispenser not found.");
  });

  it("should return 400 when the dispenser is already in use", async () => {
    // Create a new dispenser
    const dispenser = await Dispenser.create({
      flow_volume: 10,
      is_open: true, // Set the dispenser to open
    });

    const res = await chai
      .request(app)
      .post("/dispenser_usage")
      .send({ dispenserId: dispenser._id });

    expect(res).to.have.status(400);
    expect(res.body).to.have.property(
      "message",
      "Dispenser is already in use."
    );
  });
});
