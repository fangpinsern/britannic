const { OK } = require("http-status");
const BookingRequest = require("../../models/bookingRequest.model");
const { convertUnixToDateString } = require("../../utils/dateToUnix");
const { errorFormatter } = require("../../utils/errorFormatter");

const getAllBookingRequestController = async (req, res, next) => {
  const query = req.query;
  const q = query.q;

  let searchQuery = {};

  if (q === "PENDING") {
    searchQuery = { isApproved: false, isRejected: false };
  } else if (q === "APPROVED") {
    searchQuery = { isApproved: true, isRejected: false };
  } else if (q === "REJECTED") {
    searchQuery = { isApproved: false, isRejected: true };
  }

  let allBookingRequest;
  try {
    allBookingRequest = await BookingRequest.find(searchQuery)
      .populate("venue")
      .sort({ createdAt: -1 });
  } catch (err) {
    return next(err);
  }

  const returnBookingRequest = allBookingRequest.map((bookingRequest) => {
    const id = bookingRequest.id;
    const email = bookingRequest.email;
    const date = convertUnixToDateString(bookingRequest.date);
    const timingSlots = bookingRequest.timingSlots;
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
      isApproved,
      isRejected,
      venue,
      cca,
    };
  });

  return res.status(OK).json({ bookingRequest: returnBookingRequest });
};

module.exports = { getAllBookingRequestController };
