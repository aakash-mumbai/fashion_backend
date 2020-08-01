import * as mongoose from 'mongoose';
const sliderSchema = new mongoose.Schema({
    file: {
        type: String,
        required: true
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

module.exports = mongoose.model('Slider', sliderSchema);
