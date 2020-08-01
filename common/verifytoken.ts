const mongo = require('mongoose');
const LoginSchema = require('../models/login');
const jwt = require('jsonwebtoken');
const fs = require("fs");

export function verifytoken(req, res, next) {
    const bearerHeader = req.headers.authorization;
    
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.body.token = bearerToken;
        next();
    } else {
        res.status(403).json({message: 'Invalid token'});
    }
}

export function getUserId(req, res, next) {
    
    jwt.verify(req.body.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            // console.log('authData', authData)
            // console.log('authData._id ', authData.result._id)
            LoginSchema.findOne({_id: authData.result._id}).exec().then(ret => {
                if (ret._id) {
                    req.body.userId = ret._id; 
                    next()
                }
            }).catch(err => {
                res.sendStatus(403).json({
                    success: false,
                    message: 'User is not available'
                })  
            })
        }
    })
}

export function decodeBase64Image(dataString) {
    const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response['type'] = matches[1];
    response['data'] = Buffer.from(matches[2], 'base64');

    return response;
}

export function uploadImage(file, res, req) {
    const imageBuffer: any = decodeBase64Image(file);
    if (imageBuffer) {
        const fileName = 'upload/' + Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 100) + 1 + '.' + req.body.ext;
        fs.writeFile(fileName, imageBuffer.data, async (err: any) => {
            if (err) {
                res.status(400).json({
                    success: false,
                    message: 'Imvalid file'
                })
                return false;
            }
        });
        return fileName;
    }
    return false;
}
