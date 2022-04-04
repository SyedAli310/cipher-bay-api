const express = require("express");
const router = express.Router();

const {
  viewSchemes,
  addScheme,
  deleteScheme,
} = require("../controllers/scheme");

router.route("/view").get(viewSchemes);
router.route("/view/:id").get(viewSchemes);
router.route("/add").post(addScheme);
router.route("/delete/:id").delete(deleteScheme);

module.exports = router;
