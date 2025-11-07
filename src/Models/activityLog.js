const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    log:{
        type:String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    application:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Applications'
    },
    description:{
        type:String
    }
});
const activityLog=mongoose.model('ActivityLogs', logSchema);
module.exports = {activityLog}