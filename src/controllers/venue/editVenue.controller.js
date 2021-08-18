const { BAD_REQUEST, ACCEPTED } = require("http-status");
const Venue = require("../../models/venue.model");
const { errorFormatter } = require("../../utils/errorFormatter");
const fs = require("fs/promises");

const editVenueController = async (req, res, next) => {
  const params = req.params;
  const venueId = params.venueId;

  const body = req.body;

  let venue;
  try {
    venue = await Venue.findOne({ _id: venueId });
  } catch (err) {
    return next(err);
  }

  if (!venue) {
    const message = "Venue does not exist";
    return next(errorFormatter(message, BAD_REQUEST));
  }

  if (body.image) {
    const image = body.image;

    // move old image out
    if (venue.image) {
      const imageId = venue.image.split("/")[2];
      try {
        await fs.rename(
          __dirname + "/../../../public/img/" + imageId,
          __dirname + "/../../temp/" + imageId
        );
      } catch (err) {
        console.log("File not in public folder");
      }
    }

    // move new image in
    try {
      await fs.rename(
        __dirname + "/../../temp/" + image,
        __dirname + "/../../../public/img/" + image
      );
    } catch (err) {
      return next(err);
    }

    body.image = "/img/" + image;
  }

  console.log("bODY", body);

  let updatedVenue;
  try {
    updatedVenue = await Venue.findByIdAndUpdate(
      venueId,
      { ...body },
      { new: true }
    );
  } catch (err) {
    return next(err);
  }

  return res.status(ACCEPTED).json({ venue: updatedVenue.toObject() });
};

module.exports = { editVenueController };
