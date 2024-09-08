const mongoose = require('mongoose');

const ResourceAdministrativeStateSchema = new mongoose.Schema({
    value: {
        type: String,
        enum: ['locked', 'unlocked', 'shutdown'],  // Beschränkung auf die zulässigen Werte
        required: true
    }
}, { _id: false });

const ResourceAdministrativeState = mongoose.model('ResourceAdministrativeState', ResourceAdministrativeStateSchema);

module.exports = ResourceAdministrativeState;