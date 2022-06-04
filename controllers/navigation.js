// require path to resolve file paths
const path = require("path");
require("dotenv").config();

const panelController = async (req, res) => {
  const { adminSecret } = req.session;
  if (!adminSecret) {
    return res.redirect("/panel/admin/login");
  }
  res.sendFile(path.join(__dirname, "../public/panel.html"));
};

const dashController = async (req, res) => {
  const { adminSecret } = req.session;
  if (!adminSecret) {
    return res.redirect("/panel/admin/login");
  }
  res.sendFile(path.join(__dirname, "../public/pages/dashboard.html"));
};

const loginController = async (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/login.html"));
};

const logoutController = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        error: true,
        msg: "Could not logout. Please try again",
      });
    }
    res.redirect("/panel/admin/login");
  });
};

const githubController = async (req, res) => {
  res.redirect("https://github.com/SyedAli310/cipher-bay-api");
};

module.exports = {
  panelController,
  dashController,
  loginController,
  logoutController,
  githubController,
};
