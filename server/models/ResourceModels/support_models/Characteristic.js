const mongoose = require('mongoose');

const CharacteristicSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  valueType: {
    type: String,
  },
  //characteristicRelationship: [characteristicRelationship],
  value: {
    type: mongoose.Schema.Types.Mixed, // Referenz auf das Any Schema
    required: true,
  }
}, { _id: false });

module.exports = mongoose.model('ResourceCharacteristic', CharacteristicSchema);
