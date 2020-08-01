import * as mongoose from 'mongoose';
const subCategoryImageSchema = new mongoose.Schema({
    sCID: {
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
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

module.exports = mongoose.model('SubCategoryImage', subCategoryImageSchema);
