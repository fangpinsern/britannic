const { NOT_FOUND, OK } = require("http-status");
const Venue = require("../../models/venue.model");
const { errorFormatter } = require("../../utils/errorFormatter");

const getAllVenueAdminController = async (req, res, next) => {
  const query = req.query;
  let allVenues;
  try {
    allVenues = await Venue.find({ ...query });
  } catch (err) {
    return next(err);
  }

  if (allVenues.length === 0) {
    const message = "No Venues Available";
    const err = errorFormatter(message, NOT_FOUND);
    return next(err);
  }

  const returnVenue = allVenues.map((venue) => {
    const id = venue.id;
    const name = venue.name;
    const capacity = venue.capacity;
    const image = venue.image;
    const description = venue.description;
    const visible = venue.visible;
    const openingHours = venue.openingHours;

    return {
      id,
      name,
      capacity,
      image,
      description,
      visible,
      openingHours,
    };
  });

  return res.status(OK).json({ venues: returnVenue });
};

module.exports = { getAllVenueAdminController };
