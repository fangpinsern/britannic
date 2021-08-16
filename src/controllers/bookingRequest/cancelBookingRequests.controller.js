const { BAD_REQUEST, ACCEPTED } = require("http-status");
const { DateTime } = require("luxon");
const Booking = require("../../models/booking.model");
const BookingRequest = require("../../models/bookingRequest.model");
const { sendEmail } = require("../../services/email.service");
const { cancelledTemplate } = require("../../templates/htmlTemplate");
const { convertUnixToDateString } = require("../../utils/dateToUnix");
const { errorFormatter } = require("../../utils/errorFormatter");
const { mapSlotsToTiming } = require("../../utils/mapSlotsToTiming");

const cancelBookingRequestController = async (req, res, next) => {
  const params = req.params;
  const bookingRequestId = params.bookingRequestId;

  let bookingRequest;
  try {
    bookingRequest = await BookingRequest.findOne({ _id: bookingRequestId });
  } catch (err) {
    return next(err);
  }

  if (!bookingRequest) {
    const message = "No booking request found";
    return next(errorFormatter(message, BAD_REQUEST));
  }

  if (bookingRequest.isCancelled) {
    const message = "Booking Request Already cancelled";
    return next(errorFormatter(message, BAD_REQUEST));
  }

  if (bookingRequest.isRejected) {
    const message = "Booking Request Already rejected";
    return next(errorFormatter(message, BAD_REQUEST));
  }

  const unixTimeNow = DateTime.now()
    .setZone("utc")
    .plus({ hours: 8 })
    .valueOf();

  // only can cancel 1 day in advance. in SGT
  if (unixTimeNow > bookingRequest.date) {
    const message =
      "Too late to cancel now. Cancellations can only be done lastest 1 day in advance";
    return next(errorFormatter(message, BAD_REQUEST));
  }

  const bookingIds = bookingRequest.bookingIds;
  if (bookingIds.length !== 0) {
    //delete bookings
    const deleteStatus = await Booking.deleteMany({
      _id: {
        $in: bookingIds,
      },
    });
    console.log("Delete Status: ", deleteStatus);
  }

  bookingRequest.bookingRequestId = [];

  bookingRequest.isCancelled = true;

  let savedBookingRequest;
  try {
    savedBookingRequest = await bookingRequest.save();
    savedBookingRequest = await BookingRequest.findOne({
      _id: savedBookingRequest.id,
    }).populate("venue");
  } catch (err) {
    return next(err);
  }

  // send cancelled email
  const html = cancelledTemplate({
    id: savedBookingRequest._id.toString(),
    email: savedBookingRequest.email,
    venueName: savedBookingRequest.venue.name,
    timingSlots: savedBookingRequest.timingSlots.map((timingSlot) => {
      return mapSlotsToTiming(timingSlot);
    }),
    date: convertUnixToDateString(savedBookingRequest.date),
    cca: savedBookingRequest.cca || "Personal",
    notes: savedBookingRequest.notes,
    reason: "You tell me... you clicked the cancel link",
  });

  try {
    await sendEmail(
      bookingRequest.email,
      "[CANCELLED] You have successfully cancelled your booking",
      savedBookingRequest.toString(),
      html
    );
  } catch (err) {
    return next(err);
  }

  // update those who wanted to book this slot that the slot is now available

  return res.status(ACCEPTED).json({
    message: "Your booking has been cancelled",
    bookingRequest: savedBookingRequest.toObject(),
  });
};

module.exports = { cancelBookingRequestController };
