import * as mongoose from 'mongoose';
const contactSchema: any = new mongoose.Schema({
    name: {
        type: String
    },
    mobile: {
        type: String
    },
    message: {
        type: String
    },
    email: {
        type: String
    },
    subject: {
        type: String
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

module.exports = mongoose.model('Contact', contactSchema);