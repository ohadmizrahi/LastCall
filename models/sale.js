const mongoose = require("mongoose");
const findOrCreate = require('mongoose-findorcreate');
const { getDestImg } = require('./destinations.js')

const saleSchema = new mongoose.Schema({
  destination: {
    type: String,
    required: true
  },
  departureDate: {
    type: String,
    required: true
  },
  returnDate: {
    type: String,
    required: true
  },
  minPrice: {
    type: Number,
    required: true
  },
  img: {
    type: String,
    required: true
  },
});

const Sale = mongoose.model('Sale', saleSchema);

async function insertSale(sale) {
  try {
    console.log("Start inserting sale");
    let {
      destination: destination,
      departureDate: departureDate,
      returnDate: returnDate,
      minPrice: minPrice,
      img: img
    } = sale;

    if (!img) {
      img = await getDestImg(destination)
    }

    const existingSale = await Sale.findOne({
      'destination': destination,
      'departureDate': departureDate,
      'returnDate': returnDate
    });

    if (!existingSale) {
      console.log("Inserting new sale");
      const newSale = new Sale({
        destination: destination,
        departureDate: departureDate,
        returnDate: returnDate,
        minPrice: minPrice,
        img: img
      });

      const savedSale = await newSale.save();
    } else {
      console.log("Sale already exist");
    }
  } catch (error) {
    throw new Error('Error finding or creating sale: ' + error.message);
  }
}

async function getAllSales() {
  const sales = await Sale.find()
  return sales
}
// getAllSales().forEach((sale) => {
//   insertSale(sale)
// })




saleSchema.plugin(findOrCreate);
module.exports.getAllSales = getAllSales;