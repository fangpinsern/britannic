const { ACCEPTED, INTERNAL_SERVER_ERROR } = require("http-status");
const mongoose = require("mongoose");
// eslint-disable-next-line node/no-unpublished-require
const request = require("supertest");
const app = require("../..");
const { DUMMY_AUTH } = require("../../src/config");

const testVenue = {
  name: "Tennis Court",
  capacity: 2,
  openingHours: "7am - 11pm",
  description: "just a place to play tennis",
};

const childVenue = {
  name: "Tennis Court A",
  description: "Left court",
  capacity: 1,
};

describe("Venue APIs", () => {
  const venueRoute = "/api/v1/venue";
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

  let parentVenue;

  it("Create New Venue", async () => {
    const response = await request(app)
      .post(`${venueRoute}`)
      .send(testVenue)
      .set("Content-Type", "application/json")
      .set("Authorization", DUMMY_AUTH);

    const { venue } = response.body;
    expect(response.statusCode).toBe(ACCEPTED);
    expect(venue._id).toBeDefined();

    parentVenue = venue._id;
  });

  it("No duplicate venue names", async () => {
    const response = await request(app)
      .post(`${venueRoute}`)
      .send(testVenue)
      .set("Content-Type", "application/json")
      .set("Authorization", DUMMY_AUTH);

    expect(response.statusCode).toBe(INTERNAL_SERVER_ERROR);
  });

  it("Add child venue to parent venue", async () => {
    const response = await request(app)
      .post(`${venueRoute}/childVenue/${parentVenue}`)
      .send(childVenue)
      .set("Content-Type", "application/json")
      .set("Authorization", DUMMY_AUTH);

    const { venue } = response.body;
    expect(response.statusCode).toBe(ACCEPTED);
    expect(venue.name).toBe(childVenue.name);
  });
});
