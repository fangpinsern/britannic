const Booking = require("../models/booking.model");

const checkIfVenueAvailable = async (venueId, unixDate, slots = []) => {
  const isBooked = await Booking.find({
    venue: venueId,
    date: unixDate,
    timingSlot: { $in: slots },
  });
  if (isBooked.length > 0) {
    return false;
  }
  return true;
};

module.exports = { checkIfVenueAvailable };
