const reverseObj = require("./reverseObj");

const makeSchemes = async (scheme) => {
    if(scheme.constructor !== Object) {
        return null;
    }
    encode_processed = scheme
    decode_processed = reverseObj(scheme);
    // process the scheme types
    Object.keys(encode_processed).every(item => item = item.toString().toLowerCase());
    Object.values(encode_processed).every(item => item = parseInt(item));
    // add spaces to the scheme
    encode_processed[" "] = " ";
    decode_processed[" "] = " ";
    // return the processed schemes
    return { encode_processed, decode_processed };
}

module.exports = makeSchemes;