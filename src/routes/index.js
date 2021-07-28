const { Router, json } = require("express");

const authRouter = require("./auth.routes");
const venueRouter = require("./venue.routes");

const router = Router();
router.use(json());

router.get("/ping", (req, res, next) => {
  return res.send("Successfully inside routes");
});

router.use("/auth", authRouter);
router.use("/venue", venueRouter);

module.exports = router;
