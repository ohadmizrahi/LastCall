const mongoose = require("mongoose");
const findOrCreate = require('mongoose-findorcreate');

const saleSchema = new mongoose.Schema({
    destination: {
        type: String,
        required: true
    },
    departureDate: {
        type: Date,
        required: true
    },
    returnDate: {
        type: Date,
        required: true
    },
    dealPrice: {
        type: Number,
        required: false
    },
    numberOfDays: {
        type: Number,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    timeStamp: {
        type: Date,
        default: new Date()
    },
});

saleSchema.plugin(findOrCreate);
module.exports = mongoose.model('Sale', saleSchema);