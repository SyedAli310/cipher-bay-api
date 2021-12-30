require("dotenv").config();
const connectDB = require("../db/connect");
const Scheme = require("../models/Scheme");

// fetch schemes from mongoDB
const fetchSchemes = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    const schemes = await Scheme.find();
    return schemes;
  } catch (error) {
    console.log(error);
  }
}

module.exports = fetchSchemes;
