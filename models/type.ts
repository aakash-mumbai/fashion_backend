import * as mongoose from 'mongoose';
const typeSchema = new mongoose.Schema({
    file: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

module.exports = mongoose.model('Type', typeSchema);
