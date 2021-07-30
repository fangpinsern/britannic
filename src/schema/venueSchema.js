const yup = require("yup");

const createVenueSchema = yup.object().shape({
  name: yup.string().required(),
  capacity: yup.number().integer().required(),
  openingHours: yup.string().required(),
  priorityEmails: yup.array().of(yup.string()),
  description: yup.string(),
  image: yup.string(),
});

const updateVenueVisibilitySchema = yup.object().shape({
  venueId: yup.string().required(),
});

module.exports = { createVenueSchema, updateVenueVisibilitySchema };
