// const mongoose = require('mongoose');
import * as mongoose from 'mongoose';
const ratingSchema: any = new mongoose.Schema({
    email: {
        type: String
    },
    mobile: {
        type: String
    },
    rating: {
        type: Number
    },
    pID: {
        type: String
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

module.exports = mongoose.model('Rating', ratingSchema);