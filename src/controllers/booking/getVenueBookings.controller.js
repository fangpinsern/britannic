const { OK } = require("http-status");
const Booking = require("../../models/booking.model");
const {
  convertUnixToDateString,
  convertDateStringToUnix,
} = require("../../utils/dateToUnix");

const getVenueBookingsController = async (req, res, next) => {
  const query = req.query;
  const startDate = query.startDate;
  const endDate = query.endDate;
  const venueId = query.venueId;

  let startDateToUnix;
  try {
    startDateToUnix = convertDateStringToUnix(startDate);
  } catch (err) {
    return next(err);
  }

  let endDateToUnix;
  try {
    endDateToUnix = convertDateStringToUnix(endDate);
  } catch (err) {
    return next(err);
  }

  let bookings = [];
  try {
    bookings = await Booking.find({
      venue: venueId,
      date: { $gte: startDateToUnix, $lte: endDateToUnix },
    });
  } catch (err) {
    return next(err);
  }

  let response = {};
  bookings.map((booking) => {
    const unixDate = booking.date;
    const timingSlot = booking.timingSlot;
    const dateString = convertUnixToDateString(unixDate, "yyyyLLdd");
    const dateStringExist = response[dateString];

    if (!dateStringExist) {
      response[dateString] = [timingSlot];
    } else {
      const arr = response[dateString];
      const newArr = [...arr, timingSlot];
      response[dateString] = newArr;
    }
  });

  return res.status(OK).json({ bookings: response });
};

module.exports = { getVenueBookingsController };
