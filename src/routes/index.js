const { Router, json } = require("express");

const authRouter = require("./auth.routes");

const router = Router();
router.use(json());

router.get("/ping", (req, res, next) => {
  return res.send("Successfully inside routes");
});

router.use("/auth", authRouter);

module.exports = router;
