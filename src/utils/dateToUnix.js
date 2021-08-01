const { DateTime } = require("luxon");

const convertDateStringToUnix = (dateString) => {
  const date = DateTime.fromISO(dateString, { zone: "utc" });
  if (date.invalid) {
    console.log(
      "ERROR - Invalid datestring. date string must be of this format [yyyymmdd]"
    );
    throw Error("Invalid date string. Datestring fromat yyyymmdd");
  }
  return date.valueOf();
};

const convertUnixToDateString = (unix) => {
  const dateString = DateTime.fromMillis(unix, { zone: "utc" });
  if (dateString.invalid) {
    console.log(
      "ERROR - Invalid unix timestamp. unix time stamp number be a number"
    );
    throw Error("Invalid unix time stamp. unix time stamp must be an integer");
  }

  const values = dateString.toFormat("yyyy/LL/dd");

  return values;
};

const getDayOfTheWeekInt = (unix) => {
  const dateString = DateTime.fromMillis(unix, { zone: "utc" });
  const dayOfTheWeek = dateString.weekday;

  return dayOfTheWeek;
};

module.exports = {
  convertDateStringToUnix,
  convertUnixToDateString,
  getDayOfTheWeekInt,
};
