const path = require("path");
const axios = require('axios');
const { userRegister } = require('../Models/User');
const {Application} = require('../Models/applications');
const {Instance} =require('../Models/instance');
const {logs}=require('./logs.js');
const {Template}=require('../Models/templates');

const applications = async (user,next) => {
//create application of specific user.
	try {
		const username = user.username; // Assuming user has a username field
        const userIdLast4 = user._id.toString().slice(-4); // Convert ObjectId to string and get last 4 digits
        const applicationName = `${username}_${userIdLast4}_default_application`;
        // Create a new application for the specific user
        const newApplication = new Application({
            name: applicationName, // You can replace this with a dynamic name if needed
            user: user._id, // Assuming user is a document with an _id field
            status: "active",
            log: [], // Initially empty or you can add default logs
            instances: [] // Initially empty or you can add default instances
        });
        
        // Save the application to the database
        const savedApplication = await newApplication.save();
        logs(user._id,newApplication._id,user.username+" created new applications("+newApplication.name+").");
        const instanceName = `${username}_${userIdLast4}_default_instance`;
        instances(user,newApplication,instanceName,'default',function(response){
        	next({ data: savedApplication, success: "Application Created Successfully" });
        })
        
    } catch (error) {
        console.error("Error creating application:", error);
        next({ error: "Failed to create application" });
    }

}
const instances = async (user, app, instanceName, template, next) => {
    try {
        const valid=await checkInstances(user._id);
        if(valid){
            // Set templateId to provided template or default
            const templateName = template ? template : "default";
            if (!templateName) {
                throw new Error("Template with this name is missing");
            }

            // Find template by ID
            let templateId;
            try {
                templateId = await Template.findOne({ name:templateName});
                if (!templateId) {
                    throw new Error("Template not found");
                }
            } catch (err) {
                console.error("Error finding template:", err);
                return next({ error: "Failed to find template" });
            }
            const oldIns=await Instance.findOne({name:instanceName});
            //console.log(oldIns);
            if(oldIns&&oldIns._id){
                return next({ error: "Instance with this name Already exists" });
            }
            

            // Make API call to create instance
            let apiResponse;
            try {
                apiResponse = await axios.post(`${process.env.AUTOMATION_URL}/instance`, {
                    name: instanceName,
                    template: templateName || 'default'
                });
            } catch (err) {
                console.error("Error making API request to automation service:", err);
                return next({ error: "Failed to create instance via API" });
            }

            // Check if the API response is valid
            const instanceData = apiResponse?.data?.data;
            if (!instanceData || !instanceData.instancePort) {
                console.error("Invalid API response:", apiResponse.data);
                return next({ error: "Invalid response from automation service" });
            }

            // Create new instance in DB
            try {
                const newInstance = new Instance({
                    name: instanceName,
                    user: user._id,
                    application: app._id,
                    status: "stopped",
                    url: `${process.env.AUTOMATION_IP}:${instanceData.instancePort}`,
                    dashboardUrl: `${process.env.AUTOMATION_IP}:${instanceData.instancePort}/ui`,
                    serviceName: instanceData.service,
                    wsPort: instanceData.wsPort,
                    mqttPort: `${process.env.AUTOMATION_IP}:${instanceData.mqttPort}`,
                    template: templateId
                });
                await newInstance.save();
            } catch (err) {
                console.error("Error saving instance to DB:", err);
                return next({ error: "Failed to save instance to database" });
            }

        // Return success
            return next(true);
        }else{
            return next({success:false,error:true,message:"You can run maximum 2 instances at a time.Please stop or delete previous instance to create new."})
        }
    } catch (err) {
        console.error("Unexpected error creating instance:", err);
        return next({ error: "An unexpected error occurred" });
    }
};
const checkInstances=async function(id){
    const count = await Instance.countDocuments({
      user: id,    // Match the user ID
      status: 'running'  // Match the status 'running'
    });
    if(count>=2){
        return false;
    }else{
        return true;
    }
}



module.exports = { applications,instances }


