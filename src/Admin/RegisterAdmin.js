// Package Importing
const mongoose = require ("mongoose");
const {v4} = require ("uuid");

// Admin Schema Creation

const adminSchema = new mongoose.Schema({
    _id: {
        type : String,
        default : v4
    },
    name: {
        type : String,
        trim : true,
        required : true
    },
    email : {
        type : String,
        trim : true,
        required : true,
        unique : true
    },
    password : {
        type : String,
        trim : true,
        required : true,
    },
    role : {
        type : String,
        default : "Admin"
    }
},{timestamps : true})

// Model Exports

const adminRegister = mongoose.model("adminregister",adminSchema);

module.exports = {adminRegister}