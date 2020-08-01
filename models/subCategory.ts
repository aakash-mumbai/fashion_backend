import * as mongoose from 'mongoose';
const subCategorySchema = new mongoose.Schema({
    cID: {
        type: String,
        required: true
    },
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
    },
    typeName: {
        type: String
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

module.exports = mongoose.model('SubCategory', subCategorySchema);