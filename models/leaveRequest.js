const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const Student = require('./student');
const Staff = require('./staff');

let requestSchema = new Schema({
    studentName:{type:Schema.ObjectId,ref :'Student'},
    name:{type:String,required:[true]},
    warden:{type:Schema.ObjectId, ref :"Staff"},
    dateofLeaving:{type:Date},
    dateofArrival:{type:Date},
    requestAddress:{type:String},
    requestContact:{
        type: String,validate: {
            validator: function(v) {
                return /\d{10}/.test(v);
            },
            message: '{VALUE} is not a valid phone number!'
        },
        required: [true, 'Request phone number is required']
    },
    status:{type:String}
})

let LeaveRequest = mongoose.model('LeaveRequest',requestSchema);
module.exports=LeaveRequest;