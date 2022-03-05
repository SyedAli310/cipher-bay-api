require("dotenv").config();

const adminCheck = (req, res, next) => {
  // get admin secret from session
  const { adminSecret } = req.session;
  // compare admin secret with the one from the request
  if (adminSecret && adminSecret === process.env.ADMIN_SECRET) {
    next();
  } else {
    res.status(401).json({
      error: true,
      msg: "Unauthorized - Admin access only",
    });
  }
};

module.exports = adminCheck;
