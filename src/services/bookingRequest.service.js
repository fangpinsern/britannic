const { Types } = require("mongoose");
const BookingRequest = require("../models/bookingRequest.model");
const Venue = require("../models/venue.model");
const { rejectedTemplate } = require("../templates/htmlTemplate");
const { convertUnixToDateString } = require("../utils/dateToUnix");
const { mapSlotsToTiming } = require("../utils/mapSlotsToTiming");
const { sendEmail } = require("./email.service");

const rejectBookingRequestInTheseSlots = async (
  venueId,
  unixDate,
  timingSlots = [],
  except
) => {
  const venue = await Venue.findOne({ _id: venueId });

  const isChildVenue = venue.isChildVenue;
  console.log(venue.childVenues);

  let searchQuery;
  if (isChildVenue) {
    searchQuery = {
      venue: { $in: [venueId, venue.parentVenue] },
      date: unixDate,
      timingSlots: { $in: timingSlots },
      isRejected: false,
      isCancelled: false,
    };
  } else {
    searchQuery = {
      venue: {
        $in: [...venue.childVenues, venueId],
      },
      date: unixDate,
      timingSlots: { $in: timingSlots },
      isRejected: false,
      isCancelled: false,
    };
  }

  const requestToReject = await BookingRequest.find(searchQuery).populate(
    "venue"
  );

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
    // need some form of templating
    const html = rejectedTemplate({
      id: request._id.toString(),
      email: request.email,
      venueName: request.venue.name,
      timingSlots: request.timingSlots.map((timingSlot) => {
        return mapSlotsToTiming(timingSlot);
      }),
      date: convertUnixToDateString(request.date),
      cca: request.cca || "Personal",
      notes: request.notes,
    });

    try {
      await sendEmail(
        request.email,
        "[REJECTED] Your request for booking has been rejected",
        request.toString(),
        html
      );
    } catch (err) {
      return next(err);
    }
    rejectedBookingRequestIds.push(savedRequest.id);
  }

  return rejectedBookingRequestIds;
};

const getConflictingBookingRequests = async (
  venueId,
  unixDate,
  timingSlots = [],
  except
) => {
  const venue = await Venue.findOne({ _id: venueId });

  const isChildVenue = venue.isChildVenue;

  let searchQuery;
  if (isChildVenue) {
    searchQuery = {
      venue: { $in: [venueId, venue.parentVenue] },
      date: unixDate,
      timingSlots: { $in: timingSlots },
      isRejected: false,
      isCancelled: false,
    };
  } else {
    searchQuery = {
      venue: {
        $in: [...venue.childVenues, venueId],
      },
      date: unixDate,
      timingSlots: { $in: timingSlots },
      isRejected: false,
      isCancelled: false,
    };
  }

  const conflictingBookingRequests = await BookingRequest.find(searchQuery);

  if (conflictingBookingRequests.length <= 0) {
    return [];
  }

  const returnVal = conflictingBookingRequests.filter(
    (conflictingBookingRequest) => {
      return (
        conflictingBookingRequest.id.toString() != except &&
        !conflictingBookingRequest.isRejected
      );
    }
  );

  // rejectedBookingRequestIds = [];
  // for (let i = 0; i < requestToReject.length; i++) {
  //   const request = requestToReject[i];
  //   if (request.id.toString() === except) {
  //     continue;
  //   }
  //   if (request.isRejected) {
  //     continue;
  //   }
  //   request.isRejected = true;
  //   const savedRequest = await request.save();

  //   // send emails of rejection
  //   rejectedBookingRequestIds.push(savedRequest.id);
  // }

  return returnVal;
};

module.exports = {
  rejectBookingRequestInTheseSlots,
  getConflictingBookingRequests,
};
