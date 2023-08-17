const mongoose = require('mongoose');

const airportSchema = new mongoose.Schema({
    code: { type: String, required: true },
    name: { type: String, required: true },
    country: { type: String, required: false },
    city: { type: String, required: false }
});

module.exports = mongoose.model('Airport', airportSchema);