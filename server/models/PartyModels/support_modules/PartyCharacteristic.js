const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Subschema für PartyCharacteristic
const PartyCharacteristicSchema = new Schema({
    name: String,
    valueType: String,
    value: Schema.Types.Mixed,
    "@baseType": String,
    "@schemaLocation": String,
    "@type": String
});

const PartyCharacteristic = mongoose.model('PartyCharacteristic', PartyCharacteristicSchema);

module.exports = PartyCharacteristic;