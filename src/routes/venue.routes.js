const { Router, json } = require("express");
const {
  getAllVenueController,
} = require("../controllers/venue/getAllVenue.controller");

const router = Router();

router.use(json());

router.get("/ping", (req, res, next) => {
  return res.send("Successfully inside venue routes");
});

router.get("/search", getAllVenueController);

module.exports = router;
