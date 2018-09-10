const router = require('express').Router();
const response = require('./../utils');
const helper = require('./../utils/helper');
const studentController = require('./../controllers/student');
const multer  = require('multer');
const upload = multer({ dest: './../images/' });

router.get('/myProfile',helper.getId,(req,res)=>{
    studentController.getProfile(req.user_id).then(studentProfile=>{
        response.sendDataSuccess(res,"",studentProfile)
    }).catch(err=>{
        response.sendDataError(res, err);
    })
})

router.get('/myRequest',helper.getId,(req,res)=>{
    studentController.getMyRequest(req.user_id).then(request=>{
        response.sendDataSuccess(res,"",request)
    }).catch(err=>{
        response.sendDataError(res, err);
    })
})

router.post('/login',(req, res)=>{
    studentController.studentLogin(req.body.email,req.body.password).then(student=>{
        response.sendDataSuccess(res,"",student)
    }).catch(err =>{
        response.sendDataError(res, err);
        })
})

router.put('/myProfile/edit', helper.getId, upload.single('fileData'),(req, res)=>{
    studentController.updateProfile(req.user_id,req.body).then(profile=>{
        response.sendDataSuccess(res,'',profile);
    }).catch(err=>{
        response.sendDataError(res, err);
    })
})

router.post('/leaveRequest',helper.getId,(req, res)=>{
    req.body['studentName']=req.user_id;
    studentController.getLeave(req.body).then(request=>{
        response.sendDataSuccess(res,"",request)
    }).catch(err=>{
        response.sendDataError(res, err);
    })
})

router.put('/changePassword',(req,res)=>{
    studentController.updatePassword(req.user_id,req.body.oldPassword,req.body.newPassword).then(password=>{
        response.sendDataSuccess(res,'',password);
    }).catch(err=>{
        response.sendDataError(res, err);
    })
})

module.exports=router;
