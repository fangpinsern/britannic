const {
  timingSlotNumberToTimingMapping,
} = require("../constants/slotNumberToTimingMapping");

const mapSlotsToTiming = (slot) => {
  return timingSlotNumberToTimingMapping[slot];
};

module.exports = { mapSlotsToTiming };
