// Package Importing
const express = require("express");
const router = express.Router();

// User 
const Controller = require("../Controllers/RegisterController")
const ControllerLogin = require("../Controllers/LoginController")
const Auth = require ("../Middleware/Auth")

// Admin
const AdminController = require("../Admin/AdminController")
const AdminLoginController = require ("../Admin/AdminLoginController")
const AdminAuth = require ("../Middleware/AdminAuth")

// View all Profile
const ViewAllProfile = require ("../Admin/ViewAllUserProfile")

// View only Public Profile
const PublicProfile = require ("../Controllers/ProfileController")

// Image Uploading 
const FileUpload = require ("../Middleware/FileUploading");

// Edit Profile
const UserEditProfile = require("../Controllers/EditProfileController")

// Logout
const Logout = require ("../Services/Logout")

//applications controller
const Applications=require('../Controllers/ApplicationController');
//instance controller
const Instances=require('../Controllers/InstanceController');
///template controller
const Templates=require('../Controllers/TemplatesController');

// API
// User Register
router.route("/register").post(Controller.userRegister)
//register client
router.route('/client').post(Controller.addClient)

// User Login 
router.route("/login").post(ControllerLogin.userLoginCheck)

// Verify Auth Token : User
router.route("/loginverify").post(Auth.login_token_verify,ControllerLogin.login_verify_token)

// User View all the Details
router.route("/getprofile").get(Auth.login_token_verify,Controller.singleUser)

// Admin Register
router.route("/adminregister").post(AdminController.adminRegister)

// Admin Login 
router.route("/adminlogincreate").post(AdminLoginController.adminLoginCheck)

// Verify Auth Token : Admin
// router.route("/adminloginverify").post(AdminAuth.login_token_verify,AdminLoginController.login_verify_token)

// View all the User Profile for Admin
router.route("/viewallprofile").get(AdminAuth.login_token_verify,AdminAuth.isAdmin,ViewAllProfile.get_all_user_profile)

// User : To view only Public User
router.route("/viewpublicprofile").get(PublicProfile.view_public_user)

// Image Uploading
router.route("/imageupload").post(FileUpload.upload.single("images"),Controller.ImageUploading)

// Edit Profile Data
router.route("/editprofile").put(Auth.login_token_verify,UserEditProfile.editUserData)

// Logout
router.route("/logout").post(Logout.logout)



/////application routes
router.route('/application')
	.post(Auth.login_token_verify,Applications.createApplication)
	.get(Auth.login_token_verify,Applications.getApplications);
router.route('/application/status/:id').put(Auth.login_token_verify,Applications.changeStatus);
router.route('/application/:id')
	.put(Auth.login_token_verify,Applications.editApplication)
	.delete(Auth.login_token_verify,Applications.delApplication);

/////instance routes
router.route('/instance')
	.post(Auth.login_token_verify,Instances.createInstance)
	.get(Auth.login_token_verify,Instances.getInstances);
	
router.route('/instance/:id')
		.get(Auth.login_token_verify,Instances.getInstance)
		.delete(Auth.login_token_verify,Instances.deleteInstance);

router.route('/instance/status/:id').put(Auth.login_token_verify,Instances.changeStatus);


/**********node-red templates*******/
router.route('/templates')
	.get(Templates.getTemplates);

	/**********user managment apis*******/
router.route('/users')
	.get(Auth.isAdmin,ControllerLogin.getUsers);
router.route('/users/:id')
	.get(Auth.login_token_verify,ControllerLogin.getUser)
	.put(Auth.login_token_verify,ControllerLogin.editUser);


	


// Router Exports
module.exports = { router }