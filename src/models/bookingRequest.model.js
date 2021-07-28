const { Schema, connection, Types } = require("mongoose");

const BookingReqSchema = new Schema(
  {
    email: { type: String, required: true },
    venue: { type: Types.ObjectId, ref: "VenueSchema", required: true },
    date: { type: Number, required: true },
    timingSlots: { type: [Number], required: true },
    isApproved: { type: Boolean, required: true, default: false },
    isRejected: { type: Boolean, required: true, default: false },
    notes: { type: String, maxLength: 500 },
  },
  {
    collection: "booking_requests",
    timestamps: true,
  }
);

module.exports = connection.model("BookingReqSchema", BookingReqSchema);
