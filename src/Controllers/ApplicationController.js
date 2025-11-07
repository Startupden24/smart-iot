// Package Importing
const {Application}=require('../Models/applications');
const {userRegister}=require('../Models/User');
const {Instance}=require('../Models/instance');
const {logs}=require('../Middleware/logs.js');
const {instances}=require('../Middleware/createApplication')
const axios=require('axios');
// Login Check
const createApplication=async function(req,res){
	try{
		const user=await userRegister.findOne({_id:req.userId});
		//console.log(req.userId);
		if(user){
					let name=req.body.name.trim().replace(/ /g, "_");			
	        const newApp=new Application({
	        	name:name,
	        	user:req.userId,
	        	status: "active",
	            log: [], // Initially empty or you can add default logs
	            instances: []
	        	})
	        await newApp.save();
	        logs(req.userId,newApp._id,user.username+" created new applications("+newApp.name+").");
	        	const instanceName = req.body.instance?req.body.instance:`${newApp.name}_default_instance`;
		        const instanceTemp=req.body.template?req.body.template:'default';
		        instances(user,newApp,instanceName,instanceTemp,function(response){
		        	if(response.error){
		        		res.json({error:"Error in creating instance.",message:response.message,data:newApp})
		        	}else{
		        		res.json({ data: newApp, success: "Application Created Successfully" });
		        	}
		        })
	        }

	}catch (error) {
        console.error("Error creating Application:", error);
        res.status(500).send({ success: false, message: "Application with this name already exists.", error: error.message });
    }
}

const getApplications=async function(req,res){
	//console.log(req.query);
	if(req.query.all){
		const apps = await Application.find({
			user: { $ne: req.userId }  // $ne = "not equal"
			});
		return res.json({success:true,data:apps})
	}else{
	const apps=await Application.find({user:req.userId}).where({status:'active'});
	res.json({success:true,data:apps})
	}
}

const changeStatus=async function(req,res){
	try{
	const appstatus=req.body.status?'active':'stopped'
	await Application.findByIdAndUpdate(req.params.id, {status:appstatus});
    //await Application.save();
    const status=req.body.status?'running':'stopped'
    await Instance.updateMany(
            { application: req.params.id },
            { status: status }
        );
    /*const conatinerStatus=req.body.status?1:2;
    const apiResponse = await axios.post(process.env.AUTOMATION_URL+'/',
     	{  status :conatinerStatus        
        });*/
    res.json({success:true,message:"Status Changed"});
}catch(error){
	 console.error("Error updating Application:", error);
        res.status(500).send({ success: false, message: "Failed to update Application", error: error.message });
}
}

const editApplication=async function(req,res){
	try{
		await Application.findByIdAndUpdate(req.params.id, req.body);
		res.status(200).send({ success: true });


	}catch(error){
		console.error("Error updating Application:", error);
        res.status(500).send({ success: false, message: "Failed to update Application", error: error.message });

	}
}

const delApplication=async function(req,res){
	try {
    const appId = req.params.id;
    const application = await Application.findById(appId);

    if (!application) {
      return res.status(404).send({ success: false, message: "Application not found" });
    }

    // Delete all instances associated with the application
    await Instance.deleteMany({ application:appId });

    // Delete the application itself
    await Application.findByIdAndDelete(appId);

    res.status(200).send({ success: true, message: "Application and all associated instances deleted successfully" });
  } catch (error) {
    console.error("Error deleting application and instances:", error);
    res.status(500).send({ success: false, message: "Failed to delete application and instances", error: error.message });
  }
}

// Module Exports
module.exports = { createApplication,getApplications,changeStatus ,editApplication,delApplication};

