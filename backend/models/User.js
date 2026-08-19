const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        mobile: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        name: {
            type: String,
            default: "Guest User"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);
