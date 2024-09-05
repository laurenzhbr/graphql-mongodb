const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaxDefinitionSchema = new Schema({
    id: String,
    name: String,
    taxType: String,
    "@baseType": String,
    "@schemaLocation": String,
    "@type": String,
    "@referredType": String
});

module.exports = mongoose.model('TaxDefinition', TaxDefinitionSchema);
