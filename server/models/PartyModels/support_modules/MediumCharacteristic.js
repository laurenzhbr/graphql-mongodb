const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MediumCharacteristicSchema = new Schema({
    city: String,
    contactType: String,
    country: String,
    emailAddress: String,
    faxNumber: String,
    phoneNumber: String,
    postCode: String,
    socialNetworkId: String,
    stateOrProvince: String,
    street1: String,
    street2: String,
    "@baseType": String,
    "@schemaLocation": String,
    "@type": String
});

module.exports = mongoose.model('MediumCharacteristic', MediumCharacteristicSchema);
