module.exports = schemeValidate = async (schemeObj) => {
    const keySet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    if (schemeObj.constructor !== Object) {
        return 'scheme must be an object';
    }
    if (Object.keys(schemeObj).length !== 26) {
        return 'scheme must have 26 key-value pairs';
    }
    if(!Object.keys(schemeObj).every(String)){
        return 'scheme keys must be strings';
    }
    if(!Object.values(schemeObj).every(Number)){
        return 'scheme values must be numbers';
    }
    if(!keySet.every(item => schemeObj.hasOwnProperty(item.toLowerCase()))) {
        return 'scheme must have all and exact keys (a-z)';
    }
    return 'validated';  
}
