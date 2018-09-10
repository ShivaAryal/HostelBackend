const router = require('express').Router();
const response = require('./../utils');
const helper = require('./../utils/helper');

const studentController = require('./../controllers/student');
const wardenController = require('./../controllers/warden');

router.post('/registerStaff', helper.isWarden, (req, res) => {
    wardenController.addStaff(req.body).then(staff => {
        response.sendDataSuccess(res, "", staff);
    }).catch(err => {
        response.sendDataError(res, err);
    })
})

router.get('/getStaff/warden', (req, res) => {
    wardenController.getWarden().then(warden => {
        response.sendDataSuccess(res, "", warden);
    }).catch(err => {
        response.sendDataError(res, err);
    })
})

// router.get('/getStaff/guard', (req, res) => {
//     wardenController.getGuard().then(guard => {
//         response.sendDataSuccess(res, "", guard);
//     }).catch(err => {
//         response.sendDataError(res, err);
//     })
// })

router.post('/login', (req, res) => {
    wardenController.wardenLogin(req.body.email, req.body.password).then(warden => {
        response.sendDataSuccess(res, "", warden);
    }).catch(err => {
        response.sendDataError(res, err);
    })
})

router.get('/myProfile', helper.isWarden, (req, res) => {
    wardenController.getProfile(req.user_id).then(wardenProfile => {
        response.sendDataSuccess(res, "", wardenProfile)
    }).catch(err => {
        response.sendDataError(res, err);
    })
})

router.post('/registerStudent', helper.isWarden, (req, res) => {
    studentController.addStudent(req.body).then(student => {
        response.sendDataSuccess(res, "", student);
    }).catch(err => {
        response.sendDataError(res, err);
    })
})

router.get('/newLeaveRequests', helper.isWarden, (req, res) => {
    studentController.getNewLeaveRequests(req.user_id).then(requests => {
        response.sendDataSuccess(res, "", requests)
    }).catch(err => {
        response.sendDataError(res, err);
    })
})

router.get('/approvedLeaveRequests', helper.isWarden, (req, res) => {
    studentController.getApprovedLeaveRequests(req.user_id).then(requests => {
        response.sendDataSuccess(res, "", requests)
    }).catch(err => {
        response.sendDataError(res, err);
    })
})

router.get('/declinedLeaveRequests', helper.isWarden, (req, res) => {
    studentController.getDeclinedLeaveRequests(req.user_id).then(requests => {
        response.sendDataSuccess(res, "", requests)
    }).catch(err => {
        response.sendDataError(res, err);
    })
})

router.put('/grantPermission', helper.isWarden, (req, res) => {
    studentController.grantPermission(req.body.id, req.body.status).then(requests => {
        response.sendDataSuccess(res, "", requests);
    }).catch(err => {
        response.sendDataError(res, err);
    })
})

router.put('/myProfile/edit', helper.getId, (req, res) => {
    wardenController.updateProfile(req.user_id, req.body).then(profile => {
        response.sendDataSuccess(res, '', profile);
    }).catch(err => {
        response.sendDataError(res, err);
    })
})

router.put('/changePassword', helper.isWarden, (req, res) => {
    wardenController.updatePassword(req.user_id, req.body.oldPassword, req.body.newPassword).then(password => {
        response.sendDataSuccess(res, '', password);
    }).catch(err => {
        response.sendDataError(res, err);
    })
})

module.exports = router;