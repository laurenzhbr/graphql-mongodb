const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ValidFor = require('../genericModels/ValidFor').schema;
const Attachment = require('../genericModels/Attachment').schema;
const RelatedParty = require('../genericModels/RelatedParty').schema;


// Subschema für CharacteristicValueSpecification
const CharacteristicValueSpecificationSchema = new Schema({
  value: mongoose.Schema.Types.Mixed,
  "@type": String,
});

// Subschema für ResourceSpecCharacteristic
const ResourceSpecCharacteristicSchema = new Schema({
  name: String,
  description: String,
  valueType: String,
  configurable: Boolean,
  minCardinality: Number,
  maxCardinality: Number,
  isUnique: Boolean,
  "@type": String,
  characteristicValueSpecification: [CharacteristicValueSpecificationSchema],
}, { _id: false });


// Hauptschema für ResourceSpecification
const ResourceSpecificationSchema = new Schema({
  href: String,
  name: String,
  description: String,
  "@type": String,
  "@schemaLocation": String,
  version: String,
  validFor: ValidFor,
  lastUpdate: Date,
  lifecycleStatus: String,
  isBundle: Boolean,
  category: String,
  attachment: [Attachment],
  relatedParty: [RelatedParty],
  resourceSpecCharacteristic: [ResourceSpecCharacteristicSchema],
});

//Pre-save Hook to generate href-attribute
ResourceSpecificationSchema.pre('save', function(next){
    if (!this.href) {
      this.href = `https://{host}/resourceCatalog/resourceSpecification/${this._id}`;
    }
    next();
  });

module.exports = mongoose.model('ResourceSpecification', ResourceSpecificationSchema);
