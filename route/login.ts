import * as express from 'express';
const router = express.Router();
const LoginSchema = require('../models/login');
const jwt = require('jsonwebtoken');
const md5 = require('md5');

router.post('/', (req, res, next) => {
    LoginSchema.findOne({email: req.body.email, password: md5(req.body.password)}).exec().then(result => {
        if (result === null) {
            res.status(400).json({
                success: false,
                message: 'Invalid user email and password'
            })
        } else {
            jwt.sign({result}, 'secretkey', (err, token) => {
                res.status(200).json({
                    success: true,
                    token
                })
            })
        }
    }).catch(err => {
        res.sendStatus(404).json({
            success: false,
            message: err.message
        })  
    })
});

module.exports = router;