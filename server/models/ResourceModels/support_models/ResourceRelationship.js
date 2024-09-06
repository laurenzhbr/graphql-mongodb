const mongoose = require('mongoose');
const ResourceRefOrValueSchema = require('../ref_models/ResourceRefOrValue').schema;

const ResourceRelationshipSchema = new mongoose.Schema({
    href: String,
    relationshipType: {
        type: String,
        enum: ['bundled', 'reliesOn', 'targets', 'isTargeted'],  // Beschränkung auf die zulässigen Werte
        required: true
    },
    resource: {
        type: ResourceRefOrValueSchema,
        required: true
    }
});

const ResourceRelationship = mongoose.model('ResourceRelationship', ResourceRelationshipSchema);

module.exports = ResourceRelationship;
