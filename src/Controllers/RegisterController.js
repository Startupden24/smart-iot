// Package Importing
const RegisterService = require("../Services/RegisterService");
const {applications,instances}= require('../Middleware/createApplication');

// User Register Creation
const userRegister = async (req, res) => {
    try {
        let data = await RegisterService.userCreateService(req);
        // User Register Checking
        if (!data) {
            res.status(409).send({ message: "User Already Registered" })
        }
        else {
            //create default application
            /*applications(data,function(response){
                if(!response.error){
                res.send({ data, success: "User Registered Successfully" })
            }
            })*/
            res.send({ data, success: "User Registered Successfully" })            
        }
    }
    catch (e) {
        console.error(e)
    }

}

// View Separate User Details
const singleUser = async (req, res) => {
    try {
        let getUserInfo = await RegisterService.single_user_view(req)
        res.send(getUserInfo)
    }
    catch (e) {
        console.error(e)
    }
}


// File Uploading
const ImageUploading = async(req,res)=>{
    res.json({
        success:1,
        imageUrl:`${process.env.HOST}/picture/${req.file.filename}`
    })
}

//Add client
const addClient=async(req,res)=>{
    try {
        let data = await RegisterService.clientCreateService(req);
        // User Register Checking
        if (!data) {
            res.status(409).send({ message: "User Already Registered" })
        }
        else {
            res.send({ data, success: "Client Registered Successfully" })           
            
        }
    }
    catch (e) {
        console.error(e)
    }
}

// Exports Model

module.exports = { userRegister, singleUser , ImageUploading,addClient }