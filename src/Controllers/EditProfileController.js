// Package Importing
const { editProfile } = require("../Services/EditProfileService")


// Edit Profile 

const editUserData = async (req, res) => {
    try {
        let editData = await editProfile(req)
        res.send({ message: 'Profile updated successfully', editData });
    }
    catch (e) {
        console.error(e)
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


// Exports

module.exports = { editUserData }