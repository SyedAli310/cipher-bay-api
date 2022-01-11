const Scheme = require("../models/Scheme");

const viewSchemes = async (req, res) => {
    try {
        const schemes = await Scheme.find();
        if(!schemes) {
            return res.status(404).json({
                error: true,
                msg: "Could not fetch any schemes from the database"
            });
        }
        res.status(200).json({
        error: false,
        scheme: schemes,
        count: schemes.length,
        });
    } catch (error) {
        res.status(500).json({
        error: true,
        msg: error.message
        });
    }
}

module.exports = {
    viewSchemes
}