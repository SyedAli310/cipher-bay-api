//extra security packages(middlewares)
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

// initialize express app
const express = require("express");
const app = express();

//middlewares
const auth = require("./middlewares/auth");

//routers
const cipherRouter = require("./routes/cipher");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 250,
  })
);
app.use(express.json({limit: '10mb'}));
app.use(express.static("public"));

// extra packages
app.use(helmet());
app.use(cors());
app.use(xss());

//base route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

//routes
app.use("/api/v1/cipher", auth, cipherRouter);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
