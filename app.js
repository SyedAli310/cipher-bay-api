const express = require("express");
const app = express();


const { encode, decode } = require("./middlewares/encode-decode");

app.use(express.json());

app.get("/decode", async (req, res) => {
  const { numCode } = req.query;
    const result = await decode(numCode);
    res.status(200).json({numCode, result});
});
app.get("/encode", async (req, res) => {
  const { str } = req.query;
  const result = await encode(str);
  res.status(200).json({ str, result });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
