const mongoose = require('mongoose');

const ResourceAdministrativeStateSchema = new mongoose.Schema({
    value: {
        type: String,
        enum: ['locked', 'unlocked', 'shutdown'],  // Beschränkung auf die zulässigen Werte
        required: true
    }
});

const ResourceAdministrativeState = mongoose.model('ResourceAdministrativeState', ResourceAdministrativeStateSchema);

module.exports = ResourceAdministrativeState;