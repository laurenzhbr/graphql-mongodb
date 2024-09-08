const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExternalReferenceSchema = new Schema({
    externalReferenceType: String,
    name: String,
    "@baseType": String,
    "@schemaLocation": String,
    "@type": String
}, { _id: false });

module.exports = mongoose.model('ExternalReference', ExternalReferenceSchema);
