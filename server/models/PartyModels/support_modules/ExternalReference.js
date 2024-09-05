const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExternalReferenceSchema = new Schema({
    externalReferenceType: String,
    name: String,
    "@baseType": String,
    "@schemaLocation": String,
    "@type": String
});

module.exports = mongoose.model('ExternalReference', ExternalReferenceSchema);
