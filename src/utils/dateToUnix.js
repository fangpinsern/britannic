const { DateTime } = require("luxon");

const convertDateStringToUnix = (dateString) => {
  const date = DateTime.fromISO(dateString);
  if (date.invalid) {
    console.log(
      "ERROR - Invalid datestring. date string must be of this format [yyyymmdd]"
    );
    throw Error("Invalid date string. Datestring fromat yyyymmdd");
  }
  return date.valueOf();
};

module.exports = { convertDateStringToUnix };
