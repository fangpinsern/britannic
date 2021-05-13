const env = process.env.NODE_ENV || "development";

let envVariables;

if (env === "production") {
  envVariables = require("./config.production");
} else {
  envVariables = require("./config.development");
}

module.exports = {
  DB_URL: process.env.DB_URL,
  ...envVariables,
};
