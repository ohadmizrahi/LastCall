const { faker } = require('@faker-js/faker');
const { findAirportByCode } = require('./airports')


async function generateFlights(numberOfFlights) {
    const flights = [];
    for (let count = 0; count < numberOfFlights; count++) {
        let newFlight = {}

        let flightData = {}
        let departureData = {}
        let arrivalData = {}
        let airlineData = {}
        let price;


        const { name: airline, iataCode: airlineIata } = faker.airline.airline();
        const { name: airportD, iataCode: airportIataD } = faker.airline.airport();
        const { name: airportA, iataCode: airportIataA } = faker.airline.airport();

        const { country: airportCountryD } = await findAirportByCode(airportIataD)
        const { country: airportCountryA } = await findAirportByCode(airportIataA)

        flightData.date = faker.date.future({ months: 6 })
        flightData.status = "schedule"
        flightData.number = faker.airline.flightNumber({length: 4})
        flightData.iata =  airlineIata + flightData.number
        flightData.airplane = faker.airline.airplane().name

        airlineData.name = airline
        airlineData.iata = airlineIata;
        
        departureData.airport = airportD;
        departureData.iata = airportIataD;
        departureData.terminal = faker.number.int({ min: 1, max: 8 })
        departureData.country = airportCountryD

        arrivalData.airport = airportA;
        arrivalData.iata = airportIataA;
        arrivalData.terminal = faker.number.int({ min: 1, max: 8 })
        arrivalData.country = airportCountryA

        price = faker.finance.amount({ min: 50, max: 1500, dec: 2})

        newFlight.flight = flightData
        newFlight.departure = departureData
        newFlight.arrival = arrivalData
        newFlight.airline = airlineData
        newFlight.price = parseFloat(price)
        flights.push(newFlight)
    }

    return flights

}

module.exports.generateFlights = generateFlights