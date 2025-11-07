// Package Importing
const AdminService = require("./AdminService");

// Admin Register Creation
const adminRegister = async (req, res) => {
    try {
        let data = await AdminService.AdminCreateService(req);
        // User Register Checking
        if (!data){
            res.status(409).send({message : "Admin Already Registered"})
        }
        else{
            res.send({data,success : "Admin Registered Successfully"})
        } 
    }
    catch(e){
        console.error(e)
    }
    
}

// Exports Model

module.exports = { adminRegister}