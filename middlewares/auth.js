require('dotenv').config();

const auth = (req, res, next) => {
    // get apiKey from header
    const apiKey = req.header('apiKey');
    if(!apiKey){
        return res.status(401).json({error: true, msg: "please provide an api key"});
    }
    if(apiKey !== process.env.API_KEY){
        return res.status(401).json({error: true, msg: "invalid api key"});
    }
    next();
};

module.exports = auth;