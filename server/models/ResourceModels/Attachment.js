const mongoose = require('mongoose');

const AttachmentRefOrValueSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  href: {
    type: String,
  },
  attachmentType: {
    type: String,
  },
  content: {
    type: String,
  },
  description: {
    type: String,
  },
  mimeType: {
    type: String,
  },
  name: {
    type: String,
  },
  url: {
    type: String,
  }
});

module.exports = mongoose.model('AttachmentRefOrValue', AttachmentRefOrValueSchema);
