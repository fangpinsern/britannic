const { Schema, connection, Types } = require("mongoose");

const BookingReqSchema = new Schema(
  {
    email: { type: String, required: true },
    venue: { type: Types.ObjectId, ref: "VenueSchema", required: true },
    date: { type: Date, required: true },
    slots: { type: [Number], required: true },
    isRecurring: { type: Boolean, required: true, default: false },
    recurringStart: { type: Date },
    recurringEnd: { type: Date },
    isApproved: { type: Boolean, required: true, default: false },
    isRejected: { type: Boolean, required: true, default: false },
    bookingId: { type: Types.ObjectId, ref: "BookingSchema", required: true },
    notes: { type: String, maxLength: 500 },
  },
  {
    collection: "booking_reqs",
    timestamps: true,
  }
);

module.exports = connection.model("BookingReqSchema", BookingReqSchema);
