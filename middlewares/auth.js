require('dotenv').config();

const auth = (req, res, next) => {
    const {apiKey} = req.query;
    if(!apiKey){
        return res.status(401).json({error: true, msg: "please provide an api key"});
    }
    if(apiKey !== process.env.API_KEY){
        return res.status(401).json({error: true, msg: "invalid api key"});
    }
    next();
};

module.exports = auth;