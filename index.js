//extra security packages(middlewares)
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const path = require('path');

// console related package
const logColor = require("cli-color");

// initialize express app
const express = require("express");
const app = express();

//db connection
const connectDB = require("./db/connect");

//middlewares
const middlewares = require("./middlewares");

//routers
const routers = require("./routes");

//models
const { User } = require("./models");


app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 250,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname, "public")));
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

app.use(function(req, res, next) {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "*");
  res.set("Access-Control-Allow-Credentials", "true");
  next();
});

// base route
app.get("/", (req, res) => {
  res.redirect("https://cipherbay.vercel.app");
});

// routers
app.use("/panel", routers.navigation);
app.use("/api/v1/auth", routers.auth);
app.get("/check-user-status", middlewares.auth, async (req, res) => {
  const loggedInUser = await User.findOne({_id: req.user.userId}).select('firstName lastName username email');
  if(loggedInUser) {
    return res.status(200).json({
      error: false,
      auth: true,
      loggedInUser: loggedInUser
    })
  }
  res.status(401).json({
    error: true,
    auth: false,
    msg: `No user found with id - ${req.user.userId}`
  }) 
});
app.use("/api/v1/cipher", middlewares.apiKeyValidator, routers.cipher);
app.use(
  "/api/v1/scheme",
  middlewares.apiKeyValidator,
  middlewares.adminCheck,
  routers.scheme
);
app.use(
  "/api/v1/admin",
  middlewares.apiKeyValidator,
  middlewares.adminCheck,
  routers.admin
);

// Handling non existing requests from the client
app.use((req, res, next) => {
  res.status(404).sendFile(__dirname + "/public/404.html");
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const mongoConn = await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      if (process.env.IN_PROD) {
        console.log(
          `Server Live on machine -> ${require("os").hostname()}` + "\n",
          `Listening requests on port -> ${PORT}` + "\n",
          `MongoDB Host -> ${mongoConn.connections[0].host}` + "\n",
          `DB Name -> ${mongoConn.connections[0].name}` + "\n"
        );
        return;
      } else {
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
        return;
      }
    });
  } catch (error) {
    console.log(logColor.red(error));
  }
};
startServer();
