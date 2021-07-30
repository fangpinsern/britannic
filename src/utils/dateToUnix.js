const { DateTime } = require("luxon");

const convertDateStringToUnix = (dateString) => {
  const date = DateTime.fromISO(dateString);
  console.log(date);
  if (date.invalid) {
    console.log(
      "ERROR - Invalid datestring. date string must be of this format [yyyymmdd]"
    );
    throw Error("Invalid date string. Datestring fromat yyyymmdd");
  }
  return date.valueOf();
};

const convertUnixToDateString = (unix) => {
  const dateString = DateTime.fromMillis(unix);
  console.log(dateString);
  if (dateString.invalid) {
    console.log(
      "ERROR - Invalid unix timestamp. unix time stamp number be a number"
    );
    throw Error("Invalid unix time stamp. unix time stamp must be an integer");
  }

  const values = dateString.c;
  const year = String(values.year);
  const month = String(values.month);
  const day = String(values.day);

  const newDateString = year + month + day;

  return newDateString;
};

module.exports = { convertDateStringToUnix, convertUnixToDateString };
