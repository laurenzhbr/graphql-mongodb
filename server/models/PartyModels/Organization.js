const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactMedium = require('./support_modules/ContactMedium').schema;
const CreditRating = require('./support_modules/CreditRating').schema;
const ValidFor = require('../genericModels/ValidFor').schema;
const ExternalReference = require('./support_modules//ExternalReference').schema;
const OrganizationChildRelationship = require('./support_modules/OrganizationChildRelationship').schema;
const OrganizationIdentification = require('./support_modules/OrganizationIdentification').schema;
const TaxExemptionCertificate = require('./support_modules/TaxExemptionCertificate').schema;
const OtherName = require('./support_modules/OtherName').schema;
const PartyCharacteristic = require('./support_modules/PartyCharacteristic').schema;
const RelatedParty = require('../genericModels/RelatedParty').schema;

const OrganizationSchema = new Schema({
    href: String,
    isHeadOffice: Boolean,
    isLegalEntity: Boolean,
    name: String,
    nameType: String,
    organizationType: String,
    tradingName: String,
    tradeRegisterNumber: String,
    contactMedium: { type: [ContactMedium], default: undefined },
    creditRating: { type: [CreditRating], default: undefined },
    existsDuring: ValidFor,
    externalReference: { type: [ExternalReference], default: undefined },
    organizationChildRelationship: { type: [OrganizationChildRelationship], default: undefined },
    organizationIdentification: { type: [OrganizationIdentification], default: undefined },
    organizationParentRelationship: OrganizationChildRelationship,
    otherName: { type: [OtherName], default: undefined },
    partyCharacteristic: { type: [PartyCharacteristic], default: undefined },
    relatedParty: { type: [RelatedParty], default: undefined },
    status: {
        type: String,
        enum: ['initialized', 'validated', 'closed'],  // Beschränkung auf die zulässigen Werte
        required: true
    },
    taxExemptionCertificate: { type: [TaxExemptionCertificate], default: undefined },
    "@baseType": String,
    "@schemaLocation": String,
    "@type": String
});

OrganizationSchema.pre('save', function (next) {
    // Setze href, wenn es nicht vorhanden ist
    if (!this.href) {
        this.href = `https://{host}/partyManagement/party/${this._id}`;
    }

    next();
});

// Definiere den pre('insertMany')-Hook
OrganizationSchema.pre('insertMany', function (next, docs) {
    docs.forEach(doc => {
      // Prüfe, ob das Dokument bereits eine _id hat, andernfalls erstelle eine
      if (!doc._id) {
        doc._id = new mongoose.Types.ObjectId(); // Erzeuge eine neue ObjectId
      }
  
      // Setze href für jedes Dokument, wenn es nicht vorhanden ist
      if (!doc.href) {
        doc.href = `https://{host}/partyManagement/party/${doc._id}`;
      }
    });
  
    next();
  });

module.exports = mongoose.model('Organization', OrganizationSchema);

