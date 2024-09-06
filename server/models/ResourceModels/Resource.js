const mongoose = require('mongoose');
const ResourceCharacteristic = require('./support_models/Characteristic').schema;
const ResourceSpecificationRef = require('./ref_models/ResourceSpecificationRef').schema;
const RelatedPlaceRefOrValue = require('./ref_models/RelatedPlaceRefOrValue').schema;
const ResourceRelationship = require('./support_models/ResourceRelationship').schema;
const Note = require('../genericModels/Note').schema;
const RelatedParty = require('../genericModels/RelatedParty').schema;
const ResourceStatusType = require('./support_models/ResourceStatus').schema;
const ResourceUsageStateType = require('./support_models/ResourceUsageState').schema;
const ResourceAdministrativeStateType = require('./support_models/ResourceAdministrativeState').schema;
const ResourceOperationalStateType = require('./support_models/ResourceOperationalState').schema;

const ResourceSchema = new mongoose.Schema({
  href: String,
  description: String,
  category: String,
  value: String,
  endOperatingDate: Date,
  name: String,
  administrativeState: {
    type: String,
    enum: ['locked', 'unlocked', 'shutdown']
  },
  operationalState: {
    type: String,
    enum: ['enable', 'disable'],
  },
  relatedParty: [RelatedParty], //Ref-Entity -> /partyManagement/individual/:id
  relatedPartyGql: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Organization",
  },
  note: [Note],
  place: RelatedPlaceRefOrValue, //Ref-Entity -> /geographicAdressManagement/geograhicAdress/:id
  placeGql: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GeographicAddress",
  },
  resourceCharacteristic: [ResourceCharacteristic],
  resourceRelationship: [ResourceRelationship],
  resourceSpecification: ResourceSpecificationRef, //Ref-Entity -> /resourceCatalogManagement/resourceSpecification/:id
  resourceSpecificationGql: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ResourceSpecification",
  },
  resourceStatus: {
    type: String,
    enum: ['standby', 'alarm', 'available', 'reserved', 'unknown', 'suspended'],
  },
  usageState: {
    type: String,
    enum: ['idle', 'active', 'busy'],
  },
  startOperatingDate: Date,
  version: String,
});

//Pre-save Hook to generate href-attribute
ResourceSchema.pre('save', function(next){
  if (!this.href) {
    this.href = `https://{host}/resourceInventoryManagement/resource/${this._id}`;
  }
  next();
})

const Resource = mongoose.model('Resource', ResourceSchema);

module.exports = Resource;