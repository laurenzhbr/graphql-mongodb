const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  id: String,
  author: String,
  date: Date,
  text: String,
}, { _id: false });

//Pre-save Hook to generate href-attribute
NoteSchema.pre('save', function(next){
  const now = Date.now();

  // Setze das creationDate nur, wenn das Dokument neu ist
  if (!this.date) {
      this.date = now;
  }

  next();
})

const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;