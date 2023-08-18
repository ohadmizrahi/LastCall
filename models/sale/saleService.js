const Sale = require("./saleModel")
const moment = require('moment');

const { getDestImg } = require('../destination/destinationService.js')

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
      return 0
    } else {
      console.log("Sale already exist");
      return 1
    }
  } catch (error) {
    throw new Error('Error finding or creating sale: ' + error.message);
  }
}

async function deleteSale(filters) {
  try {
    const { destination: destination, departureDate: departureDate, returnDate: returnDate } = filters
    console.log("Deleting Sale");
    const result = await Sale.deleteOne({
      departureDate: new Date(departureDate),
      returnDate: new Date(returnDate),
      destination: destination
    });
    if (result.deletedCount < 1) {
      return 1
    } else {
      return 0
    }
  } catch (error) {
    console.error(error);
    return 2
  }
}

async function getAllSales() {
  console.log("Getting all sales ...");
  const sales = await Sale.find();

  const formattedSales = sales.map(sale => ({
    ...sale.toObject(),
    departureDate: moment(sale.departureDate).format('YYYY/MM/DD'),
    returnDate: moment(sale.returnDate).format('YYYY/MM/DD')
  }));

  return formattedSales;
}


module.exports.getAllSales = getAllSales;
module.exports.insertSale = insertSale;
module.exports.deleteSale = deleteSale