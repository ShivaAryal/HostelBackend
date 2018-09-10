const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
let staffSchema = new Schema({
    name: {type:String, required: [true, "Name is required"],min: [8, "Name must be more than 8 letters"], max: [100, "Name must be less than 100 letters"]},
    email: {type:String, required: [true, "Email is required"]},
    password: {type: String, required: [true, "Password is required"],minlength: [5, "Password should have more than 5 characters"],maxlength: [200, "Password should have less than 200 characters"]},
    phone_no: {
        type: String,validate: {
            validator: function(v) {
                return /\d{10}/.test(v);
            },
            message: '{VALUE} is not a valid phone number!'
        },
        required: [true, 'Phone number is required']
    },
    address: {type:String, required: [true, "Address is required"]},
    userType: { type: Number, default: 2}  //1 - warden and 2 - guard
})

staffSchema.pre('save',function(next){
    if(this.isModified("password")){
        this.password=bcrypt.hashSync(this.password)
    }
    next();
})

let Staff = mongoose.model('Staff', staffSchema)
module.exports = Staff;