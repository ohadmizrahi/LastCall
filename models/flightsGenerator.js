const { faker } = require('@faker-js/faker');
const { findAirportByCode, findAirportByCity } = require('./airports')
const { add, parseISO } = require('date-fns');
const { formatCityName } = require('./lib')


async function generateFlights(numberOfFlights, manualFlight = null) {
    const flights = [];
    console.log("Start Generating new flights")
    for (let count = 0; count < numberOfFlights; count++) {

        let newGoFlight = {}

        let flightData = {}
        let departureData = {}
        let arrivalData = {}
        let airlineData = {}
        let price;
        let airlineCode;

        if (manualFlight) {

            const goDepCity = formatCityName(manualFlight.goDepCity)
            const goArrCity = formatCityName(manualFlight.goArrCity)

            airlineCode = manualFlight.goAirlineCode

            const { country: depCountry, code: depAirportCode, name: depAirportName } = await findAirportByCity(manualFlight.goDepCity)
            departureData.city = goDepCity
            departureData.country = depCountry
            departureData.airport = depAirportName
            departureData.iata = depAirportCode
            departureData.dateTime = parseISO(manualFlight.goDepDateTime)

            const { country: arrCountry, code: arrAirportCode, name: arrAirportName } = await findAirportByCity(manualFlight.goArrCity)
            arrivalData.city = goArrCity
            arrivalData.country = arrCountry
            arrivalData.airport = arrAirportName
            arrivalData.iata = arrAirportCode

            airlineData.name = manualFlight.goAirlineName
            airlineData.iata = manualFlight.goAirlineCode

            price = manualFlight.goPrice


        } else {
            const { name: airline, iataCode: airlineIata } = faker.airline.airline();
            const { name: airportD, iataCode: airportIataD } = faker.airline.airport();
            const { name: airportA, iataCode: airportIataA } = faker.airline.airport();

            const { country: airportCountryD, city: airportCityD } = await findAirportByCode(airportIataD)
            const { country: airportCountryA, city: airportCityA } = await findAirportByCode(airportIataA)

            const randomDepDate = faker.date.future({ months: 6 })

            airlineCode = airlineIata

            airlineData.name = airline
            airlineData.iata = airlineIata;

            departureData.airport = airportD;
            departureData.iata = airportIataD;
            departureData.country = airportCountryD
            departureData.city = formatCityName(airportCityD)
            departureData.dateTime = randomDepDate

            arrivalData.airport = airportA;
            arrivalData.iata = airportIataA;
            arrivalData.country = airportCountryA
            arrivalData.city = formatCityName(airportCityA)

            price = faker.finance.amount({ min: 50, max: 1500, dec: 2 })
        }

        flightData.status = "schedule"
        flightData.number = faker.airline.flightNumber({ length: 4 })
        flightData.iata = airlineCode + flightData.number
        flightData.airplane = faker.airline.airplane().name

        departureData.terminal = faker.number.int({ min: 1, max: 8 })
        arrivalData.terminal = faker.number.int({ min: 1, max: 8 })

        const { date: arrDateTime, hours: flightHours, minutes: flightMinutes } = addRandomTimeToDate(departureData.dateTime)

        arrivalData.dateTime = arrDateTime
        flightData.duration = `${flightHours}:${flightMinutes}`

        newGoFlight.flight = flightData
        newGoFlight.departure = departureData
        newGoFlight.arrival = arrivalData
        newGoFlight.airline = airlineData
        newGoFlight.price = parseFloat(price)

        flights.push(newGoFlight)

        if (!manualFlight || manualFlight.return) {
            const returnFlight = generateMatchReturnFlight(newGoFlight, manualFlight)
            flights.push(returnFlight)
        }
    }
    console.log("Finished Generating new flights")
    return flights

}

function generateMatchReturnFlight(goFlightData, manualFlight = null) {
    const newReturnFlight = {
        flight: { ...goFlightData.flight },
        departure: { ...goFlightData.arrival },
        arrival: { ...goFlightData.departure },
        airline: { ...goFlightData.airline },
        price: goFlightData.price
    };
    let airlineCode;

    newReturnFlight.departure = { ...goFlightData.arrival };
    newReturnFlight.arrival = { ...goFlightData.departure };

    if (manualFlight) {
        airlineCode = manualFlight.return.returnAirlineCode

        newReturnFlight.airline.name = manualFlight.return.returnAirlineName
        newReturnFlight.airline.iata = manualFlight.return.returnAirlineCode
        newReturnFlight.departure.dateTime = parseISO(manualFlight.return.returnDateTime)

        newReturnFlight.price = manualFlight.return.returnPrice

    } else {
        const { name: airline, iataCode: airlineIata } = faker.airline.airline();
        airlineCode = airlineIata

        newReturnFlight.airline.name = airline
        newReturnFlight.airline.iata = airlineIata;

        let newDepDate = new Date(newReturnFlight.departure.dateTime)
        newReturnFlight.departure.dateTime = new Date(newDepDate.setDate(newDepDate.getDate() + faker.number.int({ min: 2, max: 30 })))

        newReturnFlight.price = faker.finance.amount({ min: 50, max: 1500, dec: 2 })
    }


    newReturnFlight.flight.number = faker.airline.flightNumber({ length: 4 })
    newReturnFlight.flight.iata = airlineCode + newReturnFlight.flight.number
    newReturnFlight.flight.airplane = faker.airline.airplane().name

    newReturnFlight.departure.terminal = faker.number.int({ min: 1, max: 8 })
    newReturnFlight.arrival.terminal = faker.number.int({ min: 1, max: 8 })



    const { date: arrDateTime, hours: flightHours, minutes: flightMinutes } = addRandomTimeToDate(newReturnFlight.departure.dateTime)
    newReturnFlight.arrival.dateTime = arrDateTime
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
