const reverseObj = require("./reverseObj");
const validateScheme = require("./schemeValidate");

const processScheme = async (scheme) => {
  let response = {
    error: false,
    msg: "",
  };

  // process the scheme types
  Object.keys(scheme).forEach((key) => {
    key = String(key).toLowerCase();
    scheme[key] = String(scheme[key]).trim().toLowerCase();
  });

  // validate the scheme
  let validationResponse = await validateScheme(scheme);

  if (validationResponse.error) {
    response = { ...response, ...validationResponse };
    return response;
  }

  // construct the schemes
  const { encode_scheme, decode_scheme } = await constructSchemes(scheme);
  if (!encode_scheme || !decode_scheme) {
    response.error = true;
    response.msg = "there was an error processing the scheme, please try again";
    return response;
  }
  // return the processed schemes
  response.error = false;
  response.msg = "schemes processed and validated successfully";
  response.encode_scheme = encode_scheme;
  response.decode_scheme = decode_scheme;
  // console.log(response);
  return response;
};

const constructSchemes = async (processed_scheme) => {
  // reverse the scheme types
  encode_scheme = processed_scheme;
  decode_scheme = reverseObj(processed_scheme);
  // add spaces to the scheme
  encode_scheme[" "] = " ";
  decode_scheme[" "] = " ";
  // return the processed schemes
  return { encode_scheme, decode_scheme };
};

module.exports = {
  processScheme,
};
