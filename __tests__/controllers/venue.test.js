const mongoose = require("mongoose");
// eslint-disable-next-line node/no-unpublished-require
const request = require("supertest");
const app = require("../..");
const { DUMMY_AUTH } = require("../../src/config");

describe("Insert Venue", () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("Create New Venue", async () => {
    const response = await request(app)
      .post("/api/v1/venue")
      .send({
        name: "Tennis Court",
        capacity: 2,
        openingHours: "7am - 11pm",
        description: "just a place to play tennis",
      })
      .set("Content-Type", "application/json")
      .set("Authorization", DUMMY_AUTH);

    expect(response.statusCode).toBe(202);
  });

  it("No duplicate venue names", async () => {
    const response = await request(app)
      .post("/api/v1/venue")
      .send({
        name: "Tennis Court",
        capacity: 2,
        openingHours: "7am - 11pm",
        description: "just a place to play tennis",
      })
      .set("Content-Type", "application/json")
      .set("Authorization", DUMMY_AUTH);

    expect(response.statusCode).toBe(500);
  });
});
