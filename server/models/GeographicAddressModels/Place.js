const mongoose = require('mongoose');

const NoteSchema = new Schema({
  id: String,
  href: String,
  author: String,
  date: Date,
  text: String,
  "@referredType": String
});

const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;