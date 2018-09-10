const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const Staff = require('./staff');
const LeaveRequest = require('./leaveRequest');

let courseSchema = new Schema({
    name:{type:String, maxlength:[100,"Course name must be less than 100 chracters"]}
})

let roomSchema = new Schema({
    name:{type:String, required:[true,"Room name is required"],maxlength:[100,"Room name must be less than 100 characters"]},
    building:{type:String, required:[true,"Building name is required"],maxlength:[100,"Building name must be less than 100 characters"]},
    floor:{type:Number,required:[true,"Floor name is required"],max:[2,"floor name must be less than 2 digits"]}
})

let studentSchema = new Schema({
    name: {type:String, required: [true, "Name is required"],min: [8, "Name must be more than 8 letters"], max: [100, "Name must be less than 100 letters"]},
    email: {type:String, required: [true, "Email is required"],validate:{
        validator: function(v){
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(v).toLowerCase());
        },
        message: "{VALUE} is not a valid email id!"
    }},
    password: {type: String, required: [true, "Password is required"],minlength: [5, "Password should have more than 5 characters"],maxlength: [200, "Password should have less than 200 characters"]},
    phone_no: {
        type: String,validate: {
            validator: function(v) {
                return /\d{10}/.test(v);
            },
            message: '{VALUE} is not a valid phone number!'
        },
        required: [true, 'phone number is required']
    },
    roll_no: {type:String, required: [true, "Roll no is required"], maxlength:[10, "Roll no should have less than 10 characters"]},
    room_no:{types:Schema.ObjectId,ref:roomSchema},
    address: {type:String, required: [true, "Address is required"]},
    course:{types:Schema.ObjectId,ref:courseSchema},
    //requests:{types:Schema.ObjectId,ref:'LeaveRequest'},
    year: {type:String, required: [true, "Year is required"],maxlength:[100,"Year should have less than 100 characters"]},
    guardian_name:{type:String, required:[true, "Guardian name is required"],maxlength:[100,"Name should have less than 100 characters"]},
    guardian_contact:{
        type:String,validate:{
            validator: function(v){
                return /\d{10}/.test(v);
            },
            message: '{VALUE} is not a valid phone number'
        },
        required:[true, 'Guardian Phone number is required']
    },
    lg_name:{type:String,required:[true,"Local Guardian name is required"],maxlength:[100,"Name should have less than 100 characters"]},
    lg_contact:{
        type:String,validate:{
            validator: function(v){
                return /\d{10}/.test(v);
            },
            message: '{VALUE} is not a valid phone number'
        },
        required:[true, 'Local Guardian Phone number is required']
    },
    lg_address:{type:String,required:[true,"Local guardian address is required"]},
    image:{type:String}

})

studentSchema.pre('save', function(next){
    console.log("Pre save")
    if(this.isModified('password')){
        console.log("Password Modified");
        this.password = bcrypt.hashSync(this.password);
    }
    next();
})

let Student = mongoose.model('Student', studentSchema)
let Room = mongoose.model('Room',roomSchema)
let Course = mongoose.model('Course',courseSchema)
module.exports = Student;