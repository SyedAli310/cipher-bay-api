const express = require("express");
const app = express();

//routers
const cipherRouter = require("./routes/cipher");

app.use(express.json());

//routes
app.use("/api/v1/cipher", cipherRouter);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
