const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GeographicAddressSchema = new Schema({
  href: {
    type: String,
  },
  city: {
    type: String,
  },
  country: {
    type: String,
  },
  postcode: {
    type: String,
  },
  stateOrProvince: {
    type: String,
  },
  streetName: {
    type: String,
  },
  streetNr: {
    type: String,
  }
});

//Pre-save Hook to generate href-attribute
GeographicAddressSchema.pre('save', function(next){
    if (!this.href) {
      this.href = `http://{host}/geographicAddressManagement/geographicAddress/${this._id}`;
    }
    next();
  })

module.exports = mongoose.model('GeographicAddress', GeographicAddressSchema);
