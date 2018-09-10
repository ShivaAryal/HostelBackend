const Student = require('./../models/student');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs')
const secret = 'shiva'
const nodeMailer = require('nodemailer');

const LeaveRequest = require('./../models/leaveRequest');

const addStudent = (student) => new Promise((resolve, reject)=>{
    let studentData = new Student(student);
    studentData.save((err,mystudent)=>{
        let transporter = nodeMailer.createTransport({
            service:'gmail',
            auth:{
                user:'hostelappinfo@gmail.com',
                pass:'randompassword'
            }
        });
    
        let mailOptions ={
            from : 'hostelappinfo@gmail.com',
            to : student.email,
            subject:'Your Password for Hostel app is',
            text:student.password 
        };
    
        transporter.sendMail(mailOptions,(err,info)=>{
            if(err){
                reject(err);
            }else{
                resolve("Email sent:"+info.response);
            }
        })
        err && reject(err) || resolve(mystudent);
    })
})

const studentLogin = (email, password) => new Promise((resolve, reject)=>{

    Student.findOne({email:email},(err,student)=>{
        if(err) reject(err);
        if(student){
            var passwordIsValid = bcrypt.compareSync(password,student.password);
            if(!passwordIsValid){
                reject("Email/Password doesn't match")
            }else{
                var token=jwt.sign({id:student._id},secret);
                let studentObj = {
                    token,
                    name:student.name
                }
                resolve(studentObj);
            }
        }else{
           reject("Student not found"); 
        }
    })
})

const getProfile = (id) => new Promise((resolve, reject)=>{
    Student.findOne({_id:id},(err, studentProfile)=>{
        err && reject(err) || resolve(studentProfile);
    })
})

const updateProfile =(id,update) => new Promise((resolve, reject)=>{
    Student.findOne({_id:id},(err,studentProfile)=>{
        if(err) reject(err);
        studentProfile.image = update.image;
        studentProfile.phone_no= update.phone_no;
        studentProfile.roll_no=update.roll_no;
        studentProfile.address=update.address;
        studentProfile.guardian_name=update.guardian_name;
        studentProfile.guardian_contact=update.guardian_contact;
        studentProfile.lg_name=update.lg_name;
        studentProfile.lg_contact=update.lg_contact;
        studentProfile.lg_address=update.lg_address;
        studentProfile.save((err,myStudentProfile)=>{
            err && reject(err) || resolve(myStudentProfile);
        })
    })
})

const getLeave = (request) => new Promise((resolve, reject)=>{
    let requestData = new LeaveRequest(request);
    requestData.save((err,request)=>{
        err && reject(err) || resolve(request);
    })
})

const getNewLeaveRequests =(id)=> new Promise((resolve, reject)=>{
    LeaveRequest.find({warden:id,'status':''},(err,request)=>{
        err && reject(err) || resolve(request);
    })
})

const getApprovedLeaveRequests = (id) => new Promise((resolve, reject)=>{
    LeaveRequest.find({warden:id,'status':'Yes'},(err, requests)=>{
        let requestArr=[]
        requests.map(request=>(
            requestArr.push({'name':request.name,'dateofLeaving':request.dateofLeaving})
        ))
        err && reject(err) || resolve(requestArr);
    })
})

const getDeclinedLeaveRequests = (id) => new Promise((resolve, reject)=>{
    LeaveRequest.find({warden:id,status:'No'},(err, requests)=>{
        let requestArr=[]
        requests.map(request=>(
            requestArr.push({'name':request.name,'dateofLeaving':request.dateofLeaving})
        ))
        err && reject(err) || resolve(requestArr);
    })
})

const getMyRequest = (id) => new Promise((resolve,reject)=>{
    LeaveRequest.find({'studentName':id},(err, requests)=>{
        let request = requests[requests.length-1]
        err && reject(err) || resolve(request);
    })
})

const grantPermission = (id,status)=> new Promise((resolve, reject)=>{
    LeaveRequest.findOne({_id:id},(err, request)=>{
        request.status = status;
        request.save((err, myRequest)=>{
            err && reject(err) || resolve(myRequest)
        })
    })
})

const changePassword = (id,oldPassword,newPassword) => new Promise((resolve,reject)=>{
    Student.findOne({_id:id},(err,student)=>{
        if(err) reject(err);
        if(student){
            oldPasswordisValid=bcrypt.compareSync(oldPassword,student.password)
            if(!oldPasswordisValid){
                reject("Old password doesn't match")
            }else{
                student.password=newPassword;
                student.save((err,mystudent)=>{
                    err && reject(err) || resolve(mystudent);
                })
            }
        }
    })
})

module.exports={
    getLeave,studentLogin,addStudent,updateProfile,getMyRequest,getProfile,getNewLeaveRequests,grantPermission,changePassword,getApprovedLeaveRequests,getDeclinedLeaveRequests
}