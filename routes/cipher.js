const express = require("express");
const router = express.Router();

const { encoder, decoder } = require("../controllers/cipher");

router.route('/encode').get(encoder);
router.route('/decode').get(decoder);

module.exports = router;