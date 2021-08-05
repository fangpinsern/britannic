const { OK } = require("http-status");
const BookingRequest = require("../../models/bookingRequest.model");
const {
  getConflictingBookingRequests,
} = require("../../services/bookingRequest.service");
const { convertUnixToDateString } = require("../../utils/dateToUnix");
const { mapSlotsToTiming } = require("../../utils/mapSlotsToTiming");

// returns what requests will be rejected on approval

const approveBookingRequestIntentController = async (req, res, next) => {
  const query = req.query;
  const bookingRequestId = query.bookingRequestId;

  let bookingRequest;
  try {
    bookingRequest = await BookingRequest.findOne({
      _id: bookingRequestId,
    }).populate("venue");
  } catch (err) {
    return next(err);
  }

  if (!bookingRequest) {
    const message = "Invalid booking requestId";
    const err = errorFormatter(message, BAD_REQUEST);
    return next(err);
  }

  const venue = bookingRequest.venue;
  const date = bookingRequest.date;
  const bookingTimeSlots = bookingRequest.timingSlots;

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

  const returnId = bookingRequest.id;
  const returnEmail = bookingRequest.email;
  const returnDate = convertUnixToDateString(bookingRequest.date);
  const returnTimingSlots = bookingRequest.timingSlots.map((timingSlot) => {
    return mapSlotsToTiming(timingSlot);
  });
  const returnNotes = bookingRequest.notes;
  const returnVenue = bookingRequest.venue;
  const returnCca = bookingRequest.cca;

  const returnConflict = conflictBookingRequest.map((bookingRequest) => {
    const id = bookingRequest.id;
    const email = bookingRequest.email;
    const date = convertUnixToDateString(bookingRequest.date);
    const timingSlots = bookingRequest.timingSlots.map((timingSlot) => {
      return mapSlotsToTiming(timingSlot);
    });
    const isApproved = bookingRequest.isApproved;
    const isRejected = bookingRequest.isRejected;
    const notes = bookingRequest.notes;
    const venue = bookingRequest.venue;
    const cca = bookingRequest.cca;

    return {
      id,
      email,
      date,
      timingSlots,
      notes,
      venue,
      cca,
    };
  });

  return res.status(OK).json({
    bookingRequest: {
      id: returnId,
      email: returnEmail,
      date: returnDate,
      timingSlots: returnTimingSlots,
      notes: returnNotes,
      venue: returnVenue,
      cca: returnCca,
    },
    conflicts: returnConflict,
  });
};

module.exports = { approveBookingRequestIntentController };
