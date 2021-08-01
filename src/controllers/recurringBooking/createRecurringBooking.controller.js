const { ACCEPTED } = require("http-status");
const RecurringBooking = require("../../models/recurringBooking.model");
const Venue = require("../../models/venue.model");
const { convertDateStringToUnix } = require("../../utils/dateToUnix");

const createRecurringBookingController = async (req, res, next) => {
  const body = req.body;
  const email = body.email;
  const venueId = body.venueId;
  const startDate = body.startDate;
  const endDate = body.endDate;
  const dayOfTheWeek = body.dayOfTheWeek;
  const timingSlots = body.timingSlots.sort();
  const notes = body.notes;
  const cca = body.cca;

  let isVenueIdValid;
  try {
    isVenueIdValid = await Venue.findOne({ _id: venueId, visible: true });
  } catch (err) {
    return next(err);
  }

  if (!isVenueIdValid) {
    const message = "Invalid venue Id";
    const err = errorFormatter(message, BAD_REQUEST);
    return next(err);
  }

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

  // check if there is conflicts

  const recuringBooking = new RecurringBooking({
    email: email,
    venue: venueId,
    startDate: startDateToUnix,
    endDate: endDateToUnix,
    dayOfTheWeek: dayOfTheWeek,
    timingSlots: timingSlots,
    notes: notes,
    cca: cca,
  });

  let savedRecurringBooking;
  try {
    savedRecurringBooking = await recuringBooking.save();
  } catch (err) {
    return next(err);
  }

  return res
    .status(ACCEPTED)
    .json({ recurringBookingId: savedRecurringBooking.id });
};

module.exports = { createRecurringBookingController };
