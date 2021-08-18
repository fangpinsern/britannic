const { Router, json } = require("express");
const { ACCEPTED } = require("http-status");
const multer = require("multer");
const {
  purgeTempController,
} = require("../controllers/image/purgeTemp.controller");
const { dummyAuthMiddleware } = require("../middlewares/dummyAuth.middleware");

const router = Router();

const upload = multer({ dest: __dirname + "/../temp" });

router.use(json());

router.get("/ping", (req, res, next) => {
  return res.send("Successfully inside image routes");
});

router.post(
  "/upload",
  dummyAuthMiddleware,
  upload.single("image"),
  (req, res, next) => {
    const file = req.file;
    console.log(file);
    res.status(ACCEPTED).json({ filename: file.filename });
  }
);

router.delete("/purge", dummyAuthMiddleware, purgeTempController);

module.exports = router;
