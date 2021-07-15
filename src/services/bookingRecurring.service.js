const BookingRecurring = require("../models/bookingRecurring.model");

const getBookingRecurring = async (params = {}) => {
  const bookingRecurring = await BookingRecurring.findOne({ ...params });

  if (!bookingRecurring) {
    return false;
  }

  const bookingRecurringObj = bookingRecurring.toObject();

  return bookingRecurringObj;
};

const createBookingRecurring = async (params = {}) => {
  const newBookingRecurring = new BookingRecurring({ ...params });
  const savedBookingRecurring = await newBookingRecurring.save();
  if (!savedBookingRecurring) {
    return savedBookingRecurring;
  }
  const bookingRecurringObj = savedBookingRecurring.toObject();

  return bookingRecurringObj;
};

module.exports = { getBookingRecurring, createBookingRecurring };
