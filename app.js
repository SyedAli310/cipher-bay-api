//extra security packages(middlewares)
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

// initialize express app
const express = require("express");
const app = express();

//db connection
const connectDB = require("./db/connect");

//middlewares
const auth = require("./middlewares/auth");
const adminCheck = require("./middlewares/adminCheck");

//routers
const cipherRouter = require("./routes/cipher");
const schemeRouter = require("./routes/scheme");

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

//base routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
app.get("/github/repo", (req, res) => {
  res.redirect('https://github.com/SyedAli310/cipher-bay-api');
});

//routes
app.use("/api/v1/cipher", auth, cipherRouter);
app.use("/api/v1/scheme", adminCheck, schemeRouter);

// Handling non matching request from the client
app.use((req, res, next) => {
  res.status(404).sendFile(__dirname + "/public/404.html");
})



const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

startServer();
