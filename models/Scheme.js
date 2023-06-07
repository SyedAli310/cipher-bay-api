const mongoose = require("mongoose");

const SchemeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Scheme name is required"],
    },
    alias: {
      type: String,
      required: [true, "Scheme alias is required"],
    },
    encode: {
      type: Object,
      required: [true, "Scheme encode is required"],
    },
    decode: {
      type: Object,
      required: [true, "Scheme decode is required"],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Created by is required"],
    },
    createdByName: {
      type: String,
      required: [true, "Created by name is required"],
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Scheme", SchemeSchema);