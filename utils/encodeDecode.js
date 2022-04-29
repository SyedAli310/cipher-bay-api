
const encode = async (str, codeScheme) => {
  //str -> 'demo string'
  var result = [];
  var splittedStr = str.split(" ");

  for (var i = 0; i < splittedStr.length; i++) {
    if (i > 0) {
      result.push(" ");
    }
    for (var j = 0; j < splittedStr[i].length; j++) {
      result.push(codeScheme[splittedStr[i][j].toLowerCase()]);
      result.push("-");
    }
    result.pop();
  }

  //console.log(result);
  return result.join("");
};

const decode = async (numCode, codeScheme) => {
  //numCode -> '20-30-182-240  210-462-182-12-240-20-30'
  var tempRes = [];
  var result = [];
  var splittedNumCode = numCode.toString().split(" ");

  for (var i = 0; i < splittedNumCode.length; i++) {
    if (splittedNumCode[i] == "") {
      delete splittedNumCode[i];
    } else {
      tempRes.push(splittedNumCode[i].split("-"));
    }
  }

  for (var i = 0; i < tempRes.length; i++) {
    if (i > 0) {
      result.push(" ");
    }
    for (var j = 0; j < tempRes[i].length; j++) {
      result.push(codeScheme[tempRes[i][j]]);
    }
  }

  //console.log(result);
  return result.join("");
};

module.exports = {
  encode,
  decode,
};
