const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ValidFor = require('../../genericModels/ValidFor');

const CreditRatingSchema = new Schema({
    creditAgencyName: String,
    creditAgencyType: String,
    ratingReference: String,
    ratingScore: Number,
    lastExecuted: Date,
    validFor: ValidFor.schema,
    "@baseType": String,
    "@schemaLocation": String,
    "@type": String
});

module.exports = mongoose.model('CreditRating', CreditRatingSchema);
