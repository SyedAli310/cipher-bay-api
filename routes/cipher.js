const express = require("express");
const router = express.Router();

const { encoder, decoder, schemes } = require("../controllers/cipher");

router.route('/encode').post(encoder);
router.route('/decode').post(decoder);
router.route('/schemes').get(schemes);

module.exports = router;