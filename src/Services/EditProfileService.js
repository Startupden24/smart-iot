// Package Importing
const { userRegister } = require("../Models/User");
const bcrypt = require ("bcryptjs");


// Edit Profile

const editProfile = async (req) => {
    try {
        const { name, email, password, number, bio, profile, imageupload } = req.body;
        const user = await userRegister.findById({ _id: req.userId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10); // Hash the new password
            user.password = hashedPassword;
        }
        if (number) user.number = number;
        if (bio) user.bio = bio;
        if (profile) user.profile = profile;
        if (imageupload) user.imageupload = imageupload;
        await user.save();
        return user
    }
    catch (error) {
        console.error(error);
        return error
    }
};

// Exports

module.exports = { editProfile }