// Operating hours in the format of XXAM/PM - XXAM/PM

const twenty4HourConverter = (num, amorpm) => {
  const numInt = parseInt(num);
  console.log(numInt);

  if (numInt === 12) {
    if (amorpm === "PM") {
      return numInt;
    } else {
      return 0;
    }
  }

  let returnInt = numInt;
  if (amorpm == "PM") {
    returnInt = numInt + 12;
  }

  if (returnInt > 24) {
    throw new Error("Something is wrong with your time");
  }

  return returnInt;
};

const hourlyConverter = (val) => {
  const splitVal = val.split(".");
  let hour = parseInt(splitVal[0]);
  let min = parseInt(splitVal[1]);
  let timeOfDay = "AM";

  if (hour >= 12) {
    hour = hour - 12;
    timeOfDay = "PM";
  }

  if (min === 0) {
    min = "";
  } else {
    min = "." + min;
  }

  return hour + min + timeOfDay;
};

const pickSeperator = (sep) => {
  if (sep === "HOURLY") {
    return [".00"];
  }

  if (sep === "BIHOURLY") {
    return [".00", ".30"];
  }

  if (sep === "QUARTALLY") {
    return [".00", ".15", ".30", ".45"];
  }
};

const timeSlotGenerator = (operatingHours, sectioning = "HOURLY") => {
  const timings = operatingHours.split(" - ");

  if (timings.length !== 2) {
    throw new Error(
      "Invalid timing format. Time should be XXAM/PM - YYAM/PM where XX and YY are hours of the day"
    );
  }

  const firstTime = timings[0].match(/[a-zA-Z]+|[0-9]+/g);

  if (firstTime.length !== 2) {
    throw new Error(
      "Invalid timing format for first time. Time should be XXAM/PM where XX hours of the day"
    );
  }

  const secondTime = timings[1].match(/[a-zA-Z]+|[0-9]+/g);

  if (secondTime.length !== 2) {
    throw new Error(
      "Invalid timing format for second time. Time should be XXAM/PM where XX hours of the day"
    );
  }

  // get time in 24hours
  const tfFirstTime = twenty4HourConverter(firstTime[0], firstTime[1]);

  const tfSecondTime = twenty4HourConverter(secondTime[0], secondTime[1]);

  console.log(tfSecondTime);

  // currently can only set within the same day

  const timeDiff = tfSecondTime - tfFirstTime;

  if (timeDiff < 0) {
    throw new Error("Overnight operating hours is not supported");
  }

  // generate a list of number iteratively

  let listOfNumbers = [];
  for (let i = tfFirstTime; i <= tfSecondTime; i++) {
    listOfNumbers.push(i);
  }

  const sepList = pickSeperator(sectioning);

  const numberInOrder = listOfNumbers.flatMap((number, i) => {
    if (i < listOfNumbers.length - 1) {
      return sepList.map((sep) => {
        return number + sep;
      });
    } else {
      return number + ".00";
    }
  });
  let slotVals = {};
  for (i = 0; i < numberInOrder.length - 1; i++) {
    const first = numberInOrder[i];
    const second = numberInOrder[i + 1];

    const slot = hourlyConverter(first) + " - " + hourlyConverter(second);

    slotVals[i + 1] = slot;
  }

  return slotVals;
};

// var t0 = performance.now();

// const a = timeSlotGenerator("7AM - 11PM", "BIHOURLY"); // <---- measured code goes between t0 and t1

// var t1 = performance.now();
// console.log(a);
// console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");

// timeSlotGenerator("7AM - 11PM", "BIHOURLY");
// console.log(hourlyConverter("23.30"));

module.exports = { timeSlotGenerator };
