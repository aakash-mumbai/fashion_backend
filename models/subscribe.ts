// const mongoose = require('mongoose');
import * as mongoose from 'mongoose';
const subscribeSchema: any = new mongoose.Schema({
    email: {
        type: String
    },
    mobile: {
        type: String
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

module.exports = mongoose.model('Subscribe', subscribeSchema);