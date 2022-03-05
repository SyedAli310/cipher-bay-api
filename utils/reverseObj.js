module.exports = reverseObj = (obj) =>{
    var res = {};
    for(var key in obj){
        res[obj[key]] = key;
    }
    return res;
}