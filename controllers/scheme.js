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
        schemes_count: schemes.length,
        });
    } catch (error) {
        res.status(500).json({
        error: true,
        msg: error.message
        });
    }
}

const addScheme = async (req, res) => {
    const { name, alias, encode, decode } = req.body;
    try {
        const scheme = await Scheme.create({
            name,
            alias,
            encode,
            decode,
        });
        if(!scheme) {
            return res.status(404).json({
                error: true,
                msg: "Could not add the scheme to the database"
            });
        }
        res.status(201).json({
            error: false,
            msg: "Scheme added successfully",
            scheme: scheme
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            msg: error.message
        });
    }
}

module.exports = {
    viewSchemes,
    addScheme
}