import * as express from 'express';
import {uploadImage} from "../common/verifytoken";
const router = express.Router();
const reviewSchema = require('../models/review');
const subCategorySchema = require('../models/subCategory');
const featuresSchema = require('../models/features');

router.get('/:id', async (req, res) => {
    try {
        let find: any;
        const arr = [];
        if (req.params.id == '0') {
            find = await reviewSchema.find();
            if (find.length > 0) {
                for (let i = 0; i < find.length; i++) {
                    const obj = {
                        _id: find[i]._id,
                        name: find[i].name,
                        mobile: find[i].mobile,
                        message: find[i].message,
                        pID: find[i].pID,
                        flag: find[i].flag,
                        created_at: find[i].created_at,
                        pname: ''
                    }
                    let pName: any;
                    pName = await getFeaturePName(find[i].pID);
                    if (pName == null) {
                        pName = await getSubCategoryPName(find[i].pID);
                    }
                    obj.pname = (pName == null) ? '' : pName.name;
                    arr.push(obj);
                }
                find = arr;
            }
        } else {
            find = await reviewSchema.findOne({_id: req.params.id}).exec();
        }
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

router.patch('/', findByID, async (req, res) => {
    try {
        const review = {
            name: req.body.login.name,
            mobile: req.body.login.mobile,
            message: req.body.login.message,
            pID: req.body.login.pID,
            flag: req.body.flag
        };
        const update = await reviewSchema.update({_id: req.body.login._id}, {$set: review}).exec()
        res.status(200).json({status: true, message: update});
    } catch (error) {
        res.status(400).json({message: error.message})
    }
});

async function getFeaturePName(id) {
    return new Promise((resolve) =>{
        const data = featuresSchema.findOne({_id: id}).exec();
        resolve(data);
    });
}

async function getSubCategoryPName(id) {
    return new Promise((resolve) =>{
        const data = subCategorySchema.findOne({_id: id}).exec();
        resolve(data);
    });
}

async function findByID(req, res, next) {
    let returnLogin;
    try {
        returnLogin = await reviewSchema.find({_id: req.body._id});
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