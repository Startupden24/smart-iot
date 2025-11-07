// Package Importing
const { userRegister } = require("../Models/User")


// View all the Profile (Public,private)
const get_all_user_profile = async (req, res) => {
    try {
        const all_profiles = await userRegister.find();
        res.json({all_profiles}) 
    }
    catch (e) {
        return console.error(e)
    }
}


module.exports = { get_all_user_profile }
