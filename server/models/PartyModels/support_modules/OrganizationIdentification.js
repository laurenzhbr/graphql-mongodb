const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ValidFor = require('../../genericModels/ValidFor').schema;
const Attachment = require('../../genericModels/Attachment').schema;

const OrganizationIdentificationSchema = new Schema({
    identificationId: String,
    identificationType: String,
    issuingAuthority: String,
    issuingDate: Date,
    attachment: Attachment,
    validFor: ValidFor,
    "@baseType": String,
    "@schemaLocation": String,
    "@type": String
}, { _id: false });

module.exports = mongoose.model('OrganizationIdentification', OrganizationIdentificationSchema);
