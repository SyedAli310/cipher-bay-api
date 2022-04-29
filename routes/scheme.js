const express = require("express");
const router = express.Router();

// import scheme controller
const { scheme: schemeController } = require("../controllers");

router.route("/view").get(schemeController.viewSchemes);
router.route("/view/:id").get(schemeController.viewSchemes);
router.route("/add").post(schemeController.addScheme);
router.route("/delete/:id").delete(schemeController.deleteScheme);

module.exports = router;
