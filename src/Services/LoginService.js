// Package Importing
const { userRegister } = require("../Models/User");
const Bcryptjs = require("bcryptjs")

// Login Check
const userLogin = async (req) => {
    try {
        const { email, password } = req.body;
        const findData = await userRegister.findOne({
            $or: [{ email: email }, { username: email }]
        });
        if (findData) {
            const findPassword = await Bcryptjs.compare(password, findData.password);
            if(findPassword){
                return findData
            }else{
                return false;
            }
        }
        else {
            return false;//res.status(400).json({message:"Invalid credentials"})
        }
    }
    catch (e) {
        return false;//res.status(500).json({message:"something went wrong",error:e})
    }
}

// Get User Details : Auth Verfy Function (Through Auth function)

const get_user_details = async (req) => {
    // From auth to get userid in req col
    const { userId } = req;
    let find_id = await userRegister.findById(userId);
    if (!find_id) {
        return null
    }
    else {
        // send specify data in frontend to view in this obj variable
        
        return find_id;
    }
}


// Exports

module.exports = { userLogin, get_user_details}