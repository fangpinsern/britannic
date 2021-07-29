const Booking = require("../models/booking.model");
const Venue = require("../models/venue.model");

// parent venue only available if all child venue is available
// child venue is only available if parent venue is available

const checkIfVenueAvailable = async (venueId, unixDate, slots = []) => {
  const venue = await Venue.findOne({ _id: venueId });

  const isChildVenue = venue.isChildVenue;

  let searchQuery;
  if (isChildVenue) {
    searchQuery = {
      venue: { $in: [venueId, venue.parentVenue] },
      date: unixDate,
      timingSlot: { $in: slots },
    };
    console.log(searchQuery);
  } else {
    searchQuery = {
      venue: { $in: [...venue.childVenues, venueId] },
      date: unixDate,
      timingSlot: { $in: slots },
    };
  }
  const isBooked = await Booking.find(searchQuery);
  console.log(isBooked);
  if (isBooked.length > 0) {
    return false;
  }
  return true;
};

module.exports = { checkIfVenueAvailable };
