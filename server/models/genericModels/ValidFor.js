const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ValidForSchema = new Schema({
    endDateTime: Date,
    startDateTime: Date
}, { _id: false });

module.exports = mongoose.model('ValidFor', ValidForSchema);