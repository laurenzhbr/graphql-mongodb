const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GeographicAddressSchema = new Schema({
  href: {
    type: String,
    strict: true,
  },
  city: {
    type: String,
    strict: true,
  },
  country: {
    type: String,
    strict: true,
  },
  postcode: {
    type: String,
    strict: true,
  },
  stateOrProvince: {
    type: String,
    strict: true,
  },
  streetName: {
    type: String,
    strict: true,
  },
  streetNr: {
    type: String,
    strict: true,
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
