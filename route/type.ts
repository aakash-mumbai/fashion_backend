import * as express from 'express';
import {decodeBase64Image, getUserId} from '../common/verifytoken';
const typeSchema = require('../models/type');
const router = express.Router();
const fs = require("fs");

router.get('/:id', async (req, res) => {
    try {
        let find: any;
        if (req.params.id == '0') {
            find = await typeSchema.find();
        } else {
            find = await typeSchema.findOne({_id: req.params.id}).exec();
        }
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
            const type = new typeSchema({
                file: fileName,
                name: req.body.name
            })
            const save = await type.save();
            res.status(201).json(save);
        });
    }
});


router.patch('/', findByID, async(req, res) => {
    try {
        if (req.body.file) {
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

                    await typeSchema.update({_id: req.body.login._id}, {$set: {
                            file: fileName
                        }})
                    fs.unlinkSync(req.body.fileName);
                    res.status(200).json({status: true, message: 'Successfully file change'});
                });
            }
        }
    } catch (error) {
        res.status(400).json({message: error.message})
    }
});

async function findByID(req, res, next) {
    let returnLogin;
    try {
        returnLogin = await typeSchema.find({_id: req.body._id});
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
