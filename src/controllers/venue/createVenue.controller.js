const { ACCEPTED } = require("http-status");
const Venue = require("../../models/venue.model");
const fs = require("fs");

const createVenueController = async (req, res, next) => {
  const body = req.body;
  const name = body.name;
  const capacity = body.capacity;
  const openingHours = body.openingHours;
  const priorityEmails = body.priorityEmails;
  const description = body.description;
  const image = body.image;

  // move image to perm storage
  fs.rename(
    __dirname + "/../../temp/" + image,
    __dirname + "/../../../public/img/" + image,
    (err) => {
      if (err) {
        return next(err);
      }
      console.log("Rename complete!");
    }
  );

  const newVenue = new Venue({
    name: name,
    capacity: capacity,
    openingHours: openingHours,
    priorityEmails: priorityEmails,
    description: description,
    image: "/img/" + image,
  });

  let savedVenue;
  try {
    savedVenue = await newVenue.save();
  } catch (err) {
    return next(err);
  }

  return res.status(ACCEPTED).json({
    venue: savedVenue.toObject(),
  });
};

module.exports = { createVenueController };
