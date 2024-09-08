const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ValidFor = require('../../genericModels/ValidFor').schema;
const Attachment = require('../../genericModels/Attachment').schema;
const TaxDefinition = require('./TaxDefinition').schema;

const TaxExemptionCertificateSchema = new Schema({
    id: String,
    attachment: Attachment,
    taxDefinition: { type: [TaxDefinition], default: undefined },
    validFor: ValidFor,
    "@baseType": String,
    "@schemaLocation": String,
    "@type": String
}, { _id: false });

module.exports = mongoose.model('TaxExemptionCertificate', TaxExemptionCertificateSchema);
