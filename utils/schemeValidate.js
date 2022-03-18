module.exports = schemeValidate = async (schemeObj) => {
  const keySet = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];
  let validationResponse = {
    error: false,
    msg: "",
  };
  const objValuesArr = Array.from(Object.values(schemeObj));
  const objKeysArr = Array.from(Object.keys(schemeObj));
  console.log(objKeysArr, objValuesArr);
  if (schemeObj.constructor !== Object) {
    validationResponse.error = true;
    validationResponse.msg = "scheme must be an object";
  } else if (Object.keys(schemeObj).length !== 26) {
    validationResponse.error = true;
    validationResponse.msg = "scheme must have 26 keys";
  } else if (Object.keys(schemeObj).some((key) => key.trim() == "")) {
    validationResponse.error = true;
    validationResponse.msg = "scheme must have non-empty keys";
  }
  // check for empty values
  else if (Object.values(schemeObj).some((value) => isNaN(value))) {
    validationResponse.error = true;
    validationResponse.msg = "scheme must have non-empty numeric values";
  } else if (!Object.keys(schemeObj).every((key) => typeof key === "string")) {
    validationResponse.error = true;
    validationResponse.msg = "scheme keys must be strings";
  } else if (
    !Object.values(schemeObj).every((value) => typeof value !== Number)
  ) {
    validationResponse.error = true;
    validationResponse.msg = "scheme values must be numbers";
  } else if (
    !keySet.every((item) => schemeObj.hasOwnProperty(item.toLowerCase()))
  ) {
    validationResponse.error = true;
    validationResponse.msg = "scheme must have all and exact keys (a-z)";
  }
  // check for duplicate values
  else if (objValuesArr.length !== new Set(objValuesArr).size) {
    // get the duplicate values
    const duplicateValues = objValuesArr.filter((item, index) => {
      return objValuesArr.indexOf(item) !== index;
    });
    validationResponse.error = true;
    validationResponse.msg = "scheme must not have duplicate values";
    validationResponse.duplicateValues = duplicateValues;
  }
  // check for duplicate keys
  else if (
    Object.keys(schemeObj).length !== new Set(Object.keys(schemeObj)).size
  ) {
    // get the duplicate keys
    const duplicateKeys = objKeysArr.filter((item, index) => {
      return objKeysArr.indexOf(item) !== index;
    });
    validationResponse.error = true;
    validationResponse.msg = "scheme must not have duplicate keys";
    validationResponse.duplicateKeys = duplicateKeys;
  }

  return validationResponse;
};
