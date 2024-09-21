const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  id: String,
  author: String,
  date: Date,
  text: String,
}, { _id: false });

const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;