// Package Importing
const LoginService = require("../Services/LoginService");
const Auth = require("../Middleware/Auth");
const { userRegister } = require("../Models/User");
const Bcryptjs = require("bcryptjs");
const {Application}=require('../Models/applications');
// Login Check
const userLoginCheck = async (req, res) => {

    // login data
    let login = await LoginService.userLogin(req);
    //console.log(login);
    // Token Generate
    let token = await Auth.login_token(login)
    // if login true
    if (login) {
        res.send({ tokenname: token, Name: login.name,user:login, success: "Login Successfully" })
    }
    else {
        res.status(400).send({ message: "Invalid Credentials" })
    }

}

// Login Verify after token genearate through (get_user_details service)

const login_verify_token = async (req, res) => {
    let data = await LoginService.get_user_details(req);
    res.send(data)
}
//get all users

const getUsers = async (req, res) => {
  try {
    const users = await userRegister.find();

    // For each user, get their applications
    const usersWithApps = await Promise.all(
      users.map(async (user) => {
        const apps = await Application.find({ user: user._id });

        return {
          ...user._doc,   // convert mongoose object to js object
          applications: apps
        };
      })
    );

    res.json({ success: true, users: usersWithApps });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//get one users
const getUser=async (req,res)=>{
    let user =await userRegister.findOne({_id:req.params.id});
    res.json(user)
}
//update user profile
const editUser=async (req,res)=>{
    //update user profile
    const { name, email, password, currentPassword } = req.body;
    const user = await userRegister.findOne({_id:req.params.id});
    try{
        if (currentPassword) {
            const findPassword = await Bcryptjs.compare(currentPassword, user.password);
            if(findPassword){
                const salt = await Bcryptjs.genSaltSync(10);
                const hash = await Bcryptjs.hashSync(password, salt);
                user.password=hash;
                user.fullName=name;
                await user.save();
                return res.json({ message: 'User profile updated successfully' });
            }else{
                return res.json({ status:false,message: 'Incorrect current password' });
            }
        }
        if (name) user.fullName = name;
        await user.save();
        return res.json({ message: 'User profile updated successfully' });
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Module Exports
module.exports = { userLoginCheck, login_verify_token,getUsers,getUser,editUser };

