const express = require('express');
const router = express.Router();
const SignUpSchema = require('../models/login');
const md5 = require('md5');

router.post('/', checkEmail, async (req, res) => {
    const login = new SignUpSchema({
        name: req.body.name,
        email: req.body.email,
        password: md5(req.body.password)
    });

    try {
        const save = await login.save()
        res.status(201).json(save);
    } catch (error) {
        res.status(400).json({message: error.message})
    }
});

router.patch('/changePassword', findByIDLogin, async(req, res) => {
    console.log(res.login)
    if (req.body.password != null) {
        res.login.password = md5(req.body.password)
    }
    
    try {
        await SignUpSchema.update({id: res.login.id}, {$set: {
            password: res.login.password
        }})
        res.status(200).json({status: true, message: 'Successfully change password'});
    } catch (error) {
        res.status(400).json({message: error.message})
    }
});

async function checkEmail(req, res, next) {
    try {
        if (req.body.email) {
            const chkEmail = await SignUpSchema.find({email: req.body.email});
            if (chkEmail.length > 0) {
                return res.status(409).json({message: 'Email already exists', status: false})
            }
        } else {
            return res.status(400).json({message: 'Email is required', status: false})
        }
    } catch (error) {
        return res.status(400).json({message: error.message});  
    }
    next();
}


async function findByIDLogin(req, res, next) {
    let returnLogin;
    try {
        returnLogin = await SignUpSchema.find({email: req.body.email});
        if (returnLogin.length === 0) {
            return res.status(400).json({message: 'Can not find email', status: false})
        }
        if (req.body.password != req.body.cPassword) {
            return res.status(400).json({message: 'Both password is mismatch', status: false})
        }
    } catch (error) {
      return res.status(400).json({message: error.message});  
    }
    res.login = returnLogin;
    next()
}

module.exports = router;