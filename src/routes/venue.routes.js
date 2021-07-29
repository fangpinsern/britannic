const { Router, json } = require("express");
const {
  createVenueController,
} = require("../controllers/venue/createVenue.controller");
const {
  getAllVenueController,
} = require("../controllers/venue/getAllVenue.controller");
const { dummyAuthMiddleware } = require("../middlewares/dummyAuth.middleware");
const { createVenueSchema } = require("../schema/venueSchema");
const { validationHelper } = require("../utils/requestValidationTool");

const router = Router();

router.use(json());

router.get("/ping", (req, res, next) => {
  return res.send("Successfully inside venue routes");
});

router.get("/search", getAllVenueController);

router.post(
  "/",
  dummyAuthMiddleware,
  validationHelper(createVenueSchema, "body"),
  createVenueController
);

module.exports = router;
