const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ValidFor = require('../../genericModels/ValidFor').schema;

const OtherNameSchema = new Schema({
    name: String,
    nameType: String,
    tradingName: String,
    validFor: ValidFor,
    "@baseType": String,
    "@schemaLocation": String,
    "@type": String
}, { _id: false });

module.exports = mongoose.model('OtherName', OtherNameSchema);
