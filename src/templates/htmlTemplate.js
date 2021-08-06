const Handlebars = require("handlebars");
const fs = require("fs");

Handlebars.registerHelper("inc", function (value, options) {
  return parseInt(value) + 1;
});

Handlebars.registerHelper("extn", function (value, options) {
  const name = value.substring(0, value.lastIndexOf("@"));
  return name;
});

const sources = {
  APPROVED_TEMPLATE: fs
    .readFileSync(__dirname + "/approvedRequest.hbs", "utf8")
    .toString(),
  INPROGRESS_TEMPLATE: fs
    .readFileSync(__dirname + "/inprogressRequest.hbs", "utf8")
    .toString(),
  REJECTED_TEMPLATE: fs
    .readFileSync(__dirname + "/rejectedRequest.hbs", "utf8")
    .toString(),
  CANCELLED_TEMPLATE: fs
    .readFileSync(
      "/Users/pinsern/Desktop/KEWEB/backend/src/templates/cancelledRequest.hbs",
      "utf8"
    )
    .toString(),
};

const approveTemplate = Handlebars.compile(sources["APPROVED_TEMPLATE"]);
const inprogressTemplate = Handlebars.compile(sources["INPROGRESS_TEMPLATE"]);
const rejectedTemplate = Handlebars.compile(sources["REJECTED_TEMPLATE"]);
const cancelledTemplate = Handlebars.compile(sources["CANCELLED_TEMPLATE"]);
module.exports = {
  approveTemplate,
  inprogressTemplate,
  rejectedTemplate,
  cancelledTemplate,
};
