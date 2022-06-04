const express = require("express");
const router = express.Router();

// import navigation controller
const { navigation: navigationController } = require("../controllers");

router.route("/").get(navigationController.panelController);
router.route("/dash").get(navigationController.dashController);
router.route("/admin/login").get(navigationController.loginController);
router.route("/logout").get(navigationController.logoutController);
router.route("/github").get(navigationController.githubController);

module.exports = router;
