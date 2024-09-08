const mongoose = require('mongoose');

const ResourceOperationalStateSchema = new mongoose.Schema({
    value: {
        type: String,
        enum: ['enable', 'disable'],  // Beschränkung auf die zulässigen Werte
        required: true
    }
}, { _id: false });

const ResourceOperationalState = mongoose.model('ResourceOperationalState', ResourceOperationalStateSchema);

module.exports = ResourceOperationalState;