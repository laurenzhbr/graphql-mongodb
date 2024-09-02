const mongoose = require('mongoose');

const FeatureSchema = new mongoose.Schema({
    isBundle: {
        type: Boolean,
        default: false
    },
    isEnabled: {
        type: Boolean,
        default: true
    },
    name: {
        type: String,
        required: true
    }
});

const Feature = mongoose.model('Feature', FeatureSchema);

module.exports = Feature;