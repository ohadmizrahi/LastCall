const mongoose = require("mongoose");
const findOrCreate = require('mongoose-findorcreate');

const saleSchema = new mongoose.Schema({
  destination: {
    type: String,
    required: true
  },
  departure_date: { // Added departure date
    type: String,
    required: true
  },
  return: { // Added return date
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
    name: "Dubai",
    deal_dates:"15/5/23",
    min_price:123,
    picture:"https://assets.cntraveller.in/photos/6470565df0771fd865ff76b4/3:2/w_5184,h_3456,c_limit/Emirates%20Offering%20Free%20Hotel%20Stays%20This%20Summer%20to%20Passengers%20Flying%20to%20Dubai_emma-harrisova-UDsO83Ts6tQ-unsplash.jpg"
  },
  {
    name: "Israel",
    deal_dates:"18/5/23",
    min_price:129,
    picture:"https://en.idi.org.il/media/17616/statistical_report_-arab.jpg"
  },
  {
    name: "Paris",
    deal_dates:"20/6/23",
    min_price:200,
    picture:"https://res.klook.com/image/upload/Mobile/City/swox6wjsl5ndvkv5jvum.jpg"
  },
  {
    name: "New York",
    deal_dates:"25/6/23",
    min_price:300,
    picture:"https://images.musement.com/cover/0002/42/view-on-manhattan-at-night-new-york-city_header-141511.jpeg"
  },
  {
    name: "London",
    deal_dates:"10/7/23",
    min_price:250,
    picture:"https://assets.editorial.aetnd.com/uploads/2019/03/topic-london-gettyimages-760251843-feature.jpg"
  },
  {
    name: "Rome",
    deal_dates:"15/7/23",
    min_price:150,
    picture:"https://cdn.britannica.com/16/99616-050-72CD201A/Colosseum-Rome.jpg"
  },
  {
    name: "Tokyo",
    deal_dates:"20/8/23",
    min_price:350,
    picture:"https://upload.wikimedia.org/wikipedia/commons/b/b2/Skyscrapers_of_Shinjuku_2009_January.jpg"
  },
  {
    name: "Sydney",
    deal_dates:"25/8/23",
    min_price:400,
    picture:"https://cdn.britannica.com/96/100196-050-C92064E0/Sydney-Opera-House-Port-Jackson.jpg"
  },
  {
    name: "Berlin",
    deal_dates:"15/9/23",
    min_price:220,
    picture:"https://media.cntraveler.com/photos/5b914e80d5806340ca438db1/1:1/w_2250,h_2250,c_limit/BrandenburgGate_2018_GettyImages-549093677.jpg"
  },
  {
    name: "Beijing",
    deal_dates:"20/10/23",
    min_price:200,
    picture:"https://quicksilvertranslate.com/wp-content/uploads/iu-10-3-710x400.jpeg"
  },
  {
    name: "Rio de Janeiro",
    deal_dates:"25/10/23",
    min_price:230,
    picture:"https://upload.travelawaits.com/ta/uploads/2021/04/aerial-view-of-rio-de-janeiroee4454-800x800.jpg"
  }];
}



saleSchema.plugin(findOrCreate);
module.exports = mongoose.model('Sale', saleSchema);
module.exports.getSales = getSales;
