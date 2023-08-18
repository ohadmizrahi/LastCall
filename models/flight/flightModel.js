const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    flight: {
      status: { type: String, required: true },
      number: { type: String, required: true },
      iata: { type: String, required: true },
      airplane: { type: String, required: true },
      duration: { type: String, required: true }
    },
    departure: {
      country: { type: String },
      city: { type: String },
      airport: { type: String },
      terminal: { type: String },
      iata: { type: String },
      dateTime: { type: Date, required: true }
    },
    arrival: {
      country: { type: String },
      city: { type: String },
      airport: { type: String },
      terminal: { type: String },
      iata: { type: String },
      dateTime: { type: Date, required: true }
    },
    airline: {
      name: { type: String },
      iata: { type: String }
    },
    price: {
      type: Number,
      required: true,
      min: 50,
      max: 1500,
    },
  });

  module.exports = mongoose.model('Flight', flightSchema);