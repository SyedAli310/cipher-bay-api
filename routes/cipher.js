const express = require("express");
const router = express.Router();

// import cipher controller
const { cipher: cipherController } = require("../controllers");

router.route("/encode").post(cipherController.encoder);
router.route("/decode").post(cipherController.decoder);
router.route("/schemes").get(cipherController.schemes);
router.route("/adminLogin").post(cipherController.adminLogin);

module.exports = router;
