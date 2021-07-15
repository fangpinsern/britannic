const { Schema, connection, Types } = require("mongoose");

const VenueSchema = new Schema(
  {
    name: { type: String, required: true },
    capacity: { type: Number, required: true },
    openingHours: { type: String, required: true },
    priorityEmails: { type: [String] },
    notes: { type: String, maxLength: 500 },
  },
  {
    collection: "venues",
    timestamps: true,
  }
);

module.exports = connection.model("VenueSchema", VenueSchema);
