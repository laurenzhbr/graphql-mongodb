const mongoose = require('mongoose');

const ResourceUsageStateSchema = new mongoose.Schema({
    value: {
        type: String,
        enum: ['idle', 'active', 'busy'],  // Beschränkung auf die zulässigen Werte
        required: true
    }
});

const ResourceUsageState = mongoose.model('ResourceUsageState', ResourceUsageStateSchema);

module.exports = ResourceUsageState;