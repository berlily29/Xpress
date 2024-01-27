const mongoose = require('mongoose');
    
const logSchema = new mongoose.Schema({
    Phone: {
        type: String,
        required: true
    },
    Logs: {
        Transact: {
            Details : {
                Amount: Number,
                Mode: String,
                Message: String,
                
            },
            Timestamp: {
                type:Date,
                default: () => Date.now()
            }
        }
    }
})
const transactModel = new mongoose.model("transactionlog",logSchema);
module.exports = transactModel;