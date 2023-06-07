const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
    {
        // _id: String,
        firstName: {
            type: String,
            required: [true, "First name is required"],
        },
        lastName: {
            type: String,
            required: [true, "Last name is required"],
        },
        userName: {
            type: String,
            required: false,
            minlength: 3,
            maxlength: 50,
            unique: true,
            sparse: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                "Please provide a valid email.",
            ],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Please provide a password."],
            minlength: 6,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        }
    },
    { timestamps: true }
);

UserSchema.pre("save", async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
    return jwt.sign(
        { userId: this._id, email: this.email },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_LIFETIME,
        }
    );
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatched = await bcrypt.compare(candidatePassword, this.password);
    return isMatched;
};

module.exports = mongoose.model("User", UserSchema);
