const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ValidFor = require('../../genericModels/ValidFor');
const Attachment = require('../../genericModels/Attachment');
const TaxDefinition = require('./TaxDefinition');

const TaxExemptionCertificateSchema = new Schema({
    id: String,
    attachment: Attachment.schema,
    taxDefinition: [TaxDefinition.schema],
    validFor: ValidFor.schema,
    "@baseType": String,
    "@schemaLocation": String,
    "@type": String
});

module.exports = mongoose.model('TaxExemptionCertificate', TaxExemptionCertificateSchema);
