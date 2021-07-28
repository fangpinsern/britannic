const { BAD_REQUEST, ACCEPTED } = require("http-status");
const Booking = require("../../models/booking.model");
const BookingRequest = require("../../models/bookingRequest.model");
const { checkIfVenueAvailable } = require("../../services/booking.service");
const { errorFormatter } = require("../../utils/errorFormatter");

const approveBookingRequestController = async (req, res, next) => {
  const body = req.body;
  const bookingRequstId = body.bookingRequestId;

  let bookingRequest;
  try {
    bookingRequest = await BookingRequest.findOne({ _id: bookingRequstId });
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

  let isVenueAvailable;
  try {
    isVenueAvailable = await checkIfVenueAvailable(
      venue,
      date,
      bookingTimeSlots
    );
  } catch (err) {
    return next(err);
  }

  if (!isVenueAvailable) {
    const message = "some slots for this venue is unavailable";
    const err = errorFormatter(message, BAD_REQUEST);
    return next(err);
  }

  const newBookingIds = [];

  for (let i = 0; i < bookingTimeSlots.length; i++) {
    const timingSlot = bookingTimeSlots[i];
    const newBooking = new Booking({
      email: email,
      venue: venue,
      date: date,
      timingSlot: timingSlot,
      notes: notes,
    });
    let savedBooking;
    try {
      savedBooking = await newBooking.save();
    } catch (err) {
      return next(err);
    }

    newBookingIds.push(savedBooking.id);
  }

  bookingRequest.isApproved = true;
  bookingRequest.bookingIds = newBookingIds;
  let savedBookingRequest;
  try {
    savedBookingRequest = await bookingRequest.save();
  } catch (err) {
    return next(err);
  }

  return res.status(ACCEPTED).json({ bookingIds: newBookingIds });
};

module.exports = { approveBookingRequestController };
