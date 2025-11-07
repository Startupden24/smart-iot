// Package Importing
const { userRegister } = require('../Models/User');
const Bcryptjs = require("bcryptjs");


// User Register Creation

const userCreateService = async (req) => {
    try {
        // Get email and password
        const { email, password } = req.body;
        // Hash Generation
        const salt = await Bcryptjs.genSaltSync(10);
        const hash = await Bcryptjs.hashSync(password, salt);
        // Check User Avaialble or not
        const findUser = await userRegister.findOne({ email: email });
        if (findUser) {
            return console.log(" User Already Registered")
        }
        else{
            let userCreate = await userRegister.create({...req.body,...{password : hash}})
            return userCreate;
        }
    }
    catch (e) {
        return console.error(e);
    }

}
// Client Register Creation

const clientCreateService = async (req) => {
    try {
        // Get email and password
        const {clientName,clientPassword,instanceUrl} = req.body;
        // Hash Generation
        const salt = await Bcryptjs.genSaltSync(10);
        const hash = await Bcryptjs.hashSync(clientPassword, salt);
        // Check User Avaialble or not
        const findUser = await userRegister.findOne({ username:clientName });
        if (findUser) {
            return console.log(" User Already Registered")
        }
        else{
            let userCreate = await userRegister.create({
                username:clientName,
                password : hash,
                clientInstance:instanceUrl,
                role:"Client",
                purpose:'Personal'
            })
            return userCreate;
        }
    }
    catch (e) {
        return console.error(e);
    }

}

// Separate User View Our Profile

const single_user_view = async(req)=>{
    try{
        // Get id
        const {userId} = req
        let user_view = await userRegister.findById(userId);
        console.log(user_view,"service data")
        return user_view
    }
    catch(e){
        console.error(e)
    }
}

// Module

module.exports = { userCreateService , single_user_view,clientCreateService }