const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs')
const secret = 'shiva'
const Staff = require('./../models/staff');
const nodeMailer = require('nodemailer');

const addStaff = (staff) => new Promise((resolve, reject)=>{
    let staffData = new Staff(staff);
    
    let transporter = nodeMailer.createTransport({
        service:'gmail',
        auth:{
            user:staff.myemail,
            pass:staff.mypassword
        }
    });

    let mailOptions ={
        from : staff.myemail,
        to : staff.email,
        subject:'Your Password for Hostel app is',
        text:staff.password 
    };

    transporter.sendMail(mailOptions,(err,info)=>{
        if(err){
            reject(err);
        }else{
            resolve("Email sent:"+info.response);
        }
    })
    staffData.save((err,mystaff)=>{
        err && reject(err) || resolve(mystaff);
    })
})

const getWarden =()=> new Promise((resolve, reject)=>{
    Staff.find({'userType':1}, (err,data)=>{
        err && reject(err) || resolve(data);
    })
})

// const getGuard =()=> new Promise((resolve, reject)=>{
//     Staff.find({'userType':2},(err, data)=>{
//         err && reject(err) || resolve(data);
//     })
// })

const wardenLogin = (email,password) => new Promise((resolve, reject)=>{
    Staff.findOne({userType:1,email: email},(err, warden)=>{
        if(err) reject(err);
        if(warden){
            var passwordIsValid = bcrypt.compareSync(password, warden.password)
            if(!passwordIsValid){
                reject("Email/Password doesn't matched");
            }else{
                token = jwt.sign({id:warden._id,userType:warden.userType},secret);
                let wardenObj = {
                    token,
                    name:warden.name
                }
                resolve(wardenObj);
            }
        }else{
            reject("Staff not found");
        }
    })
})

const getProfile = (id) => new Promise((resolve, reject)=>{
    Staff.findOne({userType:1,_id:id},(err, wardenProfile)=>{
        err && reject(err) || resolve(wardenProfile);
    })
})

const updateProfile =(id,update) => new Promise((resolve, reject)=>{
    Staff.findOne({userType:1,_id:id},(err,wardenProfile)=>{
        if(err) reject(err);
        wardenProfile.name= update.name;
        wardenProfile.email=update.email;
        wardenProfile.address=update.address;
        wardenProfile.phone_no=update.phone_no;
        wardenProfile.save((err,wardenProfile)=>{
            err && reject(err) || resolve(wardenProfile);
        })
    })
})

const updatePassword=(id,oldPassword,newPassword)=>new Promise((resolve,reject)=>{
    Staff.findOne({userType:1,_id:id},(err,warden)=>{
        if(err) reject(err);
        if(warden){
            oldPasswordisValid=bcrypt.compareSync(oldPassword,warden.password)
            if(!oldPasswordisValid){
                reject("Old password doesn't match")
            }else{
                warden.password=newPassword;
                warden.save((err,mywarden)=>{
                    err && reject(err) || resolve(mywarden);
                })
            }
        }
    })
})

module.exports={
    wardenLogin,addStaff,getWarden,updateProfile,getProfile,updatePassword
}