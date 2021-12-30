const express = require("express");
const app = express();

const { encode, decode } = require("./middlewares/encode-decode");
const schemeCollection = require("./codeSchemes/schemeSelection");

app.use(express.json());

const validSchemes = Object.keys(schemeCollection);

app.get("/decode", async (req, res) => {
  const { code } = req.query;
  if (!code) {
    res.status(400).json({ error:true, msg: "please provide a code" });
  } else {
    const schemeName = `scheme_${code.split("@").reverse()[0]}`;
    const codingScheme = schemeCollection[schemeName].decode;
    const actualCode = code.split("@").reverse()[1];
    try {
      const decoded = await decode(actualCode, codingScheme);
      res.status(200).json({ error:false , code, decoded, schemeUsed: schemeName });
    } catch (err) {
      res.status(400).json({error:true, msg:err.message});
    }
  }
});
app.get("/encode", async (req, res) => {
  const { str, scheme } = req.query;
  if (!scheme || !str) {
    res
      .status(400)
      .json({ error:true, msg: "please provide a string and a coding scheme" });
  } else {
    if (!validSchemes.includes(scheme)) {
      res.status(400).json({ error:true, msg: "please provide a valid scheme" });
    } else {
      const codingScheme = schemeCollection[scheme].encode;
      const identifier = scheme.split("_").reverse()[0];
      try {
        const encoded = (await encode(str, codingScheme)) + "@" + identifier;
        res.status(200).json({error:false, text:str, encoded, scheme });
      } catch (err) {
        res.status(400).json({error:true, msg:err.message});
      }
    }
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
