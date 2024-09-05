const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ValidFor = require('../../genericModels/ValidFor');

const OtherNameSchema = new Schema({
    name: String,
    nameType: String,
    tradingName: String,
    validFor: ValidFor.schema,
    "@baseType": String,
    "@schemaLocation": String,
    "@type": String
});

module.exports = mongoose.model('OtherName', OtherNameSchema);
