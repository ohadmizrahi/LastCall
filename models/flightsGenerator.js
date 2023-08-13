const { faker } = require('@faker-js/faker');
const { findAirportByCode } = require('./airports')
const { add } = require('date-fns');


async function generateFlights(numberOfFlights) {
    const flights = [];
    for (let count = 0; count < numberOfFlights; count++) {
        let newGoFlight = {}

        let flightData = {}
        let departureData = {}
        let arrivalData = {}
        let airlineData = {}
        let price;


        const { name: airline, iataCode: airlineIata } = faker.airline.airline();
        const { name: airportD, iataCode: airportIataD } = faker.airline.airport();
        const { name: airportA, iataCode: airportIataA } = faker.airline.airport();

        const { country: airportCountryD, city: airportCityD } = await findAirportByCode(airportIataD)
        const { country: airportCountryA, city: airportCityA } = await findAirportByCode(airportIataA)

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
        departureData.city = airportCityD
        departureData.dateTime = randomFlightDate

        const { date: arrDateTime, hours: flightHours, minutes: flightMinutes } = addRandomTimeToDate(randomFlightDate)
        arrivalData.airport = airportA;
        arrivalData.iata = airportIataA;
        arrivalData.terminal = faker.number.int({ min: 1, max: 8 })
        arrivalData.country = airportCountryA
        arrivalData.city = airportCityA
        arrivalData.dateTime = arrDateTime

        price = faker.finance.amount({ min: 50, max: 1500, dec: 2 })

        flightData.duration = `${flightHours}:${flightMinutes}`

        newGoFlight.flight = flightData
        newGoFlight.departure = departureData
        newGoFlight.arrival = arrivalData
        newGoFlight.airline = airlineData
        newGoFlight.price = parseFloat(price)

        flights.push(newGoFlight)

        const returnFlight = generateMatchReturnFlight(newGoFlight)

        flights.push(returnFlight)
    }
    console.log(flights);
    return flights

}

function generateMatchReturnFlight(goFlightData) {
    const newReturnFlight = {
        flight: { ...goFlightData.flight },
        departure: { ...goFlightData.arrival },
        arrival: { ...goFlightData.departure },
        airline: { ...goFlightData.airline },
        price: goFlightData.price
    };

    const { name: airline, iataCode: airlineIata } = faker.airline.airline();

    newReturnFlight.flight.number = faker.airline.flightNumber({ length: 4 })

    newReturnFlight.flight.iata = airlineIata + newReturnFlight.flight.number
    newReturnFlight.flight.airplane = faker.airline.airplane().name

    newReturnFlight.airline.name = airline
    newReturnFlight.airline.iata = airlineIata;

    newReturnFlight.departure = { ...goFlightData.arrival };
    newReturnFlight.arrival = { ...goFlightData.departure };

    newReturnFlight.departure.terminal = faker.number.int({ min: 1, max: 8 })
    newReturnFlight.arrival.terminal = faker.number.int({ min: 1, max: 8 })

    let newDepDate = new Date(newReturnFlight.departure.dateTime)
    newReturnFlight.departure.dateTime = new Date(newDepDate.setDate(newDepDate.getDate() + faker.number.int({ min: 2, max: 30 })))

    const { date: arrDateTime, hours: flightHours, minutes: flightMinutes } = addRandomTimeToDate(newReturnFlight.departure.dateTime)
    newReturnFlight.arrival.dateTime = arrDateTime

    newReturnFlight.price = faker.finance.amount({ min: 50, max: 1500, dec: 2 })
    newReturnFlight.flight.duration = `${flightHours}:${flightMinutes}`

    return newReturnFlight
}

function addRandomTimeToDate(depDate) {
    const randomHours = faker.number.int({ min: 1, max: 6 })
    const randomMinutes = faker.number.int({ min: 0, max: 59 })

    const totalMinutes = randomHours * 60 + randomMinutes;

    const arrDate = add(depDate, {
        minutes: totalMinutes,
    });

    return {
        date: new Date(arrDate),
        hours: randomHours,
        minutes: randomMinutes
    };
}


module.exports.generateFlights = generateFlights
