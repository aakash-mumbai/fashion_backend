import * as mongoose from 'mongoose';
const reviewSchema: any = new mongoose.Schema({
    name: {
        type: String
    },
    mobile: {
        type: String
    },
    message: {
        type: String
    },
    pID: {
        type: String
    },
    flag: {
        type: Boolean
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

module.exports = mongoose.model('Review', reviewSchema);