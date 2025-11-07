// Package Importing
const { adminRegister } = require("./RegisterAdmin");
const Bcryptjs = require ("bcryptjs")

// Admin Register
const AdminCreateService = async (req) => {
    try {
        // Get Email and Password
        const { email, password } = req.body;
        // Hash Generation
        const salt = await Bcryptjs.genSaltSync(10);
        const hash = await Bcryptjs.hashSync(password, salt);
        // Check User Avaialble or not
        const findAdmin = await adminRegister.findOne({ email: email });
        if (findAdmin) {
            return console.log("Admin Already Registered")
        }
        else {
            let adminCreate = await adminRegister.create({ ...req.body, ...{ password: hash } })
            return adminCreate;
        }
    }
    catch (e) {
        return console.error(e);
    }
}

// Module Exports

module.exports = { AdminCreateService }