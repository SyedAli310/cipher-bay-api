const ApiKey = require("../models/ApiKey");
const randomKey = require("generate-api-key");

const generateApiKey = async (req, res) => {
  const { identifier } = req.body;

  try {
    if (!identifier || identifier.trim().length === 0) {
      return res.json({
        error: true,
        msg: "identifier is required",
      });
    }
    const keyExists = await ApiKey.findOne({ identifier });
    if (keyExists) {
      return res.status(400).json({
        message: `api key with idetifier ${identifier} already exists`,
      });
    }
    const newKey = randomKey({
      length: 32,
      method: "string",
      pool: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    });

    // add new key to database
    const newKeySaved = await ApiKey.create({ value: newKey, identifier });
    if (!newKeySaved) {
      return res.json({
        error: true,
        msg: "error saving new key",
      });
    }
    res.json({
      error: false,
      msg: "key generated successfully",
      key: newKeySaved,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      msg: error.message,
    });
  }
};

const getAllApiKeys = async (req, res) => {
  const allKeys = await ApiKey.find();
  if (!allKeys) {
    res.json({
      error: true,
      msg: "no keys found",
    });
  }
  res.json({
    error: false,
    keys: allKeys,
    hits: allKeys.length,
  });
};

const getApiKeyById = async (req, res) => {
  const { id } = req.params;
  try {
    const key = await ApiKey.findOne({ _id: id });
    if (!key) {
      return res.json({ error: true, msg: "key not found" });
    }
    res.json({ error: false, key });
  } catch (error) {
    res.json({
      error: true,
      msg: error.message,
    });
  }
};

const enableApiKey = async (req, res) => {
  const { id } = req.body;
  try {
    const key = await ApiKey.findOne({ _id: id });
    if (!key) {
      return res.json({ error: true, msg: "key not found" });
    }
    key.active = true;
    await key.save();
    res.json({ error: false, key });
  } catch (error) {
    res.json({
      error: true,
      msg: error.message,
    });
  }
};

const disableApiKey = async (req, res) => {
  const { id } = req.body;
  try {
    const key = await ApiKey.findOne({ _id: id });
    if (!key) {
      return res.json({ error: true, msg: "key not found" });
    }
    key.active = false;
    await key.save();
    res.json({ error: false, key });
  } catch (error) {
    res.json({
      error: true,
      msg: error.message,
    });
  }
};

module.exports = {
  generateApiKey,
  getAllApiKeys,
  getApiKeyById,
  enableApiKey,
  disableApiKey,
};
