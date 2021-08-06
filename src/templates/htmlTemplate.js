const Handlebars = require("handlebars");
const fs = require("fs");

Handlebars.registerHelper("inc", function (value, options) {
  return parseInt(value) + 1;
});

const sources = {
  APPROVED_TEMPLATE: fs
    .readFileSync(
      "/Users/pinsern/Desktop/KEWEB/backend/src/templates/approvedRequest.hbs",
      "utf8"
    )
    .toString(),
};

const approveTemplate = Handlebars.compile(sources["APPROVED_TEMPLATE"]);

module.exports = { approveTemplate };
