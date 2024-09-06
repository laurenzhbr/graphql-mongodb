const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ValidFor = require('../../genericModels/ValidFor').schema;

const PartyCreditProfileSchema = new Schema({
    creditAgencyName: String,
    creditAgencyType: String,
    ratingReference: String,
    ratingScore: Number,
    lastExecuted: Date,
    validFor: ValidFor,
    "@baseType": String,
    "@schemaLocation": String,
    "@type": String
});

module.exports = mongoose.model('PartyCreditProfile', PartyCreditProfileSchema);
