import * as express from 'express';
import {decodeBase64Image, getUserId, uploadImage} from '../common/verifytoken';
const router = express.Router();
const featuresSchema = require('../models/features');
const featuresImageSchema = require('../models/feature-image');
const fs = require("fs");

router.get('/:id', async (req, res) => {
    try {
        let find: any;
        if (req.params.id == '0') {
            find = await featuresSchema.find();
        } else {
            find = await featuresSchema.findOne({_id: req.params.id}).exec();
        }
        res.status(200).json(find);
    } catch (error) {
        res.status(404).json({message: error.message})
    }
});

router.get('/image/:id', async (req, res) => {
    try {
        let find = await featuresImageSchema.find({fID: req.params.id}).exec();
        res.status(200).json(find);
    } catch (error) {
        res.status(404).json({message: error.message})
    }
});

router.post('/', async (req, res) => {
    let imgData: any = '';
    let imgData1: any = '';
    let imgData2: any = '';
    if (req.body.file) {
        imgData = await uploadImage(req.body.file, res, req);
    }
    if (req.body.file1) {
        imgData1 = await uploadImage(req.body.file1, res, req);
    }
    if (req.body.file2) {
        imgData2 = await uploadImage(req.body.file2, res, req);
    }
    const features = new featuresSchema({
        name: req.body.name,
        file: imgData,
        file1: imgData1,
        file2: imgData2,
        description: req.body.description,
        features: req.body.features
    })
    const save = await features.save();
    res.status(201).json(save);
});

router.post('/image', async (req, res) => {
    let imgData: any = '';
    let imgData1: any = '';
    let imgData2: any = '';
    if (req.body.file) {
        imgData = await uploadImage(req.body.file, res, req);
    }
    if (req.body.file1) {
        imgData1 = await uploadImage(req.body.file1, res, req);
    }
    if (req.body.file2) {
        imgData2 = await uploadImage(req.body.file2, res, req);
    }
    const features = new featuresImageSchema({
        fID: req.body.fID,
        file: imgData,
        file1: imgData1,
        file2: imgData2
    })
    const save = await features.save();
    res.status(201).json(save);
});

router.patch('/', findByID, async(req, res) => {
    try {
        let imgData: any = '';
        let imgData1: any = '';
        let imgData2: any = '';
        if (req.body.file != '') {
            imgData = await uploadImage(req.body.file, res, req);
            fs.unlinkSync(req.body.fileName);
        }
        if (req.body.file1 != '') {
            imgData1 = await uploadImage(req.body.file1, res, req);
            fs.unlinkSync(req.body.fileName1);
        }
        if (req.body.file2 != '') {
            imgData2 = await uploadImage(req.body.file2, res, req);
            fs.unlinkSync(req.body.fileName2);
        }
        const features = {
            name: req.body.name,
            file: (imgData === '') ? req.body.fileName : imgData,
            file1: (imgData1 === '') ? req.body.fileName1 : imgData1,
            file2: (imgData2 === '') ? req.body.fileName2 : imgData2,
            description: req.body.description,
            features: req.body.features
        };
        console.log(features);
        const update = await featuresSchema.update({_id: req.body.login._id}, {$set: features}).exec()
        res.status(200).json({status: true, message: update});
    } catch (error) {
        res.status(400).json({message: error.message})
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await featuresSchema.findOne({_id: req.params.id}).exec().then(ret => {
            if (ret._id) {
                if (ret.file) {
                    fs.unlinkSync(ret.file);
                    fs.unlinkSync(ret.file1);
                    fs.unlinkSync(ret.file2);
                }
            }
        })
        const result = await featuresSchema.remove({_id: req.params.id});
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({message: error.message})
    }
});

router.delete('/image/:id', async (req, res) => {
    try {
        await featuresImageSchema.findOne({_id: req.params.id}).exec().then(ret => {
            if (ret._id) {
                if (ret.file) {
                    fs.unlinkSync(ret.file);
                    fs.unlinkSync(ret.file1);
                    fs.unlinkSync(ret.file2);
                }
            }
        })
        const result = await featuresImageSchema.remove({_id: req.params.id});
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({message: error.message})
    }
});

async function findByID(req, res, next) {
    let returnLogin;
    try {
        returnLogin = await featuresSchema.find({_id: req.body._id});
        if (returnLogin.length === 0) {
            return res.status(400).json({message: 'Can not find id', status: false})
        }
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
    req.body['login'] = returnLogin[0];
    next()
}

module.exports = router;
