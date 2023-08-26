const Sale = require("./saleModel")
const { getDestImg } = require('../../services/unsplash.js')
const { formatDate } = require('../lib')

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

    departureDate = formatDate(departureDate)
    returnDate = formatDate(returnDate)

    let departureDateTop = new Date(departureDate)
    const departureDateBottom = new Date(new Date(departureDate).setDate(departureDateTop.getDate() - 1))
    let returnDateTop = new Date(returnDate)
    const returnDateBottom = new Date(new Date(returnDate).setDate(returnDateTop.getDate() - 1))

    if (!img) {
      img = await getDestImg(destination)
    }

    const existingSale = await Sale.findOne({
      'destination': destination,
      'departureDate': {
        $gte: departureDateBottom,
        $lte: departureDateTop
      },
      'returnDate': {
        $gte: returnDateBottom,
        $lte: returnDateTop
      }
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
      console.log(newSale);
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
    let departureDateBottom = new Date(departureDate)
    const departureDateTop = new Date(new Date(departureDate).setDate(departureDateBottom.getDate() + 1))
    let returnDateBottom = new Date(returnDate)
    const returnDateTop = new Date(new Date(returnDate).setDate(returnDateBottom.getDate() + 1))

    console.log("Deleting Sale");

    const result = await Sale.deleteOne({
      departureDate: {
        $gte: departureDateBottom,
        $lte: departureDateTop
      },
      returnDate: {
        $gte: returnDateBottom,
        $lte: returnDateTop
      },
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
    departureDate: sale.departureDate,
    returnDate: sale.returnDate
  }));

  return formattedSales;
}


module.exports.getAllSales = getAllSales;
module.exports.insertSale = insertSale;
module.exports.deleteSale = deleteSale