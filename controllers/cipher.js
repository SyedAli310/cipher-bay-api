const { encodeDecode: convertOperations } = require("../utils");
const { fetchSchemes } = require("../utils");

const encoder = async (req, res) => {
  let { str } = req.body;
  const { scheme } = req.body;
  // regex to strip out special characters
  const regex = /[^a-zA-Z ]/g;
  str = str.replace(regex, "");
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
    const schemeCollection = await fetchSchemes();
    const validSchemes = schemeCollection.map((scheme) => scheme.name);
    if (!schemeCollection || !validSchemes) {
      return res.status(400).json({
        error: true,
        msg: "could not fetch schemes from the server",
      });
    }
    if (!validSchemes.includes(scheme)) {
      return res
        .status(400)
        .json({ error: true, msg: "please provide a valid scheme" });
    }
    const codingScheme = schemeCollection.filter((i) => i.name === scheme)[0];
    const identifier = scheme.split("_").reverse()[0];
    const encoded =
      (await convertOperations.encode(str, codingScheme.encode)) +
      "@" +
      identifier;
    res.status(200).json({
      error: false,
      text: str,
      encoded,
      schemeUsed: { name: codingScheme.name, alias: codingScheme.alias },
    });
  } catch (err) {
    res.status(500).json({ error: true, msg: err.message });
  }
};

const decoder = async (req, res) => {
  const { code } = req.body;
  try {
    if (!code) {
      return res
        .status(400)
        .json({ error: true, msg: "please provide a code" });
    }
    const schemeName = `scheme_${code.split("@").reverse()[0]}`;
    const schemeCollection = await fetchSchemes();
    const validSchemes = schemeCollection.map((scheme) => scheme.name);
    if (!schemeCollection || !validSchemes) {
      return res.status(400).json({
        error: true,
        msg: "could not fetch schemes from the server",
      });
    }
    if (!validSchemes.includes(schemeName)) {
      return res.status(400).json({
        error: true,
        msg: "please provide a valid cipher scheme to decode",
      });
    }
    const codingScheme = schemeCollection.filter(
      (i) => i.name === schemeName
    )[0];
    const actualCode = code.split("@").reverse()[1];
    const decoded = await convertOperations.decode(
      actualCode,
      codingScheme.decode
    );
    if (!decoded.trim()) {
      return res.status(400).json({
        error: true,
        msg: "could not decode the code",
      });
    }
    res.status(200).json({
      error: false,
      code,
      decoded,
      schemeUsed: { name: codingScheme.name, alias: codingScheme.alias },
    });
  } catch (err) {
    res.status(500).json({ error: true, msg: err.message });
  }
};

const schemes = async (req, res) => {
  const schemeCollection = await fetchSchemes('name alias createdAt createdByName');
  // const validSchemes = [];
  // schemeCollection.forEach((scheme, index) => {
  //   validSchemes.push({
  //     name: scheme.name,
  //     alias: scheme.alias,
  //   });
  // });
  const info = 'Schemes are used to (encode <-> decode) (text <-> ciphers). The encoded ciphers are separated by "-" and the identifier is used to decode the code.';
  res.status(200).json({
    error: false,
    info,
    schemes_count: schemeCollection.length,
    schemes: schemeCollection,
  });
};

const adminLogin = async (req, res) => {
  const { adminSecret } = req.body;
  if (adminSecret.trim() && adminSecret.trim() === process.env.ADMIN_SECRET) {
    req.session.adminSecret = adminSecret.trim();
    res.status(200).json({ error: false, msg: "admin logged in" });
  } else {
    res.status(401).json({
      error: true,
      msg: "please provide a valid admin secret",
    });
  }
};

module.exports = { encoder, decoder, schemes, adminLogin };
