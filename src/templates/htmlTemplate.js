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
    .readFileSync(
      "/Users/pinsern/Desktop/KEWEB/backend/src/templates/approvedRequest.hbs",
      "utf8"
    )
    .toString(),
  INPROGRESS_TEMPLATE: fs
    .readFileSync(
      "/Users/pinsern/Desktop/KEWEB/backend/src/templates/inprogressRequest.hbs",
      "utf8"
    )
    .toString(),
  REJECTED_TEMPLATE: fs
    .readFileSync(
      "/Users/pinsern/Desktop/KEWEB/backend/src/templates/rejectedRequest.hbs",
      "utf8"
    )
    .toString(),
};

const approveTemplate = Handlebars.compile(sources["APPROVED_TEMPLATE"]);
const inprogressTemplate = Handlebars.compile(sources["INPROGRESS_TEMPLATE"]);
const rejectedTemplate = Handlebars.compile(sources["REJECTED_TEMPLATE"]);

module.exports = { approveTemplate, inprogressTemplate, rejectedTemplate };