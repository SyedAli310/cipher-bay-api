const { Scheme } = require("../models");

// fetch schemes from mongoDB
const fetchSchemes = async (fields) => {
  try {
    const fieldsToSelect = fields || '';
    const schemes = await Scheme.find().select(fieldsToSelect);
    return schemes;
  } catch (error) {
    console.log(error);
  }
};

module.exports = fetchSchemes;
