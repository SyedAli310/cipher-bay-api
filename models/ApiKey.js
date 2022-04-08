const mongoose = require("mongoose");

const ApiKeySchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: [true, "api key identifier is required"],
    },
    value: {
      type: String,
      required: [true, "api key value is required"],
      // length should be 32 characters
      validate: {
        validator: (v) => v.length === 32,
        message: "api key must be 32 characters long",
      },
      unique: true,
    },
    active: {
      type: Boolean,
      default: true,
      required: [true, "api key state is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("API_KEYS", ApiKeySchema);
