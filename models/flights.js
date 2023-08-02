const mongoose = require('mongoose');
const cron = require('node-cron');

const flightSchema = new mongoose.Schema({
    flight: {
        date: { type: Date, required: true },
        status: { type: String, required: true },
        number: { type: String, required: true },
        iata: { type: String, required: true },
        airplane: { type: String, required: true }
    },
    departure: {
        country: { type: String },
        airport: { type: String },
        terminal: { type: String },
        iata: { type: String }
    },
    arrival: {
        country: { type: String },
        airport: { type: String },
        terminal: { type: String },
        iata: { type: String },
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
        flight: { date, status, number, iata, airplane },
        departure: { airport: depAirport, terminal: depTerminal, iata: depIata, country: depCountry },
        arrival: { airport: arrAirport, terminal: arrTerminal, iata: arrIata, country: arrCountry },
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
            date: date,
            status: status,
            number: number,
            iata: iata,
            airplane: airplane
          },
          departure: {
            country: depCountry,
            airport: depAirport,
            terminal: depTerminal,
            iata: depIata
          },
          arrival: {
            country: arrCountry,
            airport: arrAirport,
            terminal: arrTerminal,
            iata: arrIata
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
async function updateFlightStatus() {
    try {
      const currentDate = new Date().getTime();
      const flights = await Flight.find({ 'flight.status': 'scheduled' });
  
      let count = 0;
      for (const flight of flights) {
        const flightDate = Number(flight.flight.date);
  
        if (flightDate <= currentDate) {
          await Flight.updateOne({ _id: flight._id }, { $set: { 'flight.status': 'done' } });
          count++;
        }
      }
  
      if (count > 0) {
        console.log(`${count} flight(s) updated successfully.`);
      } else {
        console.log('No flights need to be updated.');
      }
    } catch (error) {
      console.error('Error updating flight statuses:', error.message);
    }
  }


// Schedule the updateFlightStatus function to run every day at midnight (00:00)
// cron.schedule('0 0 * * *', async () => {
//   console.log('Running flight status update...');
//   await updateFlightStatus();
// });


module.exports.insertNewFlights = insertNewFlights;


