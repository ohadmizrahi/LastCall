const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    rank: {
        type: String,
        required: true
    },
    happyContent: {
        type: String,
        required: true
    },
    badContent: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Review', reviewSchema);