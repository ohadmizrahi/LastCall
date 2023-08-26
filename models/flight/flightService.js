const Flight = require("./flightModel")
const cron = require('node-cron');
const { formatCityName, formatDuration } = require('../lib')



async function insertNewFlights(flightDataArray) {
  try {
    console.log("Start inserting new flights to DB");
    const flights = [];

    for (const data of flightDataArray) {

      const {
        flight: { status, number, iata, airplane, duration },
        departure: { airport: depAirport, terminal: depTerminal, iata: depIata, country: depCountry, city: depCity, dateTime: depDateTime },
        arrival: { airport: arrAirport, terminal: arrTerminal, iata: arrIata, country: arrCountry, city: arrCity, dateTime: arrDateTime },
        airline: { name: airlineName, iata: airlineIata },
        price: price
      } = data;


      const existingFlight = await Flight.findOne({
        'flight.number': number,
        'flight.iata': iata,
      });

      if (!existingFlight) {

        const newFlight = new Flight({
          flight: {
            status: status,
            number: number,
            iata: iata,
            airplane: airplane,
            duration: duration
          },
          departure: {
            country: depCountry,
            city: depCity,
            airport: depAirport,
            terminal: depTerminal,
            iata: depIata,
            dateTime: depDateTime
          },
          arrival: {
            country: arrCountry,
            city: arrCity,
            airport: arrAirport,
            terminal: arrTerminal,
            iata: arrIata,
            dateTime: arrDateTime
          },
          airline: {
            name: airlineName,
            iata: airlineIata
          },
          price: price
        });

        const savedFlight = await newFlight.save();
        flights.push(savedFlight);
      }
    }
    console.log("Finished inserting new flights to DB");
    return flights;
  } catch (error) {
    throw new Error('Error finding or creating flights: ' + error.message);
  }
}


async function findFlights(limit, query = null, returnDate = null) {
  try {

    const goFlights = await findGoFlights(limit, query)
    const flights = await findReturnFlights(goFlights, returnDate)

    return flights
  }
  catch (error) {
    console.error("Error: error trying to find flights", error)
  }
}

async function findGoFlights(limit, query = null) {
  let goFlights;
  if (query) {
    console.log("Looking for Go Flights");
    goFlights = await Flight.find(query).limit(limit)
  } else {
    console.log("Get All flights");
    goFlights = await Flight.aggregate([
      { $match: { "flight.status": { $ne: "done" } } },
      { $sample: { size: limit } }
    ]);
  }
  goFlights = goFlights.map(flight => {
    flight.flight.duration = formatDuration(flight.flight.duration);
    return flight;
  });

  return goFlights;
}

async function findReturnFlights(goFlights, returnDate) {
  console.log("Looking for Return Flights");
  const flightsArray = [];
  for (const goFlight of goFlights) {

    let newReturnDate;

    if (returnDate) {
      newReturnDate = new Date(returnDate);
    } else {
      newReturnDate = new Date(goFlight.arrival.dateTime);
      newReturnDate.setDate(newReturnDate.getDate() + 2);
    }

    const query = buildFindQuery(goFlight.departure.city, newReturnDate, goFlight.arrival.city);

    const returnFlights = await Flight.findOne(query)
    if (returnFlights && returnFlights.flight && returnFlights.flight.duration) {
      returnFlights.flight.duration = formatDuration(returnFlights.flight.duration);
    }
    flightsArray.push({ go: goFlight, return: returnFlights });
  }
  return flightsArray;
}



function buildFindQuery(des, fullDate, dep = null, noRange = false) {
  if (!(des && fullDate)) {
    console.error("All of the parameters (des, date) must be provided.");
  } else {
    let dateRange = new Date(fullDate)

    if (noRange) {
      dateRange.setDate(dateRange.getDate() + 1);
    } else {
      dateRange.setMonth(dateRange.getMonth() + 1);
    }


    const query = {
      "arrival.city": formatCityName(des),
      "departure.dateTime": { $gte: new Date(fullDate), $lte: dateRange },
      "flight.status": { $ne: "done" }
    }

    if (dep) {
      query["departure.city"] = formatCityName(dep);
    }

    return query
  }
}

async function deleteFlights(dataToDeleteBy) {
  try {
    const constDeparture = "Tel Aviv"
    const { destination: destination, departureDate: goDate, returnDate: returnDate } = dataToDeleteBy
    let departureDateBottom = new Date(goDate)
    const departureDateTop = new Date(goDate).setDate(departureDateBottom.getDate() + 1)
    let returnDateBottom = new Date(returnDate)
    const returnDateTop = new Date(returnDate).setDate(returnDateBottom.getDate() + 1)

    console.log("Deleting Flights");
    const resultGo = await Flight.deleteMany({
      "departure.city": constDeparture,
      "arrival.city": destination,
      "departure.dateTime": {
        $gte: departureDateBottom,
        $lt: departureDateTop
      }
    });
    const resultReturn = await Flight.deleteMany({
      "departure.city": destination,
      "arrival.city": constDeparture,
      "departure.dateTime": {
        $gte: returnDateBottom,
        $lt: returnDateTop
      }
    });

    const totalDeleted = resultGo.deletedCount + resultReturn.deletedCount;
    console.log(totalDeleted);

    return totalDeleted;
  } catch (error) {
    console.error(error);
    return 1
  }
}


// async function deleteOldFlights() {
//   const currentDate = new Date().getTime();
//   const query = {
//     $and: [
//       { "flight.date": { $lte: currentDate } },
//       { "flight.status": { $ne: "done" } }
//     ]
//   };
//   try {
//     const { matchedCount: matchedFlights, modifiedCount: modifiedFlights } = await Flight.updateMany(
//       query,
//       { $set: { "flight.status": "done" } }
//     );

//     if (matchedFlights === modifiedFlights && modifiedFlights > 0) {
//       console.log(`${modifiedFlights} old flight's status has been updated to done`);
//       return true
//     } else if (matchedFlights === modifiedFlights && modifiedFlights === 0) {
//       console.log("No old flights to update");
//       return true
//     } else {
//       console.log(`Error: query match flights (${matchedFlights}) and modified flights (${modifiedFlights}) are not equal`);
//     }
//   }
//   catch (error) {
//     console.error("Error: update old flight got an error", error)
//   }

// };


module.exports.insertNewFlights = insertNewFlights;
module.exports.buildFindQuery = buildFindQuery;
module.exports.findFlights = findFlights;
module.exports.deleteFlights = deleteFlights