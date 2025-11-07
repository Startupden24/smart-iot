// Package Importing
const { userRegister } = require("../Models/User");

// User to view only Public Profiles
const view_public_user = async (req,res)=>{
    try{
        const publicprofiles = await userRegister.find({profile : "Public"});
        res.send(publicprofiles)
    }
    catch(e){
        return console.error(e)
    }
}

// Exports

module.exports = { view_public_user }