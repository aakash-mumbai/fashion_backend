// const express = require('express');
import * as express from 'express';
const router = express.Router();
const subsSchema = require('../models/subscribe');

router.post('/', async (req, res) => {
    const subscribe = new subsSchema({
        email: req.body.email,
        mobile: req.body.mobile
    });

    try {
        const save = await subscribe.save()
        res.status(201).json(save);
    } catch (error) {
        res.status(400).json({message: error.message})
    }
});


module.exports = router;