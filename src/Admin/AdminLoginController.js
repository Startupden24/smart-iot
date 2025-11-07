// Package Importing
const AdminService = require("./AdminLoginService");
const Auth = require("../Middleware/AdminAuth")

// Login Check
const adminLoginCheck = async (req, res) => {
    // login data
    let login = await AdminService.adminLogin(req);
    // Token Generate
    let token = await Auth.login_token(login)
    // if login true
    if (login) {
        res.send({ tokenname: token, Name: login.name, success: "Admin Login Successfully" })
    }
    else {
        res.status(400).send({ failed: "Invalid Admin Credentials" })
    }

}

// Login Verify after token genearate through (get_user_details service)

const login_verify_token = async (req, res) => {
    let data = await AdminService.get_admin_details(req);
    res.send(data)
}

// Module Exports
module.exports = { adminLoginCheck, login_verify_token };

