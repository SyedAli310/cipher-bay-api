const express = require("express");
const router = express.Router();

const { viewSchemes } = require("../controllers/scheme");

router.route('/view').get(viewSchemes);

module.exports = router;

