import * as express from 'express';
import {getUserId, uploadImage} from '../common/verifytoken';
const categorySchema = require('../models/category');
const router = express.Router();
const fs = require("fs");

router.get('/:id', async (req, res) => {
    try {
        let find: any;
        if (req.params.id == '0') {
            find = await categorySchema.find();
        } else {
            find = await categorySchema.findOne({_id: req.params.id}).exec();
        }
       res.status(200).json(find); 
    } catch (error) {
        res.status(404).json({message: error.message})
    }
});

router.get('/list/:name', async (req, res) => {
    try {
        console.log('test');
        const find = await categorySchema.find({typeName: req.params.name}).exec();
        res.status(200).json(find);
    } catch (error) {
        res.status(404).json({message: error.message})
    }
});

router.get('/details/:name', async (req, res) => {
    try {
        console.log('test');
        const find = await categorySchema.find({typeName: req.params.name}).exec();
        res.status(200).json(find);
    } catch (error) {
        res.status(404).json({message: error.message})
    }
});

router.post('/', getUserId, async (req, res) => {
    let imgData: any = '';
    if (req.body.file) {
        imgData = await uploadImage(req.body.file, res, req);
    }

    try {
        const obj = new categorySchema({
            name: req.body.name,
            file: imgData,
            type: req.body.type,
            typeName: req.body.typeName,
        });
       const save = await obj.save();
       res.status(201).json(save);
    } catch (error) {
        res.status(404).json({message: error.message})
    }
});

router.patch('/', findByID, async (req, res) => {
    try {
        let imgData: any = '';
        if (req.body.file != '') {
            imgData = await uploadImage(req.body.file, res, req);
            fs.unlinkSync(req.body.fileName);
        }
        const category = {
            name: req.body.name,
            file: (imgData === '') ? req.body.fileName : imgData,
            type: req.body.type,
            typeName: req.body.typeName
        };
        const update = await categorySchema.update({_id: req.body.login._id}, {$set: category}).exec()
        res.status(200).json({status: true, message: update});
    } catch (error) {
        res.status(400).json({message: error.message})
    }
});

router.delete('/:id', getUserId, async (req, res) => {
    console.log('test');
    try {
        await categorySchema.findOne({_id: req.params.id}).exec().then(ret => {
            if (ret._id) {
                if (ret.file) {
                    fs.unlinkSync(ret.file);
                }
            }
        })
        const result = await categorySchema.remove({_id: req.params.id});
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({message: error.message})
    }
});


async function findByID(req, res, next) {
    let returnLogin;
    try {
        returnLogin = await categorySchema.find({_id: req.body._id});
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
