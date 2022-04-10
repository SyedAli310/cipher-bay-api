const express = require("express");
const router = express.Router();

const {
  generateApiKey,
  getAllApiKeys,
  getApiKeyById,
  enableApiKey,
  disableApiKey,
} = require("../controllers/admin");

router.route("/apikeys").get(getAllApiKeys);
router.route("/apikey/:id").get(getApiKeyById);
router.route("/apikey/new").post(generateApiKey);
router.route("/apikey/enable").post(enableApiKey);
router.route("/apikey/disable").post(disableApiKey);

module.exports = router;
