const { Router, json } = require("express");
const {
  createBookingRequestController,
} = require("../controllers/bookingRequest/createBookingRequest.controller");

const router = Router();

router.use(json());

router.get("/ping", (req, res, next) => {
  return res.send("Successfully inside venue routes");
});

router.post("/", createBookingRequestController);

module.exports = router;
