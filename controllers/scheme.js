const Scheme = require("../models/Scheme");
const { processScheme } = require("../utils/schemeProcess");
const generateKey = require("../utils/generateKey");

const viewSchemes = async (req, res) => {
  const { id } = req.params;
  try {
    const schemes = await Scheme.find({ _id: id ? id : { $ne: null } });
    if (!schemes) {
      return res.status(404).json({
        error: true,
        msg: "Could not fetch any schemes from the database",
      });
    }
    res.status(200).json({
      error: false,
      scheme: schemes,
      schemes_count: schemes.length,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      msg: error.message,
    });
  }
};

const addScheme = async (req, res) => {
  const { alias, scheme } = req.body;
  try {
    if (!scheme || !alias) {
      return res.status(400).json({
        error: true,
        msg: "please provide all the required fields",
      });
    }
    const processed_alias = alias.trim().replace(/\s/g, "").toLowerCase();
    if (processed_alias.length < 3 || processed_alias.length > 18) {
      return res.status(400).json({
        error: true,
        msg: "alias must be between 3 and 18 characters",
      });
    }
    // check if alias or scheme already exists
    const alias_exists = await Scheme.findOne({ alias: processed_alias });
    if (alias_exists) {
      return res.status(400).json({
        error: true,
        msg: `scheme with alias '${processed_alias}' already exists, please choose another alias`,
      });
    }

    const processResponse = await processScheme(scheme);
    if (processResponse.error) {
      return res.status(400).json({ error: true, ...processResponse });
    }

    const { encode_scheme, decode_scheme } = processResponse;

    const scheme_exists = await Scheme.findOne({ encode: encode_scheme });
    if (scheme_exists) {
      return res.status(400).json({
        error: true,
        msg: `a similar scheme already exists, please choose different scheme values`,
      });
    }

    const newScheme = {
      name: `scheme_${generateKey(10, true, 6)}`,
      alias: processed_alias,
      encode: encode_scheme,
      decode: decode_scheme,
    };
    // add the scheme to the database
    const scheme_added = await Scheme.create(newScheme);
    if (!scheme_added) {
      return res.status(500).json({
        error: true,
        msg: "error adding scheme to the database",
      });
    }
    res.status(201).json({
      error: false,
      msg: "scheme added successfully",
      scheme: scheme_added,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      msg: error.message,
    });
  }
};

module.exports = {
  viewSchemes,
  addScheme,
};
