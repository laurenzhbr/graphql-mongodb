const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrganizationRefSchema = new Schema({
    id: String,
    href: String,
    name: String,
    "@baseType": String,
    "@schemaLocation": String,
    "@type": String,
    "@referredType": String
}, { _id: false });

module.exports = mongoose.model('OrganizationRef', OrganizationRefSchema);
