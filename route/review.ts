import * as express from 'express';
const router = express.Router();
const reviewSchema = require('../models/review');

router.get('/:id', async (req, res) => {
    try {
        const find = await reviewSchema.find({pID: req.params.id});
        res.status(200).json(find);
    } catch (error) {
        res.status(404).json({message: error.message})
    }
});

router.post('/', async (req, res) => {
    const review = new reviewSchema({
        name: req.body.name,
        mobile: req.body.mobile,
        message: req.body.message,
        pID: req.body.pID,
        flag: false
    });

    try {
        const save = await review.save()
        res.status(201).json(save);
    } catch (error) {
        res.status(400).json({message: error.message})
    }
});


module.exports = router;