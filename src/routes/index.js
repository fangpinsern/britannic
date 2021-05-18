const { Router, json } = require("express");
const { loginController } = require("../controllers/auth/login.controller");
const {
  registerController,
} = require("../controllers/auth/register.controller");

const router = Router();
router.use(json());

router.get("/ping", (req, res, next) => {
  return res.send("Successfully inside routes");
});

router.post("/login", loginController);
router.post("/register", registerController);

module.exports = router;
