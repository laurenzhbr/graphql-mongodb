const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ValidFor = require('../../genericModels/ValidFor').schema;
const MediumCharacteristic = require('./MediumCharacteristic').schema;

const ContactMediumSchema = new Schema({
    mediumType: String,
    preferred: Boolean,
    characteristic: MediumCharacteristic,
    validFor: ValidFor,
    "@baseType": String,
    "@schemaLocation": String,
    "@type": String
});

module.exports = mongoose.model('ContactMedium', ContactMediumSchema);
