const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    bestMonth: {
        type: String,
        required: true
    },
    avgRank: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    searches: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Destination', destinationSchema);