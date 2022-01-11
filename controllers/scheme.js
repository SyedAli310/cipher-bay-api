const Scheme = require("../models/Scheme");

const viewSchemes = async (req, res) => {
    try {
        const schemes = await Scheme.find();
        res.status(200).json({
        success: true,
        data: schemes
        });
    } catch (error) {
        res.status(500).json({
        success: false,
        error: error.message
        });
    }
}

module.exports = {
    viewSchemes
}