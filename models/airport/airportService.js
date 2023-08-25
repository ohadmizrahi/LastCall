
const Airport = require("./airportModel")
const fs = require('fs');


async function insertNewAirports(airportDataArray) {
  try {
    const airports = [];
    console.log("Start inserting airports");
    for (const data of airportDataArray) {
      const {
        name: airport_name,
        IATA: iata_code,
        country: country_name,
        city: city
      } = data;

      const existingAirport = await Airport.findOne({
        'code': iata_code
      });

      if (!existingAirport) {
        const newAirport = new Airport({
          code: iata_code,
          name: airport_name,
          country: country_name,
          city: city
        })

        const savedAirport = await newAirport.save();
        airports.push(savedAirport);

      }
    }
    console.log("Finish inserting airports");
    return airports

  } catch (error) {
    throw new Error('Error finding or creating flights: ' + error.message);
  }
}

async function findAirportByCode(code) {
  try {
    console.log(`Look for airport with code ${code}`);
    const airport = await Airport.findOne({ code: code });
    return airport;
  } catch (error) {
    console.error('Error finding airport by code:', error.message);
    throw error;
  }
}

async function findCityByCountry(country) {
  try {
    console.log(`Look for city in country ${country}`);
    const airport = await Airport.findOne({ country: country });
    return (airport.city).replace('-', ' ').toLowerCase().replace(/(?:^|\s)\w/g, function (match) { return match.toUpperCase(); });
  } catch (error) {
    console.error('Error finding city by country:', error.message);
    throw error;
  }
}

async function findAirportByCity(city) {
  try {
    console.log(`Look for airport in city ${city}`);
    const airport = await Airport.findOne({ city: city });
    return airport
  } catch (error) {
    console.error('Error finding airport by city:', error.message);
    throw error;
  }
}

async function getAllAirportsByField(field) {
  try {
    console.log("Getting destinations for validation ...");
    const airports = await Airport.find({}, [field]);
    const mappedAirports = airports.map(airport => airport[field]);
    return mappedAirports;
  } catch (error) {
    console.error('Error finding airports by city:', error.message);
    throw error;
  }
}

// const path = require('path');

// const filePath = path.join(__dirname, 'airports.json'); // Adjust the filename if needed

// fs.readFile(filePath, 'utf8', (err, data) => {
//     if (err) {
//         console.error('Error reading JSON file:', err);
//         return;
//     }

//     try {
//         const jsonArray = JSON.parse(data);
//         insertNewAirports(jsonArray)
//     } catch (error) {
//         console.error('Error parsing JSON:', error);
//     }
// });



module.exports.insertNewAirports = insertNewAirports;
module.exports.findAirportByCode = findAirportByCode;
module.exports.findCityByCountry = findCityByCountry
module.exports.findAirportByCity = findAirportByCity
module.exports.getAllAirportsByField = getAllAirportsByField
