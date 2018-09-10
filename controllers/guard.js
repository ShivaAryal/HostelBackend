const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs')
const secret = 'shiva'
const Staff = require('./../models/staff');
const nodeMailer = require('nodemailer');
const LeaveRequest = require('./../models/leaveRequest')

const getGuard =()=> new Promise((resolve, reject)=>{
    Staff.find({'userType':2}, (err,data)=>{
        err && reject(err) || resolve(data);
    })
})

const guardLogin = (email,password) => new Promise((resolve, reject)=>{
    Staff.findOne({userType:2,email: email},(err, guard)=>{
        if(err) reject(err);
        if(guard){
            var passwordIsValid = bcrypt.compareSync(password, guard.password)
            if(!passwordIsValid){
                reject("Email/Password doesn't matched");
            }else{
                token = jwt.sign({id:guard._id,userType:guard.userType},secret);
                let guardObj = {
                    token,
                    name:guard.name
                }
                resolve(guardObj);
            }
        }else{
            reject("Staff not found");
        }
    })
})

const getProfile = (id) => new Promise((resolve, reject)=>{
    Staff.findOne({userType:2,_id:id},(err, guardProfile)=>{
        err && reject(err) || resolve(guardProfile);
    })
})

const getAcceptedRequests = () => new Promise((resolve, reject)=>{
    LeaveRequest.find({status:'Yes'},(err,requests)=>{
        err && reject(err) || resolve(requests);
    })
})

const updateProfile =(id,update) => new Promise((resolve, reject)=>{
    Staff.findOne({userType:2,_id:id},(err,guardProfile)=>{
        if(err) reject(err);
        guardProfile.name= update.name;
        guardProfile.email=update.email;
        guardProfile.address=update.address;
        guardProfile.phone_no=update.phone_no;
        guardProfile.save((err,guardProfile)=>{
            err && reject(err) || resolve(guardProfile);
        })
    })
})

const updatePassword=(id,oldPassword,newPassword)=>new Promise((resolve,reject)=>{
    Staff.findOne({userType:2,_id:id},(err,guard)=>{
        if(err) reject(err);
        if(guard){
            oldPasswordisValid=bcrypt.compareSync(oldPassword,guard.password)
            if(!oldPasswordisValid){
                reject("Old password doesn't match")
            }else{
                guard.password=newPassword;
                guard.save((err,myguard)=>{
                    err && reject(err) || resolve(myguard);
                })
            }
        }
    })
})

module.exports={
    guardLogin,getGuard,updateProfile,getProfile,updatePassword,getAcceptedRequests
}