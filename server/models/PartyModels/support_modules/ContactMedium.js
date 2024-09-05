const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ValidFor = require('../../genericModels/ValidFor');
const Characteristic = require('./Characteristic');

const ContactMediumSchema = new Schema({
    mediumType: String,
    preferred: Boolean,
    characteristic: Characteristic.schema,
    validFor: ValidFor.schema,
    "@baseType": String,
    "@schemaLocation": String,
    "@type": String
});

module.exports = mongoose.model('ContactMedium', ContactMediumSchema);
