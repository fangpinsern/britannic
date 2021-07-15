const Booking = require("../models/booking.model");

const getBooking = async (params = {}) => {
  const booking = await Booking.findOne({ ...params });

  if (!booking) {
    return false;
  }

  const bookingObj = booking.toObject();

  return bookingObj;
};

const createBooking = async (params = {}) => {
  const newBooking = new Booking({ ...params });
  const savedBooking = await newBooking.save();
  if (!savedBooking) {
    return savedBooking;
  }
  const bookingObj = savedBooking.toObject();

  return bookingObj;
};

module.exports = { createBooking, getBooking };
