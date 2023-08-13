const { faker } = require('@faker-js/faker');
const { findAirportByCode } = require('./airports')
const { format, addMinutes, addHours, parseISO, add } = require('date-fns');


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

        const randomFlightDate = faker.date.future({ months: 6 })

        flightData.status = "schedule"
        flightData.number = faker.airline.flightNumber({ length: 4 })
        flightData.iata = airlineIata + flightData.number
        flightData.airplane = faker.airline.airplane().name
        

        airlineData.name = airline
        airlineData.iata = airlineIata;

        departureData.airport = airportD;
        departureData.iata = airportIataD;
        departureData.terminal = faker.number.int({ min: 1, max: 8 })
        departureData.country = airportCountryD
        departureData.date = format(randomFlightDate, 'dd/MM/yyyy')
        departureData.time = format(parseISO(randomFlightDate.toISOString()), 'HH:mm')

        const { date: arrDate, time: arrTime, hours: flightHours, minutes: flightMinutes } = addRandomTimeToDate(randomFlightDate)
        arrivalData.airport = airportA;
        arrivalData.iata = airportIataA;
        arrivalData.terminal = faker.number.int({ min: 1, max: 8 })
        arrivalData.country = airportCountryA
        arrivalData.date = arrDate
        arrivalData.time = arrTime

        price = faker.finance.amount({ min: 50, max: 1500, dec: 2 })

        flightData.duration = `${flightHours}:${flightMinutes}`

        newFlight.flight = flightData
        newFlight.departure = departureData
        newFlight.arrival = arrivalData
        newFlight.airline = airlineData
        newFlight.price = parseFloat(price)
        
        flights.push(newFlight)
    }

    return flights

}

function addRandomTimeToDate(depDate) {
    const randomHours = faker.number.int({ min: 1, max: 6 })
    const randomMinutes = faker.number.int({ min: 0, max: 59 })

    const totalMinutes = randomHours * 60 + randomMinutes;

    const arrDate = add(depDate, {
        minutes: totalMinutes,
    });

    return {
        date: format(arrDate, 'dd/MM/yyyy'),
        time: format(arrDate, 'HH:mm'),
        hours: randomHours,
        minutes: randomMinutes
    };
}

module.exports.generateFlights = generateFlights
