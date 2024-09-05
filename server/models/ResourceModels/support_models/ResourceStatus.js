const mongoose = require('mongoose');

const ResourceStatusSchema = new mongoose.Schema({
    value: {
        type: String,
        enum: ['standby', 'alarm', 'available', 'reserved', 'unknown', 'suspended'],  // Beschränkung auf die zulässigen Werte
        required: true
    }
});

const ResourceStatus = mongoose.model('ResourceStatus', ResourceStatusSchema);

module.exports = ResourceStatus;
