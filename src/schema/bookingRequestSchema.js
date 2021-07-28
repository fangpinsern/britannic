const yup = require("yup");

const bookingRequestSchema = yup.object().shape({
  email: yup.string().email().required(),
  venueId: yup.string().required(),
  date: yup.string().required(),
  timingSlots: yup.array().of(yup.number().required()).required(),
  notes: yup.string(),
});

const approveBookingRequestSchema = yup.object().shape({
  bookingRequestId: yup.string().required(),
});

const getBookingRequestSchema = yup.object().shape({
  bookingRequestId: yup.string().required(),
});

module.exports = {
  bookingRequestSchema,
  approveBookingRequestSchema,
  getBookingRequestSchema,
};
