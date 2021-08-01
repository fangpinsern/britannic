const { OK } = require("http-status");
const RecurringBooking = require("../../models/recurringBooking.model");
const { convertUnixToDateString } = require("../../utils/dateToUnix");
const { mapSlotsToTiming } = require("../../utils/mapSlotsToTiming");

const getAllRecurringBookingController = async (req, res, next) => {
  let recurringBookings;
  try {
    recurringBookings = await RecurringBooking.find({
      ...req.query,
    })
      .populate("venue")
      .sort({ createdAt: -1 });
  } catch (err) {
    return next(err);
  }

  const returnRecurringBooking = recurringBookings.map((recurringBooking) => {
    const id = recurringBooking.id;
    const email = recurringBooking.email;
    const startDate = convertUnixToDateString(recurringBooking.startDate);
    const endDate = convertUnixToDateString(recurringBooking.endDate);
    const timingSlots = recurringBooking.timingSlots.map((timingSlot) => {
      return mapSlotsToTiming(timingSlot);
    });
    const notes = recurringBooking.notes;
    const venue = recurringBooking.venue;
    const cca = recurringBooking.cca;

    return {
      id,
      email,
      startDate,
      endDate,
      timingSlots,
      notes,
      venue,
      cca,
    };
  });

  return res.status(OK).json({ recurringBookings: returnRecurringBooking });
};

module.exports = { getAllRecurringBookingController };
