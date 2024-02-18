const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
    FullName: String,
    Phone: String 
});

module.exports = mongoose.model('Contact', contactSchema);