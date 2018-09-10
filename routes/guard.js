const router = require('express').Router();
const response = require('./../utils');
const helper = require('./../utils/helper');

const guardController = require('./../controllers/guard');

router.get('/getStaff/guard', (req, res) => {
    guardController.getGuard().then(guard => {
        response.sendDataSuccess(res, "", guard);
    }).catch(err => {
        response.sendDataError(res, err);
    })
})

router.post('/login', (req, res) => {
    guardController.guardLogin(req.body.email, req.body.password).then(guard => {
        response.sendDataSuccess(res, "", guard);
    }).catch(err => {
        response.sendDataError(res, err);
    })
})

router.get('/myProfile', helper.isGuard, (req, res) => {
    guardController.getProfile(req.user_id).then(guardProfile => {
        response.sendDataSuccess(res, "", guardProfile)
    }).catch(err => {
        response.sendDataError(res, err);
    })
})

router.put('/myProfile/edit', helper.getId, (req, res) => {
    guardController.updateProfile(req.user_id, req.body).then(profile => {
        response.sendDataSuccess(res, '', profile);
    }).catch(err => {
        response.sendDataError(res, err);
    })
})

router.put('/changePassword', helper.isGuard, (req, res) => {
    guardController.updatePassword(req.user_id, req.body.oldPassword, req.body.newPassword).then(password => {
        response.sendDataSuccess(res, '', password);
    }).catch(err => {
        response.sendDataError(res, err);
    })
})

router.get('/acceptedRequests',helper.isGuard,(req,res)=>{
    guardController.getAcceptedRequests().then(requests=>{
        response.sendDataSuccess(res, '', requests);
    }).catch(err => {
        response.sendDataError(res, err);
    })
})
module.exports = router;