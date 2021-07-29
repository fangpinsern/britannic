const { BAD_REQUEST, ACCEPTED } = require("http-status");
const Venue = require("../../models/venue.model");
const { errorFormatter } = require("../../utils/errorFormatter");

const createChildVenueController = async (req, res, next) => {
  const params = req.params;
  const parentId = params.parentId;

  let findParentVenue;
  try {
    findParentVenue = await Venue.findOne({ _id: parentId });
  } catch (err) {
    return next(err);
  }

  if (!findParentVenue) {
    const message = "Invalid parent venue";
    const err = errorFormatter(message, BAD_REQUEST);
    return next(err);
  }

  const body = req.body;
  const name = body.name;
  const capacity = body.capacity;
  const openingHours = findParentVenue.openingHours;
  const priorityEmails = findParentVenue.priorityEmails;
  const description = body.description || findParentVenue.description;
  const image = body.image || findParentVenue.image;
  const parentVenue = findParentVenue.id;
  const isChildVenue = true;

  const newChildVenue = new Venue({
    name: name,
    capacity: capacity,
    openingHours: openingHours,
    priorityEmails: priorityEmails,
    description: description,
    image: image,
    parentVenue: parentVenue,
    isChildVenue: isChildVenue,
  });

  let savedChildVenue;
  try {
    savedChildVenue = await newChildVenue.save();
  } catch (err) {
    return next(err);
  }

  const childVenues = findParentVenue.childVenues;
  childVenues.push(savedChildVenue.id);

  findParentVenue.childVenues = childVenues;

  let savedParentVenue;
  try {
    savedParentVenue = await findParentVenue.save();
  } catch (err) {
    return next(err);
  }

  return res.status(ACCEPTED).json({ venue: savedChildVenue.toObject() });
};

module.exports = { createChildVenueController };

// name: { type: String, required: true },
//     capacity: { type: Number, required: true },
//     openingHours: { type: String, required: true },
//     priorityEmails: { type: [String] },
//     description: { type: String, maxLength: 500 },
//     visible: { type: Boolean, default: true, required: true },
//     image: { type: String, required: false },
//     parentVenue: { type: Types.ObjectId, ref: "VenueSchema" },
//     isChildVenue: { type: Boolean, default: false, required: true },
//     childVenue: {
//       type: [{ type: Types.ObjectId, ref: "VenueSchema" }],
//       required: false,
//       default: [],
//     },
