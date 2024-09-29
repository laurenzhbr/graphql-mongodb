const mongoose = require('mongoose');
const Characteristic = require('./support_models/Characteristic').schema;
const RelatedPlaceRefOrValue = require('./ref_models/RelatedPlaceRefOrValue').schema;
const ResourceRelationship = require('./support_models/ResourceRelationship').schema;
const Note = require('../genericModels/Note').schema;
const RelatedParty = require('../genericModels/RelatedParty').schema;

const ResourceSchema = new mongoose.Schema({
  href: {
    type: String,
    strict: true,
  },
  description: {
    type: String,
    strict: true,
  },
  category: {
    type: String,
    strict: true,
  },
  endOperatingDate: {
    type: Date,
    strict: true,
  },
  name: {
    type: String,
    strict: true,
  },
  resourceCharacteristic: { type: [Characteristic], default: undefined },
  administrativeState: {
    type: String,
    enum: ['locked', 'unlocked', 'shutdown']
  },
  operationalState: {
    type: String,
    enum: ['enable', 'disable'],
  },
  relatedParty: { type: [RelatedParty], default: undefined }, //Ref-Entity -> /partyManagement/organization/:id
  relatedPartyGql: {
    type: [mongoose.Schema.Types.ObjectId],
    default: undefined,
    ref: "Organization",
  },
  note: { type: [Note], default: undefined },
  place: RelatedPlaceRefOrValue, //Ref-Entity -> /geographicAddressManagement/geograhicAddress/:id
  placeGql: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GeographicAddress",
  },
  resourceRelationship: { type: [ResourceRelationship], default: undefined },
  resourceStatus: {
    type: String,
    enum: ['standby', 'alarm', 'available', 'reserved', 'unknown', 'suspended'],
  },
  usageState: {
    type: String,
    enum: ['idle', 'active', 'busy'],
  },
  startOperatingDate: {
    type: Date,
    strict: true,
  },
  version: {
    type: String,
    strict: true,
  },
});

//Pre-save Hook to generate href-attribute
ResourceSchema.pre('save', function(next){
  if (!this.href) {
    this.href = `http://{host}/resourceInventoryManagement/resource/${this._id}`;
  }
  next();
})

const Resource = mongoose.model('Resource', ResourceSchema);

module.exports = Resource;