require('dotenv').config();

const adminCheck = (req, res, next) => {
    // get admin secret from header
    const adminSecret = req.header('adminSecret');
    if(!adminSecret){
        return res.status(401).json({
            error: true, 
            msg: "please provide an admin token",
        });
    }
    if(adminSecret !== process.env.ADMIN_SECRET){
        return res.status(401).json({
            error: true, 
            msg: "incorrect or unauthorized admin token provided",
            providedSecret: adminSecret
        });
    }
    next();
};

module.exports = adminCheck;