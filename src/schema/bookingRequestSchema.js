const yup = require("yup");

const bookingRequestSchema = yup.object().shape({
  email: yup.string().email().required(),
  venueId: yup.string().required(),
  date: yup.string().required(),
  timingSlots: yup.array().of(yup.number().required()).required(),
  notes: yup.string(),
});

module.exports = { bookingRequestSchema };
