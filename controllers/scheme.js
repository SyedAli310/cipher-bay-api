const Scheme = require("../models/Scheme");

const viewSchemes = async (req, res) => {
    const { id } = req.params;
    try {

        const schemes = await Scheme.find({ _id: id ? id : { $ne: null } });
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