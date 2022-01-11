require('dotenv').config();

const adminCheck = (req, res, next) => {
    // get admin secret from header
    const adminSecret = req.header('adminSecret');
    if(!adminSecret){
        return res.status(401).json({
            error: true, 
            msg: "please provide an admin secret to access this resource",
        });
    }
    if(adminSecret !== process.env.ADMIN_SECRET){
        return res.status(401).json({
            error: true, 
            msg: "you are not authorized or don't have admin rights to access this resource",
            providedSecret: adminSecret
        });
    }
    next();
};

module.exports = adminCheck;