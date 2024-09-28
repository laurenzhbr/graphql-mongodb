const mongoose = require('mongoose');

const RelatedPartySchema = new mongoose.Schema({
  id: {
        type: String,
        required: true
    },
  href: String,
  name: String,
  role: String,
}, { _id: false });

//Pre-save Hook to generate href-attribute
RelatedPartySchema.pre('save', function(next){
  if (!this.href) {
    this.href = `http://{host}/partyManagement/organization/${this.id}`;
  }
  next();
})

const RelatedParty = mongoose.model('RelatedParty', RelatedPartySchema);

module.exports = RelatedParty;