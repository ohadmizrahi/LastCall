const mongoose = require('mongoose');


const airportSchema = new mongoose.Schema({
    code: { type: String, required: true },
    name: { type: String, required: true },
    country: { type: String, required: false }
});

const Airport = mongoose.model('Airport', airportSchema);


async function insertNewAirports(airportDataArray) {
    try {

        const airports = [];
        for (const data of airportDataArray) {
            // Extract relevant fields from the flightData
            const {
                name: airport_name,
                IATA: iata_code,
                country: country_name
            } = data;

            // Search for an existing flight based on number, iata, and icao
            const existingAirport = await Airport.findOne({
                'code': iata_code
            });

            if (!existingAirport) {
                // If the flight does not exist, create a new flight and save it to the database
                const newAirport = new Airport({
                    code: iata_code,
                    name: airport_name,
                    country: country_name
                })

                const savedAirport = await newAirport.save();
                airports.push(savedAirport);

            }
        }
        return airports

    } catch (error) {
        throw new Error('Error finding or creating flights: ' + error.message);
    }
}

async function findAirportByCode(code) {
    try {
      const airport = await Airport.findOne({ code: code });
      return airport;
    } catch (error) {
      console.error('Error finding airport by code:', error.message);
      throw error;
    }
  }

module.exports.insertNewAirports = insertNewAirports;
module.exports.findAirportByCode = findAirportByCode;