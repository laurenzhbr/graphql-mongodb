const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RelatedPartySchema = new Schema({
  href: String,
  id: String,
  name: String,
  role: String,
  "@referredType": String
});

const NoteSchema = new Schema({
  text: String
});

const PlaceSchema = new Schema({
  id: String,
  href: String,
  "@type": String,
  "@referredType": String
});

const ResourceRelationshipSchema = new Schema({
  relationshipType: String,
  resource: {
    id: String,
    href: String
  }
});

const ResourceSpecificationSchema = new Schema({
  id: String,
  href: String,
  "@referredType": String
});

const ResourceSchema = new Schema({
  id: String,
  href: String,
  description: String,
  category: String,
  value: String,
  endOperatingDate: Date,
  name: String,
  administrativeState: String,
  operationalState: String,
  usageState: String,
  resourceStatus: String,
  relatedParty: [RelatedPartySchema],
  note: [NoteSchema],
  place: PlaceSchema,
  resourceRelationship: [ResourceRelationshipSchema],
  resourceSpecification: ResourceSpecificationSchema,
  startOperatingDate: Date,
  version: String,
  "@type": String,
  "@schemaLocation": String,
  "@baseType": String
});

const ResourceComplete = mongoose.model('ResourceComplete', ResourceSchema);

module.exports = ResourceComplete;
