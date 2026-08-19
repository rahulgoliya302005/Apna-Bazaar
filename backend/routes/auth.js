const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Mobile Number Login
router.post("/login", async (req, res) => {
    try {
        const { mobile } = req.body;

        if (!mobile) {
            return res.status(400).json({
                success: false,
                message: "Mobile number is required"
            });
        }

        if (!/^[0-9]{10}$/.test(mobile)) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid 10-digit mobile number"
            });
        }

        let user = await User.findOne({ mobile });

        if (!user) {
            user = await User.create({
                mobile: mobile
            });
        }

        res.json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                mobile: user.mobile,
                name: user.name
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

module.exports = router;
