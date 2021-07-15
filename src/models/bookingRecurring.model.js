const { Schema, connection, Types } = require("mongoose");

const BookingRecurringSchema = new Schema(
  {
    email: { type: String, required: true },
    venue: { type: Types.ObjectId, ref: "VenueSchema", required: true },
    slots: { type: [Number], required: true },
    isRecurring: { type: Boolean, required: true, default: false },
    recurringStart: { type: Date },
    recurringEnd: { type: Date },
    isApproved: { type: Boolean, required: true, default: false },
    notes: { type: String, maxLength: 500 },
  },
  {
    collection: "booking_recurrings",
    timestamps: true,
  }
);

module.exports = connection.model(
  "BookingRecurringSchema",
  BookingRecurringSchema
);
