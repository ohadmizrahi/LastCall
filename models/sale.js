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
  picture: { 
    type: String,
    required: true 
  },
});

function getSales() {
  return [{
    destination: "Dubai",
    deal_dates:"15/5/23",
    min_price:123,
    picture:"https://assets.cntraveller.in/photos/6470565df0771fd865ff76b4/3:2/w_5184,h_3456,c_limit/Emirates%20Offering%20Free%20Hotel%20Stays%20This%20Summer%20to%20Passengers%20Flying%20to%20Dubai_emma-harrisova-UDsO83Ts6tQ-unsplash.jpg"
  },
  {
    destination: "Israel",
    deal_dates:"18/5/23",
    min_price:129,
    picture:"https://en.idi.org.il/media/17616/statistical_report_-arab.jpg"
  }];
}

saleSchema.plugin(findOrCreate);
module.exports = mongoose.model('Sale', saleSchema);
module.exports.getSales = getSales;
