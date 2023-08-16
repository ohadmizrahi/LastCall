const mongoose = require("mongoose");
const moment = require('moment');
const findOrCreate = require('mongoose-findorcreate');
const { getDestImg } = require('./destinations.js')


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

const Sale = mongoose.model('Sale', saleSchema);

async function insertSale(sale) {
  try {
    console.log("Start inserting sale");
    let {
      destination: destination,
      departureDate: departureDate,
      returnDate: returnDate,
      dealPrice: dealPrice,
      numberOfDays: numberOfDays,
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
      
      const newSale = new Sale({
        destination: destination,
        departureDate: departureDate,
        returnDate: returnDate,
        dealPrice: dealPrice,
        numberOfDays: numberOfDays,
        img: img
      });

      await newSale.save();
      console.log("Sale inserted");
    } else {
      console.log("Sale already exist");
    }
  } catch (error) {
    throw new Error('Error finding or creating sale: ' + error.message);
  }
}

async function getAllSales() {
  const sales = await Sale.find();

  const formattedSales = sales.map(sale => ({
    ...sale.toObject(),
    departureDate: moment(sale.departureDate).format('YYYY/MM/DD'),
    returnDate: moment(sale.returnDate).format('YYYY/MM/DD')
  }));

  return formattedSales;
}





saleSchema.plugin(findOrCreate);
module.exports.getAllSales = getAllSales;
module.exports.insertSale = insertSale;