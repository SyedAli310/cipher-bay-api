const express = require("express");
const router = express.Router();

// import admin controller
const { admin: adminController } = require("../controllers");

router.route("/apikeys").get(adminController.getAllApiKeys);
router.route("/apikey/:id").get(adminController.getApiKeyById);
router.route("/apikey/new").post(adminController.generateApiKey);
router.route("/apikey/enable").post(adminController.enableApiKey);
router.route("/apikey/disable").post(adminController.disableApiKey);

module.exports = router;
