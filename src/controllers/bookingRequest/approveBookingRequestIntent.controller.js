const { OK } = require("http-status");
const BookingRequest = require("../../models/bookingRequest.model");
const {
  getConflictingBookingRequests,
} = require("../../services/bookingRequest.service");

// returns what requests will be rejected on approval

const approveBookingRequestIntentController = async (req, res, next) => {
  const query = req.query;
  const bookingRequestId = query.bookingRequestId;

  let bookingRequest;
  try {
    bookingRequest = await BookingRequest.findOne({ _id: bookingRequestId });
  } catch (err) {
    return next(err);
  }

  if (!bookingRequest) {
    const message = "Invalid booking requestId";
    const err = errorFormatter(message, BAD_REQUEST);
    return next(err);
  }

  const email = bookingRequest.email;
  const venue = bookingRequest.venue;
  const date = bookingRequest.date;
  const bookingTimeSlots = bookingRequest.timingSlots;
  const notes = bookingRequest.notes;
  const isApproved = bookingRequest.isApproved;
  const isRejected = bookingRequest.isRejected;

  let conflictBookingRequest;
  try {
    conflictBookingRequest = await getConflictingBookingRequests(
      venue,
      date,
      bookingTimeSlots,
      bookingRequest.id
    );
  } catch (err) {
    return next(err);
  }

  return res.status(OK).json({
    bookingRequest: bookingRequest,
    conflicts: conflictBookingRequest,
  });
};

module.exports = { approveBookingRequestIntentController };
