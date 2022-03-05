const express = require("express");
const router = express.Router();

const { homeController, dashController, loginController, logoutController, githubController } = require("../controllers/navigation");

router.route('/').get(homeController);
router.route('/dash').get(dashController);
router.route('/login').get(loginController);
router.route('/logout').get(logoutController);
router.route('/github').get(githubController);


module.exports = router;