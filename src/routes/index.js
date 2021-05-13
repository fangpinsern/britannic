const { Router, json } = require("express");

const router = Router();
router.use(json());

router.get("/ping", (req, res, next) => {
  return res.send("Successfully inside routes");
});

module.exports = router;
