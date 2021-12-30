const { code__NTC__1, code__NTC__2, code__NTC__3 } = require("./numToChar");

const { code__CTN__1, code__CTN__2, code__CTN__3 } = require("./charToNum");

const scheme_1 = {
  encode: code__CTN__1,
  decode: code__NTC__1,
};
const scheme_2 = {
  encode: code__CTN__2,
  decode: code__NTC__2,
};
const scheme_3 = {
  encode: code__CTN__3,
  decode: code__NTC__3,
};

const schemeCollection = {scheme_1, scheme_2, scheme_3};

module.exports = schemeCollection;
