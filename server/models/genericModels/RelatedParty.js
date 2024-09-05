const mongoose = require('mongoose');

const RelatedPartySchema = new mongoose.Schema({
  id: {
        type: String,
        required: true
    },
  href: String,
  name: String,
  role: String,
  "@baseType": String,
  "@schemaLocation": String,
  "@type": String,
  "@referredType": String
}, { _id: false });

//Pre-save Hook to generate href-attribute
RelatedPartySchema.pre('save', function(next){
  if (!this.href) {
    this.href = `https://{host}/partyManagement/party/${this.id}`;
  }
  next();
})

const RelatedParty = mongoose.model('RelatedParty', RelatedPartySchema);

module.exports = RelatedParty;