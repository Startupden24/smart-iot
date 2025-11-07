const {Template}=require('../Models/templates');

const getTemplates=async function(req,res){
    const temps=await Template.find();
    res.json({success:true,temps})
}

// Module Exports
module.exports = { getTemplates};

