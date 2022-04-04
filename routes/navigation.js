const express = require("express");
const router = express.Router();

const {
  panelController,
  dashController,
  loginController,
  logoutController,
  githubController,
} = require("../controllers/navigation");

router.route("/").get(panelController);
router.route("/dash").get(dashController);
router.route("/admin/login").get(loginController);
router.route("/logout").get(logoutController);
router.route("/github").get(githubController);

module.exports = router;
