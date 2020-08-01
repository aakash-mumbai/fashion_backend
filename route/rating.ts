// const express = require('express');
import * as express from 'express';
const router = express.Router();
const ratingSchema = require('../models/rating');

router.get('/:id', async (req, res) => {
    try {
        const find = await ratingSchema.find({pID: req.params.id});
        res.status(200).json(find);
    } catch (error) {
        res.status(404).json({message: error.message})
    }
});

router.post('/', async (req, res) => {
    const rating = new ratingSchema({
        email: req.body.email,
        mobile: req.body.mobile,
        rating: req.body.rating,
        pID: req.body.pID
    });

    try {
        const save = await rating.save()
        res.status(201).json(save);
    } catch (error) {
        res.status(400).json({message: error.message})
    }
});


module.exports = router;