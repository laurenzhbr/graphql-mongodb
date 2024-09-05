const mongoose = require('mongoose');
ValidFor = require('./ValidFor').schema;

// Subschema für Attachment
const AttachmentSchema = new mongoose.Schema({
    id: String,
    href: String,
    attachmentType: String,
    content: String,
    description: String,
    mimeType: String,
    name: String,
    url: String,
    size: {
        amount: Number,
        units: String
    },
    validFor: ValidFor,
    "@baseType": String,
    "@schemaLocation": String,
    "@type": String,
    "@referredType": String
}, { _id: false });

const Attachment = mongoose.model('Attachment', AttachmentSchema);

module.exports = Attachment;