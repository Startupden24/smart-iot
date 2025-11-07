// Package Importing
const mongoose = require("mongoose");
// User Schema Creation
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: true
    },
    fullName:{
        type:String
    },
    email: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        trim: true,
        required: true,

    },
    role: {
        type: String,
        trim: true,
        default : "User"
    },
    clientInstance:{
        type: String,
        default: null
    },
    purpose:{
        type:String,
        trim:true,
        default:"Personal",
        enum:["Personal","Education","Business"]
    }
},{timestamps : true});

// Schema Exports

const userRegister= mongoose.model("Users",userSchema);

module.exports = {userRegister};