module.exports = generateKey = (tokenLen, hyphen, hyphenPos) => {
    let string = "abcdefghijklmnopqrstuvwxyz";
    var token = [];
    if (hyphen == true) {
      for (let i = 0; i < tokenLen; i++) {
        let pos = Math.floor(Math.random() * string.length);
        if (hyphenPos == undefined) hyphenPos = 1;
        if (i % hyphenPos == 0) {
          token.push("-");
        }
        token.push(string[pos]);
      }
      token.shift();
    } else if (hyphen == false) {
      for (let i = 0; i < tokenLen; i++) {
        let pos = Math.floor(Math.random() * string.length);
        token.push(string[pos]);
      }
    } else {
      token = ["Incorrect", " ", "Arguments", " ", "Provided"];
    }
    //console.log(token);
    token = token.join("");
    return token;
  }
  