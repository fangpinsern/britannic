require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
// const mongoose = require("mongoose");
const { NOT_FOUND, INTERNAL_SERVER_ERROR } = require("http-status");

const routes = require("./src/routes");
const { PORT, DB_URL } = require("./src/config");

const app = express();

app.use(helmet());
app.use(cors());

app.get("/ping", (req, res, next) => {
  return res.send("You have successfully connected to the server");
});

app.use("/api/v1", routes);

app.use((req, res, next) => {
  const err = new Error("Route not found");
  err.status = NOT_FOUND;
  return next(err);
});

app.use((err, req, res, next) => {
  const status = err.status || INTERNAL_SERVER_ERROR;

  console.log(err.message);
  return res.status(status).json({
    status: "error",
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

// mongoose
//   .connect(DB_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//   })
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`Listening on ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.log(err);
//   });
