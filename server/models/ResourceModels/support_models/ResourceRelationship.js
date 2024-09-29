const mongoose = require('mongoose');
const ResourceRefOrValueSchema = require('../ref_models/ResourceRefOrValue').schema;

const ResourceRelationshipSchema = new mongoose.Schema({
    href: {
        type: String,
        strict: true,
      },
    relationshipType: {
        type: String,
        enum: ['bundled', 'reliesOn', 'targets', 'isTargeted'],  // Beschränkung auf die zulässigen Werte
        required: true
    },
    resource: {
        type: ResourceRefOrValueSchema,
        required: true
    }
}, { _id: false });

const ResourceRelationship = mongoose.model('ResourceRelationship', ResourceRelationshipSchema);

module.exports = ResourceRelationship;
