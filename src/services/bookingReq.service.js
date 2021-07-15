const BookingReq = require("../models/bookingReq.model");

const getBookingReq = async (params = {}) => {
  const bookingReq = await BookingReq.findOne({ ...params });

  if (!bookingReq) {
    return false;
  }

  const bookingReqObj = bookingReq.toObject();

  return bookingReqObj;
};

const createBookingReq = async (params = {}) => {
  const newBookingReq = new BookingReq({ ...params });
  const savedBookingReq = await newBookingReq.save();
  if (!savedBookingReq) {
    return savedBookingReq;
  }
  const bookingReqObj = savedBookingReq.toObject();

  return bookingReqObj;
};

module.exports = { createBookingReq, getBookingReq };
