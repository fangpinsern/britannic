const { Router, json } = require("express");
const {
  createRecurringBookingController,
} = require("../controllers/recurringBooking/createRecurringBooking.controller");
const {
  createRecurringBookingSchema,
} = require("../schema/recurringBookingSchema");
const { validationHelper } = require("../utils/requestValidationTool");

const router = Router();

router.use(json());

router.get("/ping", (req, res, next) => {
  return res.send("Successfully inside recurring booking routes");
});

router.post(
  "/create",
  validationHelper(createRecurringBookingSchema, "body"),
  createRecurringBookingController
);

module.exports = router;
