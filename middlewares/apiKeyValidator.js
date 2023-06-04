require("dotenv").config();
const ApiKey = require("../models/ApiKey");

const apiKeyValidator = async (req, res, next) => {
  // get apiKey from header
  const apiKey = req.header("apiKey");
  // check if apiKey exists
  if (!apiKey) {
    return res
      .status(401)
      .json({ error: true, msg: "please provide an api key" });
  }
  // check if apiKey is valid
  const keyIsValid = await ApiKey.findOne({ value: apiKey });
  if (!keyIsValid) {
    return res.status(401).json({ error: true, msg: "invalid api key" });
  }
  const keyIsActive = await ApiKey.findOne({ value: apiKey, active: true });
  if (!keyIsActive) {
    return res
      .status(401)
      .json({ error: true, msg: "this api key is not active" });
  }
  // if apiKey is valid, continue
  next();
};

module.exports = apiKeyValidator;
