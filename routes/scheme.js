const express = require("express");
const router = express.Router();

const { viewSchemes } = require("../controllers/scheme");

router.route('/view').get(viewSchemes);
router.route('/view/:id').get(viewSchemes);

module.exports = router;

