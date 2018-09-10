const jwt = require('jsonwebtoken');
const secret = 'shiva'

const transformError =(obj) =>{
    let errors = [];
    if(typeof(obj)==='object'){
        for(key in obj.errors){
            let message = obj.errors[key]['message'];
            errors.push(message);
        }
        return(errors)
    }else{
        return obj;
    }
}

const authenticated = (req, res) => new Promise((resolve, reject) => {
    console.log("headers",req.headers.authorization)
    if(req.headers.authorization) {
        let token = req.headers.authorization;
        jwt.verify(token, secret, (err, decoded) => {
            if(err) {
                res.send({"status": "failed", "message": "Invalid error"});

            } else {
                req.user_id = decoded.id;
                req.userType = decoded.userType
                //console.log("Decoded",decoded)
                resolve(decoded.userType);
            }
        })
    } else {
        res.send({"status": "failed", "message": "Not Authorized"});
    }
}) 

const getId = (req,res, next) => new Promise((resolve, reject)=>{
    if(req.headers.authorization){
        let token = req.headers.authorization;
        //console.log(token);
        jwt.verify(token,secret,(err, decoded)=>{
            if(err){
                res.send({"status":"failed","message":"Invalid"})
            }else{
                req.user_id=decoded.id;
                //console.log(decoded.id);
                //resolve(decoded.id);
                next();
            }
        })
    }else{
        res.send({"status":"failed","message":"Unknown"})
    }
})

// const isAdmin = (req, res, next) => {
//     authenticated(req, res).then(type => {
//         console.log("User type: ", type)
//         if(type === 1 ){
//             next();
//         } else {
//             res.send({"status": "failed", "message": "Not Authorized"});
//         }
//     })
// }

const isWarden = (req, res, next)=>{
    authenticated(req, res).then(type=>{
        if(type == 1){
            console.log("Authorized Warden")
            next();
        }else{
            res.send({"status":"failed","message":"Not authorized"})
        }
    })
}

const isGuard = (req, res, next)=>{
    authenticated(req, res).then(type=>{
        if(type == 2){
            console.log("Authorized Guard")
            next();
        }else{
            res.send({"status":"failed","message":"Not authorized"})
        }
    })
}

module.exports = {
    transformError, isWarden, getId, isGuard
}