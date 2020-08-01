import * as express from 'express';
import {decodeBase64Image, getUserId} from '../common/verifytoken';
const sliderSchema = require('../models/slider');
const router = express.Router();
const fs = require("fs");

router.get('/', async (req, res) => {
    try {
        const find = await sliderSchema.find();
        res.status(200).json(find);
    } catch (error) {
        res.status(404).json({message: error.message})
    }
});

router.post('/', getUserId, async (req, res) => {
    const imgData = req.body.file;
    const imageBuffer: any = decodeBase64Image(imgData);
    if (imageBuffer) {
        const fileName = 'upload/' + Math.floor(Date.now() / 1000) + '.' + req.body.ext;
        fs.writeFile(fileName, imageBuffer.data, async (err: any) => {
            if (err) {
                res.status(400).json({
                    success: false,
                    message: 'Imvalid file'
                })
                return false;
            }
            const slider = new sliderSchema({
                file: fileName
            })
            const save = await slider.save();
            res.status(201).json(save);
        });
    }
});

router.delete('/:id', getUserId, async (req, res) => {
    try {
        const getObj = await sliderSchema.findOne({_id: req.params.id}).exec().then(ret => {
            if (ret._id) {
                if (ret.file) {
                    fs.unlinkSync(ret.file);
                }
            }
        })
        const result = await sliderSchema.remove({_id: req.params.id});
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({message: error.message})
    }
});

module.exports = router;
