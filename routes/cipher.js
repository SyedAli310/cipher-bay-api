const express = require("express");
const router = express.Router();

const { encoder, decoder, schemes } = require("../controllers/cipher");

router.route('/encode').get(encoder);
router.route('/decode').get(decoder);
router.route('/schemes').get(schemes);

module.exports = router;