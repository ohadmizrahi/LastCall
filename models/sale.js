const mongoose = require("mongoose");
const findOrCreate = require('mongoose-findorcreate');

const saleSchema = new mongoose.Schema({
    destination: {
      type: String,
      required: true
    },
    deal_dates: {
      type: String,
      required: true
    },
    min_price: {
      type: Number,
      required: true
    },
  });

  function getSales() {
    return [{
      destination: "Dubai",
      deal_dates:"15/5/23",
      min_price:123
    },
    {
      destination: "israel",
      deal_dates:"18/5/23",
      min_price:129
    }];
  }

  saleSchema.plugin(findOrCreate);
  module.exports = mongoose.model('Sale', saleSchema);
  module.exports.getSales = getSales