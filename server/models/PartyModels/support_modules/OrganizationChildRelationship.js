const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const OrganizationRef = require('../ref_models/OrganizationRef');

const OrganizationChildRelationshipSchema = new Schema({
    relationshipType: String,
    organization: OrganizationRef.schema,
    "@baseType": String,
    "@schemaLocation": String,
    "@type": String
});

module.exports = mongoose.model('OrganizationChildRelationship', OrganizationChildRelationshipSchema);
