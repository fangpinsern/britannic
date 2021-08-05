const { BAD_REQUEST, ACCEPTED } = require("http-status");
const Venue = require("../../models/venue.model");
const { errorFormatter } = require("../../utils/errorFormatter");

const editVenueController = async (req, res, next) => {
  const params = req.params;
  const venueId = params.venueId;

  console.log(venueId);

  const body = req.body;

  let venue;
  try {
    venue = await Venue.findOne({ _id: venueId });
  } catch (err) {
    return next(err);
  }

  if (!venue) {
    const message = "Venue does not exist";
    return next(errorFormatter(message, BAD_REQUEST));
  }

  let updatedVenue;
  try {
    updatedVenue = await Venue.findByIdAndUpdate(
      venueId,
      { ...body },
      { new: true }
    );
  } catch (err) {
    return next(err);
  }

  return res.status(ACCEPTED).json({ venue: updatedVenue.toObject() });
};

module.exports = { editVenueController };
