const { encode, decode } = require("../middlewares/encode-decode");
// const schemeCollection = require("../codeSchemes/schemeSelection");
const fetchSchemes = require("../codeSchemes/schemeSelection");

const encoder = async (req, res) => {
  const { str, scheme } = req.query;
  const schemeCollection = await fetchSchemes();
  const validSchemes = schemeCollection.map((scheme) => scheme.name);
  try {
    if (!str) {
      return res.status(400).json({
        error: true,
        msg: "please provide a string to encode",
      });
    }
    if (!scheme) {
      return res.status(400).json({
        error: true,
        msg: "please provide a scheme to encode",
      });
    }
    if (!validSchemes.includes(scheme)) {
      return res
        .status(400)
        .json({ error: true, msg: "please provide a valid scheme" });
    }
    const codingScheme = schemeCollection.filter( i => i.name === scheme)[0].encode;
    const identifier = scheme.split("_").reverse()[0];
    const encoded = (await encode(str, codingScheme)) + "@" + identifier;
    res.status(200).json({ error: false, text: str, encoded, schemeUsed:scheme });
  } catch (err) {
    res.status(500).json({ error: true, msg: err.message });
  }
};

const decoder = async (req, res) => {
  const { code } = req.query;
  const schemeCollection = await fetchSchemes();
  const validSchemes = schemeCollection.map((scheme) => scheme.name);
  try {
    if (!code) {
      return res
        .status(400)
        .json({ error: true, msg: "please provide a code" });
    }
    const schemeName = `scheme_${code.split("@").reverse()[0]}`;
    if (!validSchemes.includes(schemeName)) {
      return res.status(400).json({
        error: true,
        msg: "please provide a valid cipher scheme to decode",
      });
    }
    const codingScheme = schemeCollection.filter( i => i.name === schemeName)[0].decode;
    console.log(codingScheme);
    const actualCode = code.split("@").reverse()[1];
    const decoded = await decode(actualCode, codingScheme);
    res
      .status(200)
      .json({ error: false, code, decoded, schemeUsed: schemeName });
  } catch (err) {
    res.status(500).json({ error: true, msg: err.message });
  }
};

const schemes = async (req, res) => {
  const info =
    'Schemes are used to (encode <-> decode) (text <-> ciphers). The encoded ciphers are separated by "-" and the identifier is used to decode the code. The identifier can be usually seen after the @ symbol as the end of the cipher.';
  res.status(200).json({ error: false, info, schemes: validSchemes });
};

module.exports = { encoder, decoder, schemes };
