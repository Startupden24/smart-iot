const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
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
        enum: ['active', 'stopped'], 
        default: 'active'
    },
    log: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ActivityLog', 
    }],
    instances: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instances'
    }]
});
const Application=mongoose.model('Applications', applicationSchema);
module.exports = {Application}
