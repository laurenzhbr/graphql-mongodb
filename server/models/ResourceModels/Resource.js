const mongoose = require('mongoose');
const Characteristic = require('./Characteristic');
const ResourceSpecificationRef = require('./ResourceSpecificationRef').schema;
const RelatedPlaceRefOrValue = require('./RelatedPlaceRefOrValue').schema;
//const ResourceRelationship = require('./ResourceRelationship').schema;
const Note = require('../genericModels/Note').schema;
const RelatedParty = require('./RelatedParty').schema;
const ResourceStatusType = require('./ResourceStatus').schema;
const ResourceUsageStateType = require('./ResourceUsageState').schema;
const ResourceAdministrativeStateType = require('./ResourceAdministrativeState').schema;
const ResourceOperationalStateType = require('./ResourceOperationalState').schema;

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
  note: [Note],
  place: RelatedPlaceRefOrValue, //Ref-Entity -> /geographicAdressManagement/geograhicAdress/:id
  //resourceCharacteristic: [Characteristic],
  //resourceRelationship: [ResourceRelationship],
  resourceSpecification: ResourceSpecificationRef, //Ref-Entity -> /resourceCatalogManagement/resourceSpecification/:id
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