import * as mongoose from 'mongoose';
const featuresSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    file: {
        type: String,
        required: true
    },
    file1: {
        type: String,
        required: true
    },
    file2: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    features: {
        type: String
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

module.exports = mongoose.model('Features', featuresSchema);
