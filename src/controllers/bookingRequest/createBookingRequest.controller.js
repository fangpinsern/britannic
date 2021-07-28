// Required Information
// email - valid email
// venueId - venue ID has to be valid
// date - string, need to convert to number for storage
// slots - min length 1
// notes - not required

const { BAD_REQUEST, ACCEPTED } = require("http-status");
const BookingRequest = require("../../models/bookingRequest.model");
const Venue = require("../../models/venue.model");

const createBookingRequestController = async (req, res, next) => {
  const body = req.body;
  const email = body.email;
  const venueId = body.venueId;
  const date = body.date;
  const slots = body.slots;
  const notes = body.notes;

  let isVenueIdValid;
  try {
    isVenueIdValid = await Venue.findOne({ _id: venueId });
  } catch (err) {
    return next(err);
  }

  if (!isVenueIdValid) {
    const message = "Invalid venue Id";
    const err = errorFormatter(message, BAD_REQUEST);
    return next(err);
  }

  //   const bookingRequest = new BookingRequest({
  //       email: email,
  //       venue: venueId,
  //       date:
  //   })

  //   return res.status(ACCEPTED).json({bookingId: })
};
