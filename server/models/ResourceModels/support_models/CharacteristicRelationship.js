const mongoose = require('mongoose');

const CharacteristicRelationshipSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  href: {
    type: String,
  },
  relationshipType: {
    type: String,
  }
}, { _id: false });

module.exports = mongoose.model('CharacteristicRelationship', CharacteristicRelationshipSchema);
