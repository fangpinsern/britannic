const BookingRequest = require("../models/bookingRequest.model");

const rejectBookingRequestInTheseSlots = async (
  venueId,
  unixDate,
  timingSlots = [],
  except
) => {
  const requestToReject = await BookingRequest.find({
    venue: venueId,
    date: unixDate,
    timingSlots: { $in: timingSlots },
  });

  if (requestToReject.length <= 0) {
    return [];
  }

  rejectedBookingRequestIds = [];
  for (let i = 0; i < requestToReject.length; i++) {
    const request = requestToReject[i];
    if (request.id.toString() === except) {
      continue;
    }
    if (request.isRejected) {
      continue;
    }
    request.isRejected = true;
    const savedRequest = await request.save();

    // send emails of rejection
    rejectedBookingRequestIds.push(savedRequest.id);
  }

  return rejectedBookingRequestIds;
};

module.exports = { rejectBookingRequestInTheseSlots };
