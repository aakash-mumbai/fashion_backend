import * as express from 'express';
const router = express.Router();
const contactSchema = require('../models/contact');

router.get('/', async (req, res) => {
    try {
        const find = await contactSchema.find();
        res.status(200).json(find);
    } catch (error) {
        res.status(404).json({message: error.message})
    }
});

router.post('/', async (req, res) => {
    const contact = new contactSchema({
        name: req.body.name,
        mobile: req.body.mobile,
        message: req.body.message,
        email: req.body.email,
        subject: req.body.subject
    });

    try {
        const save = await contact.save()
        res.status(201).json(save);
    } catch (error) {
        res.status(400).json({message: error.message})
    }
});


module.exports = router;