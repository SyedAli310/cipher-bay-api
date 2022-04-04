//extra security packages(middlewares)
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
const session = require("express-session");
const MongoStore = require("connect-mongo");

// console related package
const logColor = require("cli-color");

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
const navigationRouter = require("./routes/navigation");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 250,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.static("public"));
app.use(
  session({
    name: process.env.SESS_NAME,
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60,
      sameSite: true,
      secure: process.env.IN_PROD || false,
    },
  })
);

// extra packages
app.use(helmet());
app.use(cors());
app.use(xss());

// routers
app.use("/", navigationRouter);
app.use("/api/v1/cipher", auth, cipherRouter);
app.use("/api/v1/scheme", auth, adminCheck, schemeRouter);

// Handling non existing requests from the client
app.use((req, res, next) => {
  res.status(404).sendFile(__dirname + "/public/404.html");
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const mongoConn = await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(
        // the detailed(colored) log
        `________________________________________________________` + "\n\n",
        logColor.blueBright.bold(`Server Live on machine -> `) +
          logColor.yellow.bold(require("os").hostname()) +
          "\n",
        logColor.blueBright.bold(`Listening requests on port -> `) +
          logColor.green.bold(PORT) +
          "\n",
        logColor.blueBright.bold(`MongoDB Host -> `) +
          logColor.redBright.bold(mongoConn.connections[0].host) +
          "\n",
        logColor.blueBright.bold(`DB Name -> `) +
          logColor.magentaBright.bold(mongoConn.connections[0].name) +
          "\n",
        `_______________________________________________________`
      );
    });
  } catch (error) {
    console.log(logColor.red(error));
  }
};

startServer();
