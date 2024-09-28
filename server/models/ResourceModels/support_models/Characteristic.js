const mongoose = require('mongoose');

const CharacteristicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  valueType: {
    type: String,
  },
  value: {
    type: mongoose.Schema.Types.Mixed, // Referenz auf das Any Schema
    required: true,
  }
}, { _id: false });

module.exports = mongoose.model('ResourceCharacteristic', CharacteristicSchema);
