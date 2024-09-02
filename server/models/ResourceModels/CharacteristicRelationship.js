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
});

module.exports = mongoose.model('CharacteristicRelationship', CharacteristicRelationshipSchema);
