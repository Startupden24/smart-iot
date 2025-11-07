
const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique:true,
    default:'default'
    }
});

const Template=mongoose.model('templates', templateSchema);
module.exports = {Template}
