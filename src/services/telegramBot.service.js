const TelegramBot = require("node-telegram-bot-api");
const { TELEGRAM_BOT_TOKEN } = require("../config");
const {
  timingSlotNumberToTimingMapping,
} = require("../constants/slotNumberToTimingMapping");
const { convertUnixToDateString } = require("../utils/dateToUnix");

const token = TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

const sendMessageToChannel = (message) => {
  bot.sendMessage("-1001589190063", message).catch((err) => {
    console.log("Channel message not sent");
  });
};

const venueBookingRequestMessageBuilder = (bookingRequest) => {
  const email = bookingRequest.email;
  console.log(bookingRequest.venue);
  const venueName = bookingRequest.venue.name;
  const date = convertUnixToDateString(bookingRequest.date);
  const timeSlots = bookingRequest.timingSlots.map((timeSlot) => {
    return timingSlotNumberToTimingMapping[timeSlot];
  });

  const notes = bookingRequest.notes;

  const returnMessage = `Email: ${email}\nvenueName: ${venueName}\ndate: ${date}\ntimeSlots: ${timeSlots}\nnotes: ${notes} `;

  return returnMessage;
};

module.exports = { sendMessageToChannel, venueBookingRequestMessageBuilder };
