const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ValidFor = require('../../genericModels/ValidFor');
const Attachment = require('../../genericModels/Attachment');

const OrganizationIdentificationSchema = new Schema({
    identificationId: String,
    identificationType: String,
    issuingAuthority: String,
    issuingDate: Date,
    attachment: Attachment.schema,
    validFor: ValidFor.schema,
    "@baseType": String,
    "@schemaLocation": String,
    "@type": String
});

module.exports = mongoose.model('OrganizationIdentification', OrganizationIdentificationSchema);
