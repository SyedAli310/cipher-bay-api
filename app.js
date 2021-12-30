const express = require("express");
const app = express();

//routers
const cipherRouter = require("./routes/cipher");

//middlewares
const auth = require("./middlewares/auth");

app.use(express.json());

//routes
app.use("/api/v1/cipher", auth , cipherRouter);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
