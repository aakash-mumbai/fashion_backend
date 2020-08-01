import * as express from 'express';
import {getUserId, uploadImage} from '../common/verifytoken';
const subCategorySchema = require('../models/subCategory');
const subCategoryImagesSchema = require('../models/subCategoryImages');
const router = express.Router();
const fs = require("fs");

router.get('/:id', async (req, res) => {
    try {
        const find: any = await subCategorySchema.find();
        res.status(200).json(find);
    } catch (error) {
        res.status(404).json({message: error.message})
    }
});

router.get('/list/:id', async (req, res) => {
    try {
        const find: any = await subCategorySchema.find({cID: req.params.id}).exec();
        res.status(200).json(find);
    } catch (error) {
        res.status(404).json({message: error.message})
    }
});

router.get('/details/:id', async (req, res) => {
    try {
        const find: any = await subCategorySchema.findOne({_id: req.params.id}).exec();
        res.status(200).json(find);
    } catch (error) {
        res.status(404).json({message: error.message})
    }
});

router.get('/image/:id', async (req, res) => {
    try {
        let find = await subCategoryImagesSchema.find({sCID: req.params.id}).exec();
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

    try {
        const obj = new subCategorySchema({
            cID: req.body.cID,
            name: req.body.name,
            file: imgData,
            file1: imgData1,
            file2: imgData2,
            description: req.body.description,
            features: req.body.features,
            typeName: req.body.typeName
        });
        const save = await obj.save();
        res.status(201).json(save);
    } catch (error) {
        res.status(404).json({message: error.message})
    }
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
    const subCatImage = new subCategoryImagesSchema({
        sCID: req.body.sCID,
        file: imgData,
        file1: imgData1,
        file2: imgData2
    })
    const save = await subCatImage.save();
    res.status(201).json(save);
});

router.patch('/', findByID, async (req, res) => {
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
        const subCategory = {
            cID: req.body.cID,
            name: req.body.name,
            file: (imgData != '') ? imgData : req.body.fileName,
            file1: (imgData1 != '') ? imgData1 : req.body.fileName1,
            file2: (imgData2 != '') ? imgData2 : req.body.fileName2,
            description: req.body.description,
            features: req.body.features,
            typeName: req.body.typeName
        };
        const update = await subCategorySchema.update({_id: req.body.login._id}, {$set: subCategory}).exec()
        res.status(200).json({status: true, message: update});
    } catch (error) {
        res.status(400).json({message: error.message})
    }
});

router.delete('/image/:id', async (req, res) => {
    try {
        await subCategoryImagesSchema.findOne({_id: req.params.id}).exec().then(ret => {
            if (ret._id) {
                if (ret.file) {
                    fs.unlinkSync(ret.file);
                    fs.unlinkSync(ret.file1);
                    fs.unlinkSync(ret.file2);
                }
            }
        })
        const result = await subCategoryImagesSchema.remove({_id: req.params.id});
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({message: error.message})
    }
});


router.delete('/:id', async (req, res) => {
    try {
        await subCategorySchema.findOne({_id: req.params.id}).exec().then(async ret => {
            if (ret._id) {
                if (ret.file) {
                    await subCategoryImagesSchema.find({sCID: req.params.id}).exec().then(subImage => {
                        if (subImage && subImage.length > 0) {
                            subImage.forEach((item) => {
                                fs.unlinkSync(item.file);
                                fs.unlinkSync(item.file1);
                                fs.unlinkSync(item.file2);
                            })
                        }
                    });
                    fs.unlinkSync(ret.file);
                    fs.unlinkSync(ret.file1);
                    fs.unlinkSync(ret.file2);
                }
            }
        })
        const result = await subCategorySchema.remove({_id: req.params.id});
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({message: error.message})
    }
});


async function findByID(req, res, next) {
    let returnLogin;
    try {
        returnLogin = await subCategorySchema.find({_id: req.body._id});
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
