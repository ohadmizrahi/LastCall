const mongoose = require('mongoose');
const cron = require('node-cron');

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
    airport: { type: String },
    terminal: { type: String },
    iata: { type: String },
    date: { type: String, required: true },
    time: { type: String, required: true }
  },
  arrival: {
    country: { type: String },
    airport: { type: String },
    terminal: { type: String },
    iata: { type: String },
    date: { type: String, required: true },
    time: { type: String, required: true }
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

const Flight = mongoose.model('Flight', flightSchema);

async function insertNewFlights(flightDataArray) {
  try {
    const flights = [];

    for (const data of flightDataArray) {

      const {
        flight: { status, number, iata, airplane, duration },
        departure: { airport: depAirport, terminal: depTerminal, iata: depIata, country: depCountry, date: depDate, time: depTime },
        arrival: { airport: arrAirport, terminal: arrTerminal, iata: arrIata, country: arrCountry, date: arrDate, time: arrTime },
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
            airport: depAirport,
            terminal: depTerminal,
            iata: depIata,
            date: depDate,
            time: depTime
          },
          arrival: {
            country: arrCountry,
            airport: arrAirport,
            terminal: arrTerminal,
            iata: arrIata,
            date: arrDate,
            time: arrTime
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

    return flights;
  } catch (error) {
    throw new Error('Error finding or creating flights: ' + error.message);
  }
}

async function updateOldFlightStatus() {
  const currentDate = new Date().getTime();
  const query = {
    $and: [
      { "flight.date": { $lte: currentDate } },
      { "flight.status": { $ne: "done" } }
    ]
  };
  try {
    const { matchedCount: matchedFlights, modifiedCount: modifiedFlights } = await Flight.updateMany(
      query,
      { $set: { "flight.status": "done" } }
    );

    if (matchedFlights === modifiedFlights && modifiedFlights > 0) {
      console.log(`${modifiedFlights} old flight's status has been updated to done`);
      return true
    } else if (matchedFlights === modifiedFlights && modifiedFlights === 0) {
      console.log("No old flights to update");
      return true
    } else {
      console.log(`Error: query match flights (${matchedFlights}) and modified flights (${modifiedFlights}) are not equal`);
    }
  }
  catch (error) {
    console.error("Error: update old flight got an error", error)
  }

};

async function findFlights(query = null) {
  try {
    const limit = 15
    if (query) {
      const flights = await Flight.find(query).limit(limit)
      console.log(flights);
      return flights

    } else {
      const flights = await Flight.aggregate([
        { $match: { "flight.status": { $ne: "done" } } },
        { $sample: { size: limit } }
      ]);
      
      console.log(flights);
      return flights
    }
  }
  catch (error) {
    console.error("Error: error trying to find flights", error)
  }
}



function buildFindQuery(dep, totalPassangers, fullDate=null, monthDate=null, des=null) {
  if (!(dep && ((fullDate && !monthDate) || (monthDate && !fullDate)) && totalPassangers)) {
    throw new Error("All of the parameters (dep, date or month, totalPassengers) must be provided.");
  } else {
    
    // Add month validation

    const oneMonthAhead = new Date(fullDate ? fullDate : monthDate)
    oneMonthAhead.setMonth(oneMonthAhead.getMonth() + 1);
    
    
    const query = {
      "departure.country": dep,
      "flight.date": { $gte: fullDate ? new Date(fullDate) :  new Date(monthDate), $lte: oneMonthAhead },
      "flight.status": { $ne: "done"}
    }

    if (des) {
      query["arrival.country"] = des;
    }
    
    return query
  }
}

// Schedule the updateFlightStatus function to run every day at midnight (00:00)
// cron.schedule('0 0 * * *', async () => {
//   console.log('Running flight status update...');
//   await updateOldFlightStatus()();
// });


module.exports.insertNewFlights = insertNewFlights;
module.exports.buildFindQuery = buildFindQuery;
module.exports.findFlights = findFlights;
module.exports.updateOldFlightStatus = updateOldFlightStatus




