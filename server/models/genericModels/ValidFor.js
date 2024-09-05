const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ValidForSchema = new Schema({
    endDateTime: Date,
    startDateTime: Date
});

module.exports = mongoose.model('ValidFor', ValidForSchema);