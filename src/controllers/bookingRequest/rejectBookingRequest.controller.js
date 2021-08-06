const { BAD_REQUEST, ACCEPTED } = require("http-status");
const BookingRequest = require("../../models/bookingRequest.model");
const { sendEmail } = require("../../services/email.service");
const { rejectedTemplate } = require("../../templates/htmlTemplate");
const { convertUnixToDateString } = require("../../utils/dateToUnix");
const { errorFormatter } = require("../../utils/errorFormatter");
const { mapSlotsToTiming } = require("../../utils/mapSlotsToTiming");

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
    savedBookingRequest = await BookingRequest.findOne({
      _id: savedBookingRequest.id,
    }).populate("venue");
  } catch (err) {
    return next(err);
  }

  // send email of rejection

  const html = rejectedTemplate({
    id: savedBookingRequest._id.toString(),
    email: savedBookingRequest.email,
    venueName: savedBookingRequest.venue.name,
    timingSlots: savedBookingRequest.timingSlots.map((timingSlot) => {
      return mapSlotsToTiming(timingSlot);
    }),
    date: convertUnixToDateString(savedBookingRequest.date),
    cca: savedBookingRequest.cca || "Personal",
    notes: savedBookingRequest.notes,
  });

  try {
    await sendEmail(
      email,
      "[REJECTED] Your request for booking has been rejected",
      savedBookingRequest.toString(),
      html
    );
  } catch (err) {
    return next(err);
  }

  return res.status(ACCEPTED).json({
    bookingRequestId: savedBookingRequest.id,
  });
};

module.exports = { rejectBookingRequestController };
