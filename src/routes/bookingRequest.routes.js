const { Router, json } = require("express");
const {
  createBookingRequestController,
} = require("../controllers/bookingRequest/createBookingRequest.controller");
const { bookingRequestSchema } = require("../schema/bookingRequestSchema");
const { validationHelper } = require("../utils/requestValidationTool");

const router = Router();

router.use(json());

router.get("/ping", (req, res, next) => {
  return res.send("Successfully inside booking request routes");
});

router.post(
  "/",
  validationHelper(bookingRequestSchema, "body"),
  createBookingRequestController
);

module.exports = router;
