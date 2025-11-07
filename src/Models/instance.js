
const mongoose = require('mongoose');

const instanceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique:true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    status: {
        type: String,
        enum: ['running', 'stopped'],
        default: 'running'
    },
    log: {
        type:String//path of log file
    },
    application: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Applications'
    },
    url:{
        type:String
    },
    deployed:{
        type:Boolean,
        default:false
    },
    dashboardUrl:{
        type:String
    },
    container_id:{
        type:String
    },
    volumeName:{
        type:String
    },
    mqttPort:{
        type:String
    },
    wsPort:{
        type:String
    },
    serviceName:{
        type:String
    },
    template:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'templates'
    }
});

const Instance=mongoose.model('Instances', instanceSchema);
module.exports = {Instance}
