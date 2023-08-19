const { Router } = require('express');
const bodyParser = require("body-parser");
const { parse, format } = require('date-fns');
const { getAllSales } = require('../models/sale/saleService')
const { updateDestinationsPopularity } = require('../models/destination/destinationService')
const { buildFindQuery, findFlights } = require('../models/flight/flightService')
const { findCityByCountry, getAllAirportsByField } = require('../models/airport/airportService')


const router = Router();

router.use(bodyParser.json());

let VALID_DESTINATIONS;

(async () => {
    VALID_DESTINATIONS = await getAllAirportsByField("city");
})();


router.get("/flights", async (req, res) => {
    if (req.isAuthenticated()) {
        const salesData = await getAllSales()
        const userCountry = req.cookies.userCountry;
        const userCity = await findCityByCountry(userCountry)

        let flights;
        let alertData;

        if (req.session.alertData) {
            alertData = req.session.alertData
        }

        if (req.session.searchFlights) {
            flights = req.session.searchFlights

        } else {
            const limit = 5
            flights = await findFlights(limit)
        }
        if (flights.length < 1) {
            flights = null
        }
        req.session.searchFlights = null
        req.session.alertData = null;

        res.render("index",
            {
                body: { main: "partials/flights/flightsBody", flights: flights, defaultDep: userCity, validationData: VALID_DESTINATIONS },
                header: { main: "partials/headers/main", auth: "authDiv/afterAuth", pageTitle: "Flights" },
                sales: { main: "../generalPartials/salesBar", data: salesData },
                alert: { main: "../alert/main", data: alertData, redirectTo: "/flights" }
            })

    } else {
        res.cookie("returnTo", "/flights")
        res.redirect("/login");
    }

})


router.post("/search_flights", async (req, res) => {
    try {
        let {
            departure: departure,
            destination: destination,
            departureDate: departureDate,
            returnDate: returnDate,
            travelers: travelers
        } = req.body
        console.log(req.body);
        const limit = 5
        let noRange = false
        if (req.body.manual) {
            departureDate = format(parse(departureDate, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd')
            returnDate = format(parse(returnDate, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd')
            noRange = true
        }

        const query = buildFindQuery(destination, departureDate, departure, noRange)
        console.log(query);
        const flights = await findFlights(limit, query, returnDate)

        if (flights.length < 1) {
            req.session.alertData = {
                header: "Can't Find Flights",
                content: `We're here to help! Adjust your search parameters or check back later as we constantly update our flight listings.`
            }
        }

        req.session.searchFlights = flights;
        await updateDestinationsPopularity({ name: destination })

        if (departure) {
            res.redirect("/flights")
        } else {
            res.json({ success: true })
        }
    }
    catch (error) {
        console.error('Error:', error);
        req.session.alertData = {
            header: "Error Finding Flights",
            content: `Please Try Again`
        }
        res.redirect("/flights")
    }
})

router.get("/order", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("index",
            {
                body: { main: "partials/flights/orderFlight", flights: JSON.parse(req.query.flightData) },
                header: { main: "partials/headers/main", auth: "authDiv/afterAuth", pageTitle: "Order" }
            })
    } else {
        res.redirect("/login")
    };

});

module.exports = router;