const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactMedium = require('./support_modules/ContactMedium').schema;
const PartyCreditProfile = require('./support_modules/PartyCreditProfile').schema;
const ValidFor = require('../genericModels/ValidFor').schema;
const ExternalReference = require('./support_modules//ExternalReference').schema;

const OrganizationSchema = new Schema({
    href: String,
    isHeadOffice: Boolean,
    isLegalEntity: Boolean,
    name: String,
    organizationType: String,
    tradingName: String,
    contactMedium: { type: [ContactMedium], default: undefined },
    creditRating: { type: [PartyCreditProfile], default: undefined },
    existsDuring: ValidFor,
    externalReference: { type: [ExternalReference], default: undefined },    
    status: {
        type: String,
        enum: ['initialized', 'validated', 'closed'],  // Beschränkung auf die zulässigen Werte
        required: true
    }
});

OrganizationSchema.pre('save', function (next) {
    // Setze href, wenn es nicht vorhanden ist
    if (!this.href) {
        this.href = `http://{host}/partyManagement/organization/${this._id}`;
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
        doc.href = `https://{host}/partyManagement/organization/${doc._id}`;
      }
    });
  
    next();
  });

module.exports = mongoose.model('Organization', OrganizationSchema);

