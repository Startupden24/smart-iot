// Package Importing
const { adminRegister } = require("./RegisterAdmin");
const Bcryptjs = require("bcryptjs")

// Login Check
const adminLogin = async (req) => {
    try {
        // Get Email and Password
        const { email, password } = req.body;
        // Check Email correct or not
        const findData = await adminRegister.findOne({ email: email });
        // Compre Password
        const findPassword = await Bcryptjs.compare(password, findData.password);
        if (findData && findPassword != null) {
            return findData
        }
        else {
            return error("Incorrect Admin Credentials")
        }
    }
    catch (e) {
        return console.error(e)
    }

}

// Get Admin Details : Auth Verfy Fnction (Through Auth function)

const get_admin_details = async (req) => {
    // From auth to get userid in req col
    const { userId } = req;
    let find_id = await adminRegister.findById(userId);
    if (!find_id) {
        return null
    }
    else {
        // send specify data in frontend to view in this obj variable
        let obj = {
            name: find_id.name,
            mail: find_id.email
        }
        return obj
    }
}


// Exports

module.exports = { adminLogin, get_admin_details}