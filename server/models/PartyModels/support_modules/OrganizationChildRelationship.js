const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const OrganizationRef = require('../ref_models/OrganizationRef').schema;

const OrganizationChildRelationshipSchema = new Schema({
    relationshipType: String,
    organization: OrganizationRef,
    "@baseType": String,
    "@schemaLocation": String,
    "@type": String
}, { _id: false });

module.exports = mongoose.model('OrganizationChildRelationship', OrganizationChildRelationshipSchema);
