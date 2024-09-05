const mongoose = require('mongoose');
//const ResourceCharacteristic = require('./support_models/Characteristic');
const ResourceSpecificationRef = require('./ref_models/ResourceSpecificationRef').schema;
const RelatedPlaceRefOrValue = require('./ref_models/RelatedPlaceRefOrValue').schema;
//const ResourceRelationship = require('./ResourceRelationship').schema;
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
    enum: ResourceAdministrativeStateType.path('value').enumValues,
  },
  operationalState: {
    type: String,
    enum: ResourceOperationalStateType.path('value').enumValues,
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
  //resourceCharacteristic: [Characteristic],
  //resourceRelationship: [ResourceRelationship],
  resourceSpecification: ResourceSpecificationRef, //Ref-Entity -> /resourceCatalogManagement/resourceSpecification/:id
  resourceSpecificationGql: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ResourceSpecification",
  },
  resourceStatus: {
    type: String,
    enum: ResourceStatusType.path('value').enumValues,
  },
  usageState: {
    type: String,
    enum: ResourceUsageStateType.path('value').enumValues,
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