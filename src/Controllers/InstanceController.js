const {Instance}=require('../Models/instance');
const {userRegister}=require('../Models/User');
const {Template}=require('../Models/templates');
const {logs}=require('../Middleware/logs');
const axios = require('axios');

const createInstance=async function(req,res){
	try{
		const user=await userRegister.findOne({_id:req.userId});
        const valid=await checkInstances(req.userId);
        if(valid){
        const templateName=req.body.template?req.body.template:'default';
        const templateId=await Template.findOne({name:templateName});
        let name=req.body.instanceName.replace(/ /g, "_");          
        const oldInst=await Instance.findOne({name:name})
        //console.log(templateName);
        if(oldInst&&oldInst._id){
            res.status(400).send({success:false,message:"Instance with this name already exists."})
        }
		else if(user){
            const apiResponse = await axios.post(process.env.AUTOMATION_URL+'/instance', {
                name:name,
                template:templateName
        });
            console.log(apiResponse);
        // Process the API response (for example, extracting data needed for the application)
        const newInstance = new Instance({
            name: name, // You can replace this with a dynamic name if needed
            user: user._id, // Assuming user is a document with an _id field
            application:req.body.app,
            status: "stopped",
            url:process.env.AUTOMATION_IP+":"+apiResponse.data.data.instancePort,
            dashboardUrl:process.env.AUTOMATION_IP+":"+apiResponse.data.data.instancePort+"/ui",
            //container_id:apiResponse.data.data.containerId,
            //volumeName:apiResponse.data.data.container_volume,
            serviceName:apiResponse.data.data.service,
            wsPort:apiResponse.data.data.wsPort,
            template:templateId,
            mqttPort:process.env.AUTOMATION_IP+":"+apiResponse.data.data.mqttPort
        });
    	await newInstance.save();
        res.json({success:true});
    	logs(user._id,req.body.app,user.username+" created new Instance("+newInstance.name+").");
            
    		}else{
    			res.status(400).send({success:false,message:"Cant Find Requesting user"})
    		}
        }else{
            res.status(400).send({success:false,message:"You can run maximum 2 instances at a time.Please stop or delete previous instance to create new."})
        }

	}catch (error) {
        console.error("Error creating instance:", error);
        res.status(500).send({ success: false, message: "Failed to create instance", error: error.message });
    }

}

const deleteInstance = async function (req, res) {
    try {
        // Find the instance by ID
        const inst = await Instance.findOne({ _id: req.params.id });
        if (!inst) {
            return res.status(404).send("Instance not found");
        }

        // Call the external service to delete the container
        const response = await axios.delete(`${process.env.AUTOMATION_URL}/delete/${inst.name}`);

        // If the response is successful, delete the instance from the database
        const instance = await Instance.findByIdAndDelete(req.params.id);
        if (!instance) {
            return res.status(404).send("No instance found");
        }

        res.status(200).send({ success: true, message: "Instance deleted successfully" });
    } catch (error) {
        console.error("Error deleting instance:", error);
        res.status(500).send({ success: false, message: "Failed to delete instance", error: error.message });
    }
};

const getInstances=async function(req,res){
    if(req.query.appId){
        const instances=await Instance.find({application:req.query.appId});
        res.json({success:true,data:instances})
    }else{
        const instances=await Instance.find({user:req.userId});
        res.json({success:true,data:instances})
    }
}
const getInstance=async function(req,res){
    const instance=await Instance.find({_id:req.params.id}).populate('application');
        res.json({success:true,instance})
    
}
const changeStatus = async function (req, res) {
    try {
        const appstatus = req.body.status ? 'running' : 'stopped';

        if (appstatus === 'running') {
            const valid = await checkInstances(req.userId);

            if (!valid) {
                return res.json({
                    success: false,
                    message: "You already have 2 instances running. Please stop at least one to enable this instance."
                });
            }

            // Valid
            const container = await Instance.findByIdAndUpdate(
                req.params.id,
                { status: appstatus },
                { new: true }
            );

            await axios.get(`${process.env.AUTOMATION_URL}/start-container/${container.name}`);
        } 
        else {
            // STOP instance
            const container = await Instance.findByIdAndUpdate(
                req.params.id,
                { status: appstatus },
                { new: true }
            );

            await axios.get(`${process.env.AUTOMATION_URL}/stop-container/${container.name}`);
        }

        return res.json({ success: true, message: "Status Changed" });

    } catch (error) {
        console.error("Error updating Instance:", error);
        return res.status(500).send({
            success: false,
            message: "Failed to update Instance",
            error: error.message
        });
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

// Module Exports
module.exports = { createInstance ,deleteInstance,getInstances,getInstance,changeStatus};

