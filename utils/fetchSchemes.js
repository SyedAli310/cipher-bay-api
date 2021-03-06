const { Scheme } = require("../models");

// fetch schemes from mongoDB
const fetchSchemes = async () => {
  try {
    const schemes = await Scheme.find();
    return schemes;
  } catch (error) {
    console.log(error);
  }
};

module.exports = fetchSchemes;
