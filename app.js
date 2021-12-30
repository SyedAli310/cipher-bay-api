const express = require("express");
const app = express();


const { encode, decode } = require("./middlewares/encode-decode");

app.use(express.json());

app.get("/numToChar", async (req, res) => {
  const { num } = req.query;
    const result = await decode(num);
    res.status(200).json({num, result});
});
app.get("/charToNum", async (req, res) => {
  const { str } = req.query;
  const result = await encode(str);
  res.status(200).json({ str, result });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
