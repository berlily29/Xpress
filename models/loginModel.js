const mongoose = require('mongoose');
    
const logSchema = new mongoose.Schema({
    Phone: {
        type: String,
        required: true
    },
    Logs: {
        Login: {
            type: Date,
            default: () => Date.now()
        },
    }
})
const loginModel = new mongoose.model("loginlog",logSchema);
module.exports = loginModel;