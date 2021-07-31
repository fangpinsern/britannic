const { BAD_REQUEST, ACCEPTED } = require("http-status");
const BookingRequest = require("../../models/bookingRequest.model");
const { errorFormatter } = require("../../utils/errorFormatter");

const rejectBookingRequestController = async (req, res, next) => {
  const body = req.body;
  const bookingRequestId = body.bookingRequestId;

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

  if (isApproved) {
    const message =
      "Booking request has already been approved. You cannot reApprove it";
    const err = errorFormatter(message, BAD_REQUEST);
    return next(err);
  }

  if (isRejected) {
    const message =
      "Booking request has already been rejected. You cannot approve a rejected request";
    const err = errorFormatter(message, BAD_REQUEST);
    return next(err);
  }

  bookingRequest.isRejected = true;
  let savedBookingRequest;
  try {
    savedBookingRequest = await bookingRequest.save();
  } catch (err) {
    return next(err);
  }

  // send email of rejection

  return res.status(ACCEPTED).json({
    bookingRequestId: savedBookingRequest.id,
  });
};

module.exports = { rejectBookingRequestController };
