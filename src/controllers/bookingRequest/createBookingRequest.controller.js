// Required Information
// email - valid email
// venueId - venue ID has to be valid
// date - string, need to convert to number for storage
// slots - min length 1
// notes - not required

const { BAD_REQUEST, ACCEPTED } = require("http-status");
const BookingRequest = require("../../models/bookingRequest.model");
const Venue = require("../../models/venue.model");
const { convertDateStringToUnix } = require("../../utils/dateToUnix");

const createBookingRequestController = async (req, res, next) => {
  const body = req.body;
  const email = body.email;
  const venueId = body.venueId;
  const date = body.date;
  const timingSlots = body.timingSlots;
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

  let dateToUnix;
  try {
    dateToUnix = convertDateStringToUnix(date);
  } catch (err) {
    return next(err);
  }

  const bookingRequest = new BookingRequest({
    email: email,
    venue: venueId,
    date: dateToUnix,
    timingSlots: timingSlots,
    notes: notes,
  });

  let savedBookingRequest;
  try {
    savedBookingRequest = await bookingRequest.save();
  } catch (err) {
    return next(err);
  }

  return res.status(ACCEPTED).json({ bookingId: savedBookingRequest.id });
};

module.exports = { createBookingRequestController };
